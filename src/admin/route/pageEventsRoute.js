import { 
    getEventsController,
    createEventController,
    updateEventController,
    deleteEventController,
    uploadEventImageController
 } from "../controller/pageEventsController.js";
import Router from "express";
import { requireAdmin } from "../../client/middleware/authJWT.js";
import { uploadEventImage } from "../util/multerConfig.js";

const r = Router();

r.get("/admin/events", requireAdmin, getEventsController);
r.post("/admin/events", requireAdmin, createEventController);
r.patch("/admin/events/:id", requireAdmin, updateEventController);
r.delete("/admin/events/:id", requireAdmin, deleteEventController);
r.post("/admin/events/upload-image", requireAdmin, uploadEventImage.single('image'), uploadEventImageController);

export default r;