const {Schema, model, default: mongoose}=require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema=new Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        minlength:3,
        maxlength:30
    },
    password: {
        type:String,
        required: true,
        minlength:6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    }
},{timestamps:true})

// Pre-save middleware to hash password before saving to database
UserSchema.pre('save', async function(next) {
    // Only hash the password if it's new or modified
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        // Generate salt with 12 rounds (good security vs performance balance)
        const salt = await bcrypt.genSalt(12);
        
        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);
        
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to compare password during login
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports=mongoose.model('User',UserSchema)