import { Router } from "express";
import { 
    fetchAllEvents 
} from "../controller/eventsController";

const r = Router();

r.get("/", fetchAllEvents);

export default r;