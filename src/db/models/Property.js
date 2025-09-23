import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class Property extends Model { }

    Property.init(
        {
            id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },

            // Core
            name: { type: DataTypes.TEXT, allowNull: false },
            hostaway_listing_name: { type: DataTypes.TEXT },
            channel_default: { type: DataTypes.TEXT },

            // New public details
            slug: { type: DataTypes.TEXT, allowNull: true, unique: true },
            description: { type: DataTypes.TEXT, allowNull: true },

            // JSONB columns (Postgres)
            // specs example: { guests, bedrooms, bathrooms, beds, checkin_time, checkout_time }
            specs: { type: DataTypes.JSONB, allowNull: true },

            // amenities example: ["Cable TV","Kitchen",...]
            amenities: { type: DataTypes.JSONB, allowNull: true },

            // house_rules example: ["No smoking","No pets",...]
            house_rules: { type: DataTypes.JSONB, allowNull: true },

            // cancellation_policy example:
            // { short_stays: ["...","..."], long_stays: ["...","..."] }
            cancellation_policy: { type: DataTypes.JSONB, allowNull: true },

            // location example: { city, address, lat, lng }
            location: { type: DataTypes.JSONB, allowNull: true },

            // images example: ["https://...","https://...", ...]
            images: { type: DataTypes.JSONB, allowNull: true },
        },
        {
            sequelize,
            modelName: 'property',
            tableName: 'property',
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false,

            // Optional: adds DB-level index for slug (nullable unique)
            indexes: [
                { unique: true, fields: ['slug'], where: { slug: { [sequelize.Sequelize.Op.ne]: null } } },
            ],
        }
    );

    return Property;
};
