// Test script to demonstrate password hashing
const bcrypt = require('bcrypt');

async function demonstratePasswordHashing() {
    console.log('=== Password Encryption Demonstration ===\n');
    
    const plainPassword = 'mySecretPassword123';
    console.log('Original password:', plainPassword);
    
    try {
        // Generate salt
        console.log('\n1. Generating salt...');
        const salt = await bcrypt.genSalt(12);
        console.log('Salt generated:', salt);
        
        // Hash password
        console.log('\n2. Hashing password with salt...');
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        console.log('Hashed password:', hashedPassword);
        
        console.log('\n3. Original vs Hashed comparison:');
        console.log('Original length:', plainPassword.length, 'characters');
        console.log('Hashed length:', hashedPassword.length, 'characters');
        
        // Verify password
        console.log('\n4. Testing password verification...');
        const isValidCorrect = await bcrypt.compare(plainPassword, hashedPassword);
        const isValidWrong = await bcrypt.compare('wrongPassword', hashedPassword);
        
        console.log('Correct password check:', isValidCorrect);
        console.log('Wrong password check:', isValidWrong);
        
        // Show multiple hashes of same password
        console.log('\n5. Multiple hashes of same password (each is unique):');
        for (let i = 1; i <= 3; i++) {
            const hash = await bcrypt.hash(plainPassword, 12);
            console.log(`Hash ${i}:`, hash);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the demonstration
demonstratePasswordHashing();