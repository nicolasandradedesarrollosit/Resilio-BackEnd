import { Router } from "express";
import { 
    fetchAllEvents 
} from "../controller/eventsController.js";

const r = Router();

r.get("/", fetchAllEvents);

export default r;