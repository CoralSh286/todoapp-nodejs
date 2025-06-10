const bcrypt = require('bcrypt');

const comparePassword = (plainPassword, hashedPassword) =>
    new Promise((resolve, reject) => {
        // Check if it's a bcrypt hash (starts with $2b$, $2a$, etc.)
        if (hashedPassword.startsWith('$2')) {
            bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
                if (err) {
                    reject(err);
                } else if (result) {
                    resolve(true);
                } else {
                    reject(new Error('Invalid password'));
                }
            });
        } else {
            // Assume it's SHA-256 (legacy support)
            const crypto = require('crypto');
            const sha256Hash = crypto.createHash('sha256').update(plainPassword).digest('hex');
            if (sha256Hash === hashedPassword) {
                resolve(true);
            } else {
                reject(new Error('Invalid password'));
            }
        }
    });

const hashPassword = (plainPassword, saltRounds = 10) =>
    new Promise((resolve, reject) => {
        bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });

// Migration helper: convert existing SHA-256 hashes to bcrypt
const migrateFromSHA256 = async (plainPassword, sha256Hash) => {
    const crypto = require('crypto');
    const sha256Input = crypto.createHash('sha256').update(plainPassword).digest('hex');
    
    if (sha256Input === sha256Hash) {
        // Password is correct, now hash it with bcrypt
        return await hashPassword(plainPassword);
    }
    return null;
};

module.exports = { comparePassword, hashPassword, migrateFromSHA256 };