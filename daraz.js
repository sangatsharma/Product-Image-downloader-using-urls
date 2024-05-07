const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const downloadImages = async (url, counter) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    // Wait for the images to load (you might need to adjust the selector)
    await page.waitForSelector('.next-slick-list .next-slick-track .next-slick-slide .item-gallery__image-wrapper img', { timeout: 10000 });

    // Get the image URLs
    const imageUrls = await page.evaluate(() => {
      const imageElements = document.querySelectorAll('.next-slick-list .next-slick-track .next-slick-slide .item-gallery__image-wrapper img');
      const urls = [];
      imageElements.forEach((img) => {
        const src = img.getAttribute("src");
        if (src) {
          urls.push(src);
        }
      });
      return urls;
    });

    // Create a directory to save images if it doesn't exist
    const dir = "./darazimages";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    
    // Download and save each image
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
    //   console.log("------->"+imageUrl+"<------");
      const firstUnderscoreIndex = imageUrl.indexOf('_');
      const convertedUrl = firstUnderscoreIndex !== -1 ? imageUrl.substring(0, firstUnderscoreIndex) : imageUrl;
    //   console.log("--->"+convertedUrl+"<------");
      const response = await axios.get(convertedUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data, "binary");
      const imageName = `${counter}${String.fromCharCode(97 + i)}`; // 'a' for first image, 'b' for second, and so on
      fs.writeFileSync(`./darazimages/${imageName}.webp`, buffer);
    }

    console.log(`Images from ${url} downloaded successfully! ${counter}`);

    // Wait for a few seconds before closing the browser to ensure all processes are properly terminated
    await browser.close();
  } catch (error) {
    console.error(`Error downloading images from ${url}:`, error);
  }
};

const urls = [
  "https://www.daraz.com.np/products/high-strength-knuckles-finger-hand-grip-for-gopro-hd-hero-4-3-3-2-1-accessories-i100828007-s1021334632.html?search=1",
];

// Iterate over each URL and download images
let counter = 1;
urls.forEach(async (url) => {
  await downloadImages(url, counter++);
});
