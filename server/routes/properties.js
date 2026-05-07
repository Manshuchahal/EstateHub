const express            = require("express");
const router             = express.Router();
const propertyController = require("../controllers/propertyController");
const authMiddleware     = require("../middleware/authMiddleware");
const adminMiddleware    = require("../middleware/adminMiddleware");
const upload             = require("../config/multer");

// Public
router.get("/",    propertyController.getProperties);
router.get("/:id", propertyController.getPropertyById);

// Admin only
router.post(
  "/",
  authMiddleware, adminMiddleware,
  upload.array("images", 15),
  propertyController.addProperty
);

router.put(
  "/:id",
  authMiddleware, adminMiddleware,
  upload.array("images", 15),
  propertyController.updateProperty
);

router.delete(
  "/:id",
  authMiddleware, adminMiddleware,
  propertyController.deleteProperty
);

module.exports = router;
