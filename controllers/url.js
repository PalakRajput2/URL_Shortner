const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "url is required" });
    const shortID = shortid();
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,  // Use 'redirectURL' to match the schema
        visitHistory: []
    });
    return res.json({ id: shortID });
}

async function handleRedirectUrl(req, res) {
    const shortId = req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } },
            { new: true }  // This option returns the updated document
        );

        if (!entry) {
            return res.status(404).send('URL not found');
        }

        res.redirect(entry.redirectURL);  // Use 'redirectURL' to match the schema
    } catch (error) {
        console.error('Error occurred while finding and updating URL:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function handleGetAnalytics(req,res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({totalClicks: result.visitHistory.length , analytics : result.visitHistory} )
}

module.exports = {
    handleGenerateNewShortURL, handleRedirectUrl,handleGetAnalytics
};
