import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class ManagerResponse extends Model { }
    ManagerResponse.init(
        {
            id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
            review_id: { type: DataTypes.BIGINT, allowNull: false },
            body: { type: DataTypes.TEXT, allowNull: false },
            responded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
        },
        { sequelize, modelName: 'manager_response', tableName: 'manager_response', underscored: true, timestamps: false }
    );
    return ManagerResponse;
};
