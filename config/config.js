import dotenv from "dotenv";

dotenv.config();

export default {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // needed for Neon
            },
        },
    }
    // test: {
    //     username: process.env.DB_USERNAME,
    //     password: process.env.DB_PASSWORD,
    //     database: process.env.DB_TEST_NAME,
    //     host: process.env.DB_HOST,
    //     dialect: process.env.DB_DIALECT,
    // },
    // production: {
    //     username: process.env.DB_USERNAME,
    //     password: process.env.DB_PASSWORD,
    //     database: process.env.DB_PROD_NAME,
    //     host: process.env.DB_HOST,
    //     dialect: process.env.DB_DIALECT,
    // },
};
