import { Router } from "express";

import {
  createLeadHandler,
  deleteLeadHandler,
  exportLeadsCsvHandler,
  getLeadHandler,
  listLeadsHandler,
  updateLeadHandler
} from "../controllers/leadController";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { validateBody, validateQuery } from "../middleware/validateRequest";
import { UserRole } from "../models/User";
import {
  createLeadSchema,
  exportLeadsQuerySchema,
  listLeadsQuerySchema,
  updateLeadSchema
} from "../validators/leadSchemas";

const router = Router();

router.use(protect);
router.use(authorizeRoles(UserRole.Admin, UserRole.SalesUser));

router
  .route("/")
  .get(validateQuery(listLeadsQuerySchema), listLeadsHandler)
  .post(validateBody(createLeadSchema), createLeadHandler);

router.get("/export/csv", validateQuery(exportLeadsQuerySchema), exportLeadsCsvHandler);

router
  .route("/:id")
  .get(getLeadHandler)
  .patch(validateBody(updateLeadSchema), updateLeadHandler)
  .delete(authorizeRoles(UserRole.Admin), deleteLeadHandler);

export const leadRoutes = router;
