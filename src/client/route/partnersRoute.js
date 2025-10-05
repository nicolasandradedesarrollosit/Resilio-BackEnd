import { Router } from "express";
import { fetchAllPartners } from '../controller/partnersController.js';

const r = Router();

r.get("/partners", fetchAllPartners);

export default r;