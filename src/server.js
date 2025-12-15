import app from './app.js';
import sequelize from './config/database.js';
import dotenv from 'dotenv';
import seedService from './services/seedService.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const connectWithRetry = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            return;
        } catch (error) {
            console.error(`Unable to connect to the database (Attempt ${i + 1}/${retries}):`, error.message);
            if (i < retries - 1) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await wait(delay);
            }
        }
    }
    throw new Error('Failed to connect to the database after multiple attempts');
};

const startServer = async () => {
    try {
        await connectWithRetry();

        // Sync models with database (alter: true updates tables if they exist)
        // In production, migrations should be used instead of sync
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');

        // Seed Super Admin
        await seedService.seedAdmin();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
