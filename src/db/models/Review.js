import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class Review extends Model { }
    Review.init(
        {
            id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
            property_id: { type: DataTypes.BIGINT, allowNull: false },
            source: { type: DataTypes.TEXT, allowNull: false },              // 'hostaway'|'google'|'manual'
            source_review_id: { type: DataTypes.TEXT },                       // unique per source
            type: { type: DataTypes.TEXT },                                   // 'guest-to-host'|'host-to-guest'
            status: { type: DataTypes.TEXT },                                 // 'published'|'pending'|'hidden'|'archived'
            rating: { type: DataTypes.DECIMAL(2, 1) },                         // 0-5 (nullable)
            comment: { type: DataTypes.TEXT },
            channel: { type: DataTypes.TEXT },                                // 'airbnb','booking','google',...
            submitted_at: { type: DataTypes.DATE },
            guest_name: { type: DataTypes.TEXT },
            approved_for_website: { type: DataTypes.BOOLEAN, defaultValue: false }
        },
        {
            sequelize,
            modelName: 'review',
            tableName: 'review',
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false,
            indexes: [
                { fields: ['property_id', 'submitted_at'] },
                { fields: ['channel', 'status', 'approved_for_website'] },
                { fields: ['rating'] },
                { unique: true, fields: ['source', 'source_review_id'] }
            ]
        }
    );
    return Review;
};
