import { Router } from "express";
import { 
    fetchAllEvents 
} from "../controller/eventsController.js";

const r = Router();

r.get("/events", fetchAllEvents);

export default r;