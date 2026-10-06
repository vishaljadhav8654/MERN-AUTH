const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const registerUser = async (req, res) => {
    try {
        const { name, mobile, email, password } = req.body;

        if (!name || !mobile || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({
                message: "Mobile must contain exactly 10 digits",
            });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email",
            });
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be 8+ characters with uppercase, lowercase and number",
            });
        }
        const cleanEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            $or: [{ email: cleanEmail }, { mobile }],
        });
        if (existingUser) {
            if (existingUser.email === cleanEmail) {
                return res.status(409).json({
                    message: "Email is already registered",
                });
            }
            if (existingUser.mobile === mobile) {
                return res.status(409).json({
                    message: "Mobile number is already registered",
                });
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            mobile,
            email: cleanEmail,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email or mobile is already registered",
            });
        }
        res.status(500).json({ message: "Server error" });
    }
};
const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                message: "Email/mobile and password are required",
            });
        }
        const cleanIdentifier = identifier.toLowerCase().trim();

        const user = await User.findOne({
            $or: [
                { email: cleanIdentifier },
                { mobile: identifier.trim() },
            ],
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email/mobile or password",
            });
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email/mobile or password",
            });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getProfile = async (req, res) => {
    try {

        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Get user ID from token
        const userId = decoded.userId;

        // Find user in MongoDB
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Send profile
        res.status(200).json({
            message: "Profile fetched successfully",

            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                email: user.email
            }
        });

    } catch (error) {

        console.log(error);

        // JWT errors
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        res.status(500).json({
            message: "Server error"
        });
    }
};




const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const { name, mobile, email, password } = req.body;

        // Find user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Validate name
        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    message: "Name cannot be empty",
                });
            }

            user.name = name.trim();
        }

        // Validate mobile
        if (mobile !== undefined) {
            if (!mobileRegex.test(mobile)) {
                return res.status(400).json({
                    message: "Mobile must contain exactly 10 digits",
                });
            }

            const existingMobile = await User.findOne({
                mobile,
                _id: { $ne: userId },
            });

            if (existingMobile) {
                return res.status(409).json({
                    message: "Mobile number is already registered",
                });
            }

            user.mobile = mobile;
        }

        // Validate email
        if (email !== undefined) {
            const cleanEmail = email.toLowerCase().trim();

            if (!emailRegex.test(cleanEmail)) {
                return res.status(400).json({
                    message: "Please enter a valid email",
                });
            }

            const existingEmail = await User.findOne({
                email: cleanEmail,
                _id: { $ne: userId },
            });

            if (existingEmail) {
                return res.status(409).json({
                    message: "Email is already registered",
                });
            }

            user.email = cleanEmail;
        }

        // Update password if provided
        if (password !== undefined) {
            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    message:
                        "Password must be 8+ characters with uppercase, lowercase and number",
                });
            }

            user.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                mobile: updatedUser.mobile,
                email: updatedUser.email,
            },
        });

    } catch (error) {
        console.log(error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email or mobile is already registered",
            });
        }

        res.status(500).json({
            message: "Server error",
        });
    }
};

// get user
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            message: "User Fetched Sucessfully",
            users
        })
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};



module.exports = { registerUser, loginUser, getProfile, updateUser, getAllUsers, getUserById };