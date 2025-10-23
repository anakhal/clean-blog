const User = require('../models/User');

// GET /users/register - Show registration form
exports.showRegister = (req, res) => {
    res.render('register');
};

// POST /users/register - Handle registration form submission
exports.register = async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;
        
        // Server-side validation
        if (!username || !password || !confirmPassword) {
            return res.render('register', {
                error: 'All fields are required'
            });
        }
        
        if (password !== confirmPassword) {
            return res.render('register', {
                error: 'Passwords do not match'
            });
        }
        
        if (password.length < 6) {
            return res.render('register', {
                error: 'Password must be at least 6 characters long'
            });
        }
        
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('register', {
                error: 'Username already exists'
            });
        }
        
        // Create new user (password will be automatically hashed by pre-save middleware)
        const newUser = new User({
            username,
            password  // This will be hashed automatically!
        });
        
        await newUser.save();
        
        // Registration successful - redirect to login or home
        res.redirect('/?success=Registration successful! You can now log in.');
        
    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', {
            error: 'An error occurred during registration. Please try again.'
        });
    }
};

// GET /users/login - Show login form
exports.showLogin = (req, res) => {
    res.render('login');
};

// POST /users/login - Handle login form submission
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Server-side validation
        if (!username || !password) {
            return res.render('login', {
                error: 'Username and password are required'
            });
        }
        
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('login', {
                error: 'Invalid username or password'
            });
        }
        
        // Check password using the comparePassword method
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.render('login', {
                error: 'Invalid username or password'
            });
        }
        
        // Login successful - Create session!
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.role = user.role;
        req.session.isLoggedIn = true;
        
        console.log('User logged in:', user.username, 'Role:', user.role);
        
        // Redirect admin to dashboard, regular users to home
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard?success=Welcome to admin dashboard, ' + user.username);
        } else {
            res.redirect('/?success=Login successful! Welcome back, ' + user.username);
        }
        
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', {
            error: 'An error occurred during login. Please try again.'
        });
    }
};

// POST /users/logout - Handle logout
exports.logout = (req, res) => {
    // Destroy session
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.redirect('/?error=Logout failed');
        }
        
        console.log('User logged out');
        res.redirect('/?success=Logged out successfully!');
    });
};