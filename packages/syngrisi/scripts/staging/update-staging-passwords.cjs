#!/usr/bin/env node
/**
 * Update staging user passwords after database restore
 *
 * This script updates passwords for staging users to match .env.staging configuration.
 * It should be run after database restore in setup-staging.sh and reset-staging.sh.
 *
 * Usage: node update-staging-passwords.js
 *
 * Required environment variables (from .env.staging):
 * - STAGING_MONGODB_URI
 * - STAGING_DB_NAME
 * - STAGING_ADMIN_PASSWORD
 * - STAGING_REGULAR_USER_EMAIL
 * - STAGING_REGULAR_USER_PASSWORD
 * - STAGING_GUEST_PASSWORD
 */

const crypto = require('crypto');
const { MongoClient } = require('mongodb');

// pbkdf2 parameters matching passport-local-mongoose defaults
const ITERATIONS = 25000;
const KEY_LENGTH = 512;
const DIGEST = 'sha256';

function generateSalt() {
    return crypto.randomBytes(32).toString('hex');
}

function hashPassword(password, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
            if (err) reject(err);
            else resolve(derivedKey.toString('hex'));
        });
    });
}

async function updateUserPassword(collection, username, newPassword) {
    const salt = generateSalt();
    const hash = await hashPassword(newPassword, salt);

    const result = await collection.updateOne(
        { username },
        { $set: { password: hash, salt } }
    );

    return result.modifiedCount > 0;
}

async function main() {
    const mongoUri = process.env.STAGING_MONGODB_URI;
    const dbName = process.env.STAGING_DB_NAME;
    const adminPassword = process.env.STAGING_ADMIN_PASSWORD;
    const regularUserEmail = process.env.STAGING_REGULAR_USER_EMAIL;
    const regularUserPassword = process.env.STAGING_REGULAR_USER_PASSWORD;
    const guestPassword = process.env.STAGING_GUEST_PASSWORD;

    if (!mongoUri || !dbName) {
        console.error('ERROR: STAGING_MONGODB_URI and STAGING_DB_NAME are required');
        process.exit(1);
    }

    const client = new MongoClient(`${mongoUri}/${dbName}`);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const users = db.collection('vrsusers');

        // Update Administrator password
        if (adminPassword) {
            const updated = await updateUserPassword(users, 'Administrator', adminPassword);
            console.log(`Administrator password: ${updated ? '✓ updated' : '✗ user not found'}`);
        }

        // Update Guest password
        if (guestPassword) {
            const updated = await updateUserPassword(users, 'Guest', guestPassword);
            console.log(`Guest password: ${updated ? '✓ updated' : '✗ user not found'}`);
        }

        // Update regular user password
        if (regularUserEmail && regularUserPassword) {
            const updated = await updateUserPassword(users, regularUserEmail, regularUserPassword);
            console.log(`${regularUserEmail} password: ${updated ? '✓ updated' : '✗ user not found'}`);
        }

        console.log('Password update complete');

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        await client.close();
    }
}

main();
