import { sendDataBanner } from "../model/bannerModel.js";

export async function getBannerData(req, res, next) {
    try {
        const bannerData = await sendDataBanner();
        if(!bannerData) return res.status(404).json({ error: "No banner data found" });
        res.json(bannerData);
    } catch (error) {
        console.error("Error fetching banner data:", error);
        next(error);
    }
}