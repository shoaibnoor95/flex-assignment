import { Property, Review } from '../db/index.js';

/**
 * Controller: propertyDetails
 * Fetch detailed information about a property by id or slug.
 */
export async function propertyDetails(req, res, next) {
    try {
        const { idOrSlug } = req.params;

        // Determine whether to query by numeric ID or slug
        const where = isFinite(Number(idOrSlug))
            ? { id: idOrSlug }
            : { slug: idOrSlug };

        // Look up the property, selecting only relevant fields
        const prop = await Property.findOne({
            where,
            attributes: [
                'id', 'name', 'slug', 'description', 'specs', 'amenities', 'house_rules',
                'cancellation_policy', 'location', 'images'
            ]
        });

        // Return 404 if not found
        if (!prop) {
            return res.status(404).json({
                error: { code: 'not_found', message: 'Property not found' }
            });
        }

        // Normalize response, falling back to empty objects/arrays
        res.json({
            id: prop.id,
            name: prop.name,
            slug: prop.slug,
            description: prop.description,
            specs: prop.specs || {},
            amenities: prop.amenities || [],
            house_rules: prop.house_rules || [],
            cancellation_policy: prop.cancellation_policy || {},
            location: prop.location || {},
            images: prop.images || []
        });
    } catch (e) {
        next(e); // Delegate to Express error middleware
    }
}

/**
 * Controller: approvedReviews
 * Returns published reviews approved for website display for a given property.
 */
export async function approvedReviews(req, res, next) {
    try {
        const { id } = req.params;

        // Limit max results to 50 (default 10 if not provided)
        const limit = Math.min(50, Number(req.query.limit || 10));

        // Find reviews for the property
        const rows = await Review.findAll({
            where: {
                property_id: id,
                approved_for_website: true,
                status: 'published'
            },
            order: [['submitted_at', 'DESC']], // newest first
            limit,
            attributes: ['rating', 'comment', 'submitted_at', 'guest_name']
        });

        // Return response with metadata + review items
        res.json({
            property_id: Number(id),
            count: rows.length,
            items: rows
        });
    } catch (err) {
        next(err);
    }
}
