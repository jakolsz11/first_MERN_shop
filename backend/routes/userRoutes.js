const express = require("express");
const { getUsers, registerUser, loginUser, updateUserProfile, getUserProfile, writeReview, getUser, updateUser, deleteUser } = require("../controllers/userController");
const { verifyIsLoggedIn, verifyIsAdmin } = require("../middleware/verifyAuthToken");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.use(verifyIsLoggedIn);
router.put("/profile", updateUserProfile);
router.get("/profile/:id", getUserProfile);
router.post("/review/:productId", writeReview);

router.use(verifyIsAdmin);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;