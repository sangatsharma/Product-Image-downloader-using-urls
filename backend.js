

const puppeteer = require("puppeteer");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(bodyParser.json());

const downloadImages = async (url, format) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    // Wait for the images to load (you might need to adjust the selector)
    await page.waitForSelector(
      ".next-slick-list .next-slick-track .next-slick-slide .item-gallery__image-wrapper img",
      { timeout: 10000 }
    );

    // Get the image URLs
    const imageUrls = await page.evaluate(() => {
      const imageElements = document.querySelectorAll(
        ".next-slick-list .next-slick-track .next-slick-slide .item-gallery__image-wrapper img"
      );
      const urls = [];
      imageElements.forEach((img) => {
        const src = img.getAttribute("src");
        if (src) {
          const firstUnderscoreIndex = src.indexOf("_");
          const convertedUrl =
            firstUnderscoreIndex !== -1
              ? src.substring(0, firstUnderscoreIndex)
              : src;
          urls.push(convertedUrl);
        }
      });
      return urls;
    });

    // Convert images to base64 strings
    const imageBase64Array = [];
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      const base64String = Buffer.from(buffer).toString("base64");
      imageBase64Array.push(`data:image/${format};base64,${base64String}`);
    }

    await browser.close();

    return imageBase64Array;
  } catch (error) {
    console.error(`Error downloading images from ${url}:`, error);
    throw error;
  }
};

app.post("/download-images", async (req, res) => {
  const { url, format } = req.body;

  try {
    const imageBase64Array = await downloadImages(url, format);
    res.json(imageBase64Array);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to download images" });
  }
});
app.use(express.static(path.join(__dirname, "index.html")));
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
