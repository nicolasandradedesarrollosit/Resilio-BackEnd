import { sendDataBanner } from "../model/bannerModel";

export async function getBannerData(req, res) {
    try {
        const bannerData = await sendDataBanner();
        if(!bannerData) return res.status(404).json({ error: "No banner data found" });
        res.json(bannerData);
    } catch (error) {
        console.error("Error fetching banner data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}