const express = require("express");
const { getProducts, getProductById, getBestsellers, adminGetProducts, adminDeleteProduct, adminCreateProduct, adminUpdateProduct, adminUpload, adminDeleteProductImage } = require("../controllers/productController");
const { verifyIsLoggedIn, verifyIsAdmin } = require("../middleware/verifyAuthToken");

const router = express.Router();

router.get("/category/:categoryName/search/:searchQuery", getProducts);
router.get("/category/:categoryName", getProducts);
router.get("/search/:searchQuery", getProducts);
router.get("/", getProducts);
router.get("/bestsellers", getBestsellers);
router.get("/get-one/:id", getProductById);

router.use(verifyIsLoggedIn);
router.use(verifyIsAdmin);
router.get("/admin", adminGetProducts);
router.delete("/admin/:id", adminDeleteProduct);
router.post("/admin", adminCreateProduct);
router.put("/admin/:id", adminUpdateProduct);
router.post("/admin/upload", adminUpload);
router.delete("/admin/image/:imagePath/:productId", adminDeleteProductImage);

module.exports = router;