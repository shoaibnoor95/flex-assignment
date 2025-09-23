'use strict';

import { DataTypes } from 'sequelize';

export const up = async (queryInterface) => {
    const { sequelize } = queryInterface;

    // ------------------ PROPERTY ------------------
    await queryInterface.createTable('property', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.TEXT, allowNull: false },
        hostaway_listing_name: { type: DataTypes.TEXT },
        channel_default: { type: DataTypes.TEXT },

        // NEW public details
        slug: { type: DataTypes.TEXT, allowNull: true },                // unique (partial index below)
        description: { type: DataTypes.TEXT, allowNull: true },
        specs: { type: DataTypes.JSONB, allowNull: true },               // { guests, bedrooms, bathrooms, beds, checkin_time, checkout_time }
        amenities: { type: DataTypes.JSONB, allowNull: true },           // [string]
        house_rules: { type: DataTypes.JSONB, allowNull: true },         // [string]
        cancellation_policy: { type: DataTypes.JSONB, allowNull: true }, // { short_stays:[], long_stays:[] }
        location: { type: DataTypes.JSONB, allowNull: true },            // { city, address, lat, lng }
        images: { type: DataTypes.JSONB, allowNull: true },              // [url]

        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('now()') }
    });

    // Partial unique index on slug where slug is not null
    await queryInterface.addIndex('property', ['slug'], {
        name: 'uniq_property_slug_not_null',
        unique: true,
        where: sequelize.where(sequelize.col('slug'), 'IS NOT', null)
    });

    // ------------------ REVIEW ------------------
    await queryInterface.createTable('review', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        property_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: { model: 'property', key: 'id' },
            onDelete: 'CASCADE'
        },
        source: { type: DataTypes.TEXT, allowNull: false },
        source_review_id: { type: DataTypes.TEXT },
        type: { type: DataTypes.TEXT },
        status: { type: DataTypes.TEXT },
        rating: { type: DataTypes.DECIMAL(2, 1) },
        comment: { type: DataTypes.TEXT },
        channel: { type: DataTypes.TEXT },
        submitted_at: { type: DataTypes.DATE },
        guest_name: { type: DataTypes.TEXT },
        approved_for_website: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('now()') }
    });

    await queryInterface.addIndex('review', ['property_id', 'submitted_at'], { name: 'idx_review_property_submitted' });
    await queryInterface.addIndex('review', ['channel', 'status', 'approved_for_website'], { name: 'idx_review_channel_status_approved' });
    await queryInterface.addIndex('review', ['rating'], { name: 'idx_review_rating' });
    await queryInterface.addConstraint('review', {
        fields: ['source', 'source_review_id'],
        type: 'unique',
        name: 'uniq_review_source_externalid'
    });

    // ------------------ REVIEW_CATEGORY ------------------
    await queryInterface.createTable('review_category', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        review_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: { model: 'review', key: 'id' },
            onDelete: 'CASCADE'
        },
        category: { type: DataTypes.TEXT, allowNull: false },
        score: { type: DataTypes.DECIMAL(3, 1), allowNull: false }
    });

    // ------------------ MANAGER_RESPONSE ------------------
    await queryInterface.createTable('manager_response', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        review_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: { model: 'review', key: 'id' },
            onDelete: 'CASCADE'
        },
        body: { type: DataTypes.TEXT, allowNull: false },
        responded_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('now()') }
    });
};

export const down = async (queryInterface) => {
    await queryInterface.dropTable('manager_response');
    await queryInterface.dropTable('review_category');
    await queryInterface.dropTable('review');

    // Drop index before dropping table (some PG versions require this)
    try {
        await queryInterface.removeIndex('property', 'uniq_property_slug_not_null');
    } catch (e) {
        // ignore if it doesn't exist
    }
    await queryInterface.dropTable('property');
};
