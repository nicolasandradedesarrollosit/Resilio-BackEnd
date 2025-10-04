import { Router } from "express";
import { 
    getBannerData 
} from "../controller/bannerController.js";

const r = Router();

r.get("/banner", getBannerData);

export default r;