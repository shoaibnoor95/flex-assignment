import { Op, where, col, fn, literal } from 'sequelize';

export function buildReviewFilters(q) {
    const whereClause = {};
    if (q.propertyId) whereClause.property_id = q.propertyId;
    if (q.status) whereClause.status = q.status;
    if (q.channel) whereClause.channel = q.channel;
    if (q.ratingGte || q.ratingLte) {
        whereClause.rating = {};
        if (q.ratingGte) whereClause.rating[Op.gte] = Number(q.ratingGte);
        if (q.ratingLte) whereClause.rating[Op.lte] = Number(q.ratingLte);
    }
    if (q.since) whereClause.submitted_at = { [Op.gte]: new Date(q.since) };
    if (q.until) {
        whereClause.submitted_at = { ...(whereClause.submitted_at || {}), [Op.lte]: new Date(q.until) };
    }
    return whereClause;
}
