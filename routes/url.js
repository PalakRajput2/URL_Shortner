const express = require("express");
const {handleGenerateNewShortURL,handleRedirectUrl,handleGetAnalytics} = require("../controllers/url");
const router = express.Router();

router.post("/",handleGenerateNewShortURL);
router.get("/:shortId",handleRedirectUrl);
router.get("/analytics/:shortId",handleGetAnalytics)

module.exports = router;