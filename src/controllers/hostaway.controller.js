import fs from 'node:fs/promises';
import { Op } from 'sequelize';
import { Property, Review, ReviewCategory, sequelize } from '../db/index.js';

/**
 * Map a single Hostaway review item → normalized structure
 * - Splits into property, review, and review categories
 * - Handles null/optional fields and standardizes shapes
 */
function mapHostawayItem(item) {
    // Extract fields (adjust names if Hostaway payload differs)
    const {
        id,
        type, status, rating, publicReview,
        submittedAt, guestName, listingName,
        reviewCategory = []
    } = item;

    // Normalized representation
    const normalized = {
        property: {
            name: listingName // link to Property table by name
        },
        review: {
            source: 'hostaway',                     // external system
            source_review_id: String(id),           // unique external review ID
            type,                                   // type of review
            status,                                 // review status
            rating: rating == null ? null : Number(rating), // keep rating as number
            comment: publicReview || null,          // review text
            channel: 'hostaway',                    // ingestion channel
            submitted_at: submittedAt ? new Date(submittedAt) : null,
            guest_name: guestName || null
        },
        categories: reviewCategory.map(rc => ({
            category: rc.category || rc.name || 'general', // normalize category name
            score: Number(rc.score ?? rc.value ?? 0)       // normalize score field
        }))
    };
    return normalized;
}

/**
 * Controller: fetchNormalize
 * Reads mock Hostaway data, normalizes it, and optionally persists it.
 * Query params:
 *  - since=YYYY-MM-DD : filter by submittedAt
 *  - limit=N          : limit number of records
 *  - dryRun=true      : normalize only, don't persist
 */
export async function fetchNormalize(req, res, next) {
    try {
        const { since, limit, dryRun = 'false' } = req.query;

        // (A) Load data from mock file (simulate Hostaway API)
        const raw = await fs.readFile('data/hostaway_mock.json', 'utf8');
        const payload = JSON.parse(raw); // file format: { result: [...] }

        let items = payload.result || payload || [];

        // Filter by "since" if provided
        if (since) {
            const s = new Date(since);
            items = items.filter(x => new Date(x.submittedAt) >= s);
        }

        // Apply limit if provided
        if (limit) items = items.slice(0, Number(limit));

        // Normalize each item
        const normalized = items.map(mapHostawayItem);

        // If dry run: just return normalized output
        if (dryRun === 'true') {
            return res.json({
                source: 'hostaway',
                normalized,
                count: normalized.length
            });
        }

        // (B) Persist data inside a transaction (all-or-nothing)
        let ingested = 0, skipped = 0;
        await sequelize.transaction(async (t) => {
            for (const n of normalized) {
                // 1. Upsert property by name
                const [prop] = await Property.findOrCreate({
                    where: { name: n.property.name },
                    defaults: { hostaway_listing_name: n.property.name },
                    transaction: t
                });

                // 2. Skip duplicate reviews (same source + source_review_id)
                const exists = await Review.findOne({
                    where: {
                        source: 'hostaway',
                        source_review_id: n.review.source_review_id
                    },
                    transaction: t
                });
                if (exists) {
                    skipped++;
                    continue;
                }

                // 3. Insert new review
                const review = await Review.create(
                    { ...n.review, property_id: prop.id },
                    { transaction: t }
                );

                // 4. Insert associated review categories (if any)
                if (n.categories?.length) {
                    await ReviewCategory.bulkCreate(
                        n.categories.map(c => ({ ...c, review_id: review.id })),
                        { transaction: t }
                    );
                }

                ingested++;
            }
        });

        // Respond with ingestion summary
        return res.status(201).json({
            source: 'hostaway',
            ingested,
            skipped
        });
    } catch (err) {
        next(err);
    }
}
