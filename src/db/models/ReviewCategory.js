import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class ReviewCategory extends Model { }
    ReviewCategory.init(
        {
            id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
            review_id: { type: DataTypes.BIGINT, allowNull: false },
            category: { type: DataTypes.TEXT, allowNull: false },
            score: { type: DataTypes.DECIMAL(3, 1), allowNull: false } // 0-10
        },
        { sequelize, modelName: 'review_category', tableName: 'review_category', underscored: true, timestamps: false }
    );
    return ReviewCategory;
};
