import { Op, fn, col, literal } from 'sequelize';
import { Property, Review, ManagerResponse, sequelize } from '../db/index.js';

/**
 * Controller: list
 * Returns a list of all properties (id + name), sorted alphabetically.
 */
export async function list(_req, res, next) {
    try {
        const items = await Property.findAll({
            order: [['name', 'ASC']],      // Sort properties by name
            attributes: ['id', 'name']     // Only return id and name
        });
        res.json(items);
    } catch (err) {
        next(err); // Pass error to Express error handler
    }
}

/**
 * Controller: kpis
 * Returns KPI (Key Performance Indicators) for a given property:
 * - Average rating
 * - Total reviews
 * - Response rate (manager responses / total reviews)
 */
export async function kpis(req, res, next) {
    try {
        const { id } = req.params;
        // If ?since query param provided, use it; otherwise, default to last 90 days
        const since = req.query.since
            ? new Date(req.query.since)
            : new Date(Date.now() - 90 * 24 * 3600 * 1000);

        // 1. Average rating and total reviews since `since`
        const k = await Review.findOne({
            where: { property_id: id, submitted_at: { [Op.gte]: since } },
            attributes: [
                [fn('avg', col('rating')), 'average_rating'],
                [fn('count', col('id')), 'total_reviews']
            ],
            raw: true
        });

        // 2. Calculate response rate: # of manager responses / # of reviews
        const totals = await Review.findAll({
            where: { property_id: id, submitted_at: { [Op.gte]: since } },
            attributes: [
                [fn('count', col('review.id')), 'total'],          // total reviews
                [fn('count', col('manager_response.id')), 'responded'] // reviews with a manager response
            ],
            include: [
                {
                    model: ManagerResponse,
                    as: 'manager_response',   // must match alias in association
                    required: false,          // left join, not inner join
                    attributes: []
                }
            ],
            raw: true
        });

        // Extract numbers safely
        const total = Number(totals[0]?.total || 0);
        const responded = Number(totals[0]?.responded || 0);

        // Respond with KPIs
        res.json({
            property_id: Number(id),
            average_rating: k.average_rating ? Number(k.average_rating).toFixed(1) * 1 : null,
            total_reviews: Number(k.total_reviews || 0),
            response_rate: total ? responded / total : 0
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Controller: trends
 * Returns a time-series trend for a given property:
 * - By default buckets reviews by month since the start of the year
 * - Supports metrics: "count" (total reviews) or "avg_rating"
 */
export async function trends(req, res, next) {
    try {
        const { id } = req.params;
        // Default start: beginning of current year
        const since = req.query.since
            ? new Date(req.query.since)
            : new Date(new Date().getFullYear(), 0, 1);

        const metric = (req.query.metric || 'count');   // Metric: "count" | "avg_rating"
        const bucket = (req.query.bucket || 'month');   // Bucket size: only "month" supported for now

        // SQL: date_trunc('month', submitted_at)
        const bucketExpr = fn('date_trunc', bucket, col('submitted_at'));

        // Choose attributes based on metric
        const attrs =
            metric === 'avg_rating'
                ? [[fn('avg', col('rating')), 'y'], [bucketExpr, 'x']]
                : [[fn('count', col('id')), 'y'], [bucketExpr, 'x']];

        // Query reviews grouped by time bucket
        const rows = await Review.findAll({
            where: { property_id: id, submitted_at: { [Op.gte]: since } },
            attributes: attrs,
            group: ['x'],                  // group by bucket
            order: [[literal('x'), 'ASC']],// chronological order
            raw: true
        });

        // Transform into chart-friendly format: [{ x: 'YYYY-MM', y: number }]
        const series = rows.map(r => ({
            x: new Date(r.x).toISOString().slice(0, 7), // 'YYYY-MM'
            y: metric === 'avg_rating' ? Number(r.y).toFixed(1) * 1 : Number(r.y)
        }));

        // Return series wrapped in dataset
        res.json({
            property_id: Number(id),
            bucket,
            series: [{
                label: metric === 'avg_rating' ? 'Average Rating' : 'Reviews',
                data: series
            }]
        });
    } catch (err) {
        next(err);
    }
}
