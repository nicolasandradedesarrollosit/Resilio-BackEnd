import { 
    getEventsController,
    createEventController,
    updateEventController,
    deleteEventController,
    uploadEventImageController
 } from "../controller/pageEventsController.js";
import Router from "express";
import { requireAdmin } from "../../client/middleware/authJWT.js";

const r = Router();

r.get("/admin/events", requireAdmin, getEventsController);
r.post("/admin/events", requireAdmin, createEventController);
r.patch("/admin/events/:id", requireAdmin, updateEventController);
r.delete("/admin/events/:id", requireAdmin, deleteEventController);
r.post("/admin/events/upload-image", requireAdmin, uploadEventImageController);

export default r;