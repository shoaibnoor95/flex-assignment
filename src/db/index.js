import 'dotenv/config';
import { Sequelize } from 'sequelize';
import PropertyModel from './models/Property.js';
import ReviewModel from './models/Review.js';
import ReviewCategoryModel from './models/ReviewCategory.js';
import ManagerResponseModel from './models/ManagerResponse.js';

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false
});

// Models
export const Property = PropertyModel(sequelize);
export const Review = ReviewModel(sequelize);
export const ReviewCategory = ReviewCategoryModel(sequelize);
export const ManagerResponse = ManagerResponseModel(sequelize);

// Associations
Property.hasMany(Review, { foreignKey: 'property_id' });
Review.belongsTo(Property, { foreignKey: 'property_id' });

Review.hasMany(ReviewCategory, { foreignKey: 'review_id', as: 'categories' });
ReviewCategory.belongsTo(Review, { foreignKey: 'review_id' });

Review.hasOne(ManagerResponse, { foreignKey: 'review_id', as: 'manager_response' });
ManagerResponse.belongsTo(Review, { foreignKey: 'review_id' });

export async function connectDb() {
    await sequelize.authenticate();
}
