const express = require("express");

const {
    registerUser,
    loginUser,
    getProfile,
    updateUser,
    getAllUsers,
    getUserById,
} = require("../controller/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.put("/update/:id", updateUser);
router.get("/users", getAllUsers);
router.get("/user/:id", getUserById);

module.exports = router;