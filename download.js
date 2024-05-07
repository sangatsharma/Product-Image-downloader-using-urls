// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const axios = require('axios');

// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         const url = "https://fancyra.com/product/womens-polyester-spandex-lace-floral-above-knee-baby-doll-with-g-string-panty-free-size-black-color/";
//         await page.goto(url);

//         // Wait for the images to load (you might need to adjust the selector)
//         await page.waitForSelector('.swiper-wrapper.right .swiper-slide img');

//         // Get the image URLs
//         const imageUrls = await page.evaluate(() => {
//             const imageElements = document.querySelectorAll('.swiper-wrapper.right .swiper-slide img');
//             const urls = [];
//             imageElements.forEach(img => {
//                 const src = img.getAttribute('src');
//                 if (src) {
//                     urls.push(src);
//                 }
//             });
//             return urls;
//         });

//         // Create a directory to save images if it doesn't exist
//         const dir = './images';
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir);
//         }

//         // Download and save each image
//         for (let i = 0; i < imageUrls.length; i++) {
//             const imageUrl = imageUrls[i];
//             const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//             const buffer = Buffer.from(response.data, 'binary');
//             fs.writeFileSync(`./images/image${i + 1}.jpg`, buffer);
//         }

//         console.log('Images downloaded successfully!');

//         // Wait for a few seconds before closing the browser to ensure all processes are properly terminated
//         await new Promise(resolve => setTimeout(resolve, 5000));

//         await browser.close();
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();

const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const downloadImages = async (url, counter) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    // Wait for the images to load (you might need to adjust the selector)
    await page.waitForSelector(".swiper-wrapper.right .swiper-slide img");

    // Get the image URLs
    const imageUrls = await page.evaluate(() => {
      const imageElements = document.querySelectorAll(
        ".swiper-wrapper.right .swiper-slide img"
      );
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
    const dir = "./images";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // Download and save each image
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data, "binary");
      const imageName = `${counter}${String.fromCharCode(97 + i)}`; // 'a' for first image, 'b' for second, and so on
      fs.writeFileSync(`./images/${imageName}.webp`, buffer);
    }

    console.log(`Images from ${url} downloaded successfully! ${counter}`);

    // Wait for a few seconds before closing the browser to ensure all processes are properly terminated
    await new Promise((resolve) => setTimeout(resolve, 10000));

    await browser.close();
  } catch (error) {
    console.error(`Error downloading images from ${url}:`, error);
  }
};
 const urls = [

"https://fancyra.com/product/womens-lace-thongs-free-size-blue-color-2/",
"https://fancyra.com/product/womens-lace-thongs-free-size-maroon-color/",
"https://fancyra.com/product/womens-lace-thongs-free-size-black-color/",
"https://fancyra.com/product/womens-lace-thongs-free-size-black-color-copy/"


  ]
  


   




// Iterate over each URL and download images
let counter = 415;
urls.forEach(async (url) => {
  await downloadImages(url, counter++);
});
