import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

const seedAdmin = async () => {
    try {
        const email = process.env.SUPER_ADMIN_EMAIL;
        const password = process.env.SUPER_ADMIN_PASSWORD;

        if (!email || !password) {
            console.warn('SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set. Skipping admin seeding.');
            return;
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({ where: { email } });
        if (existingAdmin) {
            console.log('Super Admin user already exists. Skipping creation.');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name: 'Super Admin',
            email,
            password: hashedPassword,
            role: 'ADMIN',
        });

        console.log(`Super Admin user created successfully: ${email}`);
    } catch (error) {
        console.error('Failed to seed admin:', error);
        // Do not exit process, just log error so server can continue or fail gracefully
    }
};

export default {
    seedAdmin
};
