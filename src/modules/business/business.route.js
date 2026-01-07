import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { roleCheck } from "../../middlewares/role.middleware.js";

import {
  createBusiness,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscription,
  getAllBusinesses,
} from "./business.controller.js";

const router = express.Router();

/* ===========================
   BUSINESS CRUD (SUPER ADMIN)
   =========================== */

// Create business
router.post("/create", protect, roleCheck("SUPER_ADMIN"), createBusiness);

// Get business by id
router.get("/:id", protect, getBusinessById);

// Get all businesses
router.get("/", protect, getAllBusinesses);

// Update business
router.put(
  "/update-business/:id",
  protect,
  roleCheck("SUPER_ADMIN"),
  updateBusiness
);

// Delete business
router.delete("/:id", protect, roleCheck("SUPER_ADMIN"), deleteBusiness);

/* ===========================
   SUBSCRIPTION (SUPER ADMIN)
   =========================== */

// Create subscription
router.post(
  "/:id/subscription",
  protect,
  roleCheck("SUPER_ADMIN"),
  createSubscription
);

// Update subscription
router.put(
  "/:id/subscription",
  protect,
  roleCheck("SUPER_ADMIN"),
  updateSubscription
);

// Delete subscription
router.delete(
  "/:id/subscription",
  protect,
  roleCheck("SUPER_ADMIN"),
  deleteSubscription
);

// Get subscription
router.get(
  "/:id/subscription",
  protect,
  roleCheck("SUPER_ADMIN"),
  getSubscription
);

export default router;
