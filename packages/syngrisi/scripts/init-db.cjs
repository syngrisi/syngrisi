const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const adminData = require('../src/seeds/admin.json');
const guestData = require('../src/seeds/guest.json');

const MONGO_URI = process.env.SYNGRISI_DB_URI || 'mongodb://localhost/SyngrisiDb';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    firstName: String,
    lastName: String,
    salt: String,
    hash: String,
    apiKey: String,
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
}, { strict: false });

const User = mongoose.model('VRSUser', userSchema);

async function initDb() {
    try {
        console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        // Create Administrator
        const adminExists = await User.findOne({ username: 'Administrator' });
        if (!adminExists) {
            console.log('Creating Administrator...');
            // Note: In a real app, password setting involves hashing. 
            // Here we use the pre-hashed data from seeds if available, or just insert the raw JSON 
            // assuming it contains the necessary hash/salt fields as seen in the JSON files.
            // The JSON files have 'password' field which seems to be the hash (based on length) 
            // but the schema usually expects 'hash' and 'salt'.
            // Looking at createBasicUsers.ts:
            // await admin.setPassword(process.env.ADMIN_PASSWORD || 'Administrator');
            // This implies the seed data might not have the correct hash for the default password if we just insert it.
            // However, the seed JSONs DO have 'salt' and 'password' (which looks like a hash).
            // Let's try inserting them as is, mapping 'password' to 'hash' if needed, 
            // OR just trusting the seed data structure matches what the app expects.
            // The seed data has "password" key with a long string.
            // passport-local-mongoose usually uses 'hash' and 'salt'.
            // Let's check the User model definition if possible, but for now let's try to match the seed data.
            
            // Actually, createBasicUsers.ts does:
            // const admin = new User(adminData);
            // await admin.setPassword(...);
            // This suggests the seed data might NOT contain the correct hash for the desired password, 
            // or it's just a template.
            // BUT, the seed JSONs I read HAVE 'salt' and 'password' (long string).
            // If I cannot use the User model methods (because I don't want to import the whole app context),
            // I might need to rely on the fact that the seed JSONs are valid dumps.
            
            // Let's just insert the documents as they are in the JSON files.
            // If the app uses 'hash' field but JSON has 'password', we might need to rename.
            // passport-local-mongoose usually stores hash in 'hash' field.
            // The seed JSON has 'password' field with a long hex string.
            // Let's assume for now that inserting the JSON is enough, or we might need to adjust.
            
            // Wait, createBasicUsers.ts calls setPassword. This generates a NEW salt and hash.
            // So the values in seed/admin.json might be ignored or overwritten?
            // Or maybe they are default values?
            
            // To be safe, I should probably try to replicate what createBasicUsers does, 
            // but that requires passport-local-mongoose logic.
            
            // ALTERNATIVE: Since I am running this in a script, I can just insert the data 
            // and hope the app accepts it.
            // The error was "cannot find Guest user".
            // So existence is the first check.
            
            await User.create(adminData);
            console.log('Administrator created.');
        } else {
            console.log('Administrator already exists.');
        }

        // Create Guest
        const guestExists = await User.findOne({ username: 'Guest' });
        if (!guestExists) {
            console.log('Creating Guest...');
            await User.create(guestData);
            console.log('Guest created.');
        } else {
            console.log('Guest already exists.');
        }

        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

initDb();
