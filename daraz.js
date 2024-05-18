const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const downloadImages = async (url, counter) => {
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
      const firstUnderscoreIndex = imageUrl.indexOf("_");
      const convertedUrl =
        firstUnderscoreIndex !== -1
          ? imageUrl.substring(0, firstUnderscoreIndex)
          : imageUrl;
      const response = await axios.get(convertedUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data, "binary");
      const imageName = `${counter}${String.fromCharCode(97 + i)}`; // 'a' for first image, 'b' for second, and so on
      fs.writeFileSync(`./darazimages/${imageName}.webp`, buffer);
    }

    console.log(`downloaded successfully! ${counter}`);

    await browser.close();
  } catch (error) {
    console.error(`Error downloading images from ${url}:`, error);
  }
};

const urls = [
  "https://www.daraz.com.np/products/146-inch-sleeve-case-cover-and-led-light-combo-i111806-s717663.html?search=1",
  "https://www.daraz.com.np/products/combo-of-screen-guard-keyboard-guard-inner-bag-for-146-laptop-i111808-s717667.html?search=1",
  "https://www.daraz.com.np/products/laptop-inner-soft-cover-sleeves-bag-for-13-inch-display-laptop-black-black-laptop-sleeves-cover-bag-i119326786-s1032655597.html?search=1",
  "https://www.daraz.com.np/products/2pcs-travel-space-saving-hand-roll-up-roller-seal-no-vacuum-storage-bag-i128132224-s1035222158.html?search=1",
  "https://www.daraz.com.np/products/inflatable-u-shaped-traveling-pillow-fashion-lightweight-u-shaped-travelling-neck-pillow-i112237104-s1030365170.html?search=1",
  "https://www.daraz.com.np/products/super-absorbent-quick-dry-floor-mat-i119288575-s1032647344.html?search=1",
  "https://www.daraz.com.np/products/super-absorbent-non-slip-carpets-quick-drying-floor-rug-soft-room-entrance-doormat-i128111705-s1035195208.html?search=1",
  "https://www.daraz.com.np/products/super-absorbent-quick-dry-bathroom-floor-mat-i128551791-s1036118052.html?search=1",
  "https://www.daraz.com.np/products/compressed-towels-small-9-12-x-10-white-i100004757-s1004361429.html?search=1",
  "https://www.daraz.com.np/products/super-absorbent-microfiber-hair-drying-wrap-towel-i129435355-s1037429483.html?search=1",
  "https://www.daraz.com.np/products/super-absorbent-microfiber-hair-drying-wrap-towel-i128187582-s1035303057.html?search=1",
  "https://www.daraz.com.np/products/new-quick-dry-head-shower-cap-towel-hair-wrap-soft-microfibre-bath-turban-i127943844-s1034979414.html?search=1",
  "https://www.daraz.com.np/products/nepliving-soap-box-bathroom-soap-holders-bathroom-kitchen-dish-storage-racks-i126029743-s1034151071.html?search=1",
  "https://www.daraz.com.np/products/hd-anti-fog-wall-mirror-sticker-diy-full-length-mirror-tiles-self-adhesive-shatterproof-non-glass-safety-mirror-sheets-2mm-thick-2030cm-i129767328-s1037619270.html?search=1",
  "https://www.daraz.com.np/products/silicone-toilet-cleaning-brush-creative-lollipop-brush-shape-wall-mounted-i128533587-s1036082275.html?search=1",
  "https://www.daraz.com.np/products/reusable-toilet-seat-cover-waterproof-sticky-solid-color-skin-friendly-soft-thicker-home-bathroom-accessories-i129468891-s1037458047.html?search=1",
  "https://www.daraz.com.np/products/mb-ma08d-8gb-class-6-micro-sdhc-memory-card-i30399-s94797.html?search=1",
  "https://www.daraz.com.np/products/3-way-pivot-arm-assembly-extension4x-thumb-knob-go-pro-and-action-cameras-i106399136-s1028050145.html?search=1",
  "https://www.daraz.com.np/products/tripod-bracket-holder-mount-for-smartphone-monopod-stand-i118520330-s1032458717.html?search=1",
  "https://www.daraz.com.np/products/gopro-accessories-new-1x-screw-and-cap-long-or-short-one-i128588367-s1036196559.html?search=1",
  "https://www.daraz.com.np/products/gopro-accessories-new-1x-screw-and-cap-long-or-short-one-for-gopro-hero-i106396584-s1028054112.html?search=1",
  "https://www.daraz.com.np/products/black-vertical-surface-j-hook-buckle-mount-for-gopro-i100836249-s1021342441.html?search=1",
  "https://www.daraz.com.np/products/j-hook-buckle-vertical-surface-mount-adapter-for-gopro-and-action-cameras-i106508503-s1028110983.html?search=1",
  "https://www.daraz.com.np/products/action-pro-6-pcslot-gopro-3m-vhb-adhesive-sticky-3-x-concave-3-x-flat-sticker-compatible-with-gopro-hero-i106505740-s1028122064.html?search=1",
  "https://www.daraz.com.np/products/action-pro-6-pcslot-gopro-3m-vhb-adhesive-sticky-3-x-concave-3-x-flat-sticker-compatible-with-gopro-hero-i128580053-s1036149645.html?search=1",
  "https://www.daraz.com.np/products/j-hook-buckle-vertical-surface-mount-adapter-for-gopro-and-action-cameras-i106508503-s1028110983.html?search=1",
  "https://www.daraz.com.np/products/new-2x-buckle-basic-strap-mount-clips-for-camera-go-pro-gopro-i106393451-s1028048170.html?search=1",
  "https://www.daraz.com.np/products/tripod-monopod-mount-holder-adapter-for-sport-camera-gopro-i106389838-s1028052234.html?search=1",
  "https://www.daraz.com.np/products/generic-hero-mount-adapter-black-tripod-mount-adapter-for-gopro-hero-i106397305-s1028053109.html?search=1",
  "https://www.daraz.com.np/products/tripod-monopod-mount-holder-adapter-for-sport-camera-gopro-i128581394-s1036161711.html?search=1",
  "https://www.daraz.com.np/products/tripod-mount-adapter-screw-for-gopro-hero-and-all-action-camera-i100826395-s1021344431.html?search=1",
  "https://www.daraz.com.np/products/high-strength-knuckles-finger-hand-grip-for-gopro-hd-hero-4-3-3-2-1-accessories-i100828007-s1021334632.html?search=1",
  "https://www.daraz.com.np/products/black-tripod-mount-monopod-adapter-for-go-pro-hero-sjcam-xiaomi-yi-camera-stand-go-pro-and-action-cameras-i106396133-s1028051096.html?search=1",
  "https://www.daraz.com.np/products/gopro-hero-4-3-3-2-1-cameras-high-performance-ergonomic-finger-grip-on-finger-joints-for-gopro-and-action-cameras-i106432940-s1028067895.html?search=1",
  "https://www.daraz.com.np/products/3m-sticker-set-6-pcs-for-gopro-helmet-mount-i103299673-s1024041491.html?search=1",
  "https://www.daraz.com.np/products/chest-mount-harness-for-gopro-cameras-i128579444-s1036161557.html?search=1",
  "https://www.daraz.com.np/products/chest-mount-harness-for-gopro-cameras-i106434510-s1028066930.html?search=1",
  "https://www.daraz.com.np/products/adjustable-light-weight-3-points-elastic-chest-belt-mount-harness-for-gopro-i100918796-s1021456997.html?search=1",
  "https://www.daraz.com.np/products/21m-tripod-stand-stand-for-photo-studio-ring-light-i103061238-s1033093262.html?search=1",
  "https://www.daraz.com.np/products/cat5e-3m-router-internet-patch-lead-lan-ethernet-network-cable-i123758271-s1033608071.html?search=1",
  "https://www.daraz.com.np/products/3m-router-internet-patch-lead-lan-ethernet-network-cable-i128523420-s1036048850.html?search=1",
  "https://www.daraz.com.np/products/blue-gigabit-snagless-rj45-utp-cat6-patch-cable-multipurpose-cat-6-ethernet-patch-cable-i105460890-s1027228114.html?search=1",
  "https://www.daraz.com.np/products/cat5e-15m-router-internet-patch-lead-lan-ethernet-network-cable-i123748979-s1033608065.html?search=1",
  "https://www.daraz.com.np/products/15m-router-internet-patch-lead-lan-ethernet-network-cable-i128522541-s1036053609.html?search=1",
  "https://www.daraz.com.np/products/10m-router-internet-patch-lead-lan-ethernet-network-cable-i128522538-s1036051901.html?search=1",
  "https://www.daraz.com.np/products/cat5e-5m-router-internet-patch-lead-lan-ethernet-network-cable-i123755742-s1033603580.html?search=1",
  "https://www.daraz.com.np/products/cat5e-5m-router-internet-patch-lead-lan-ethernet-network-cable-i128520609-s1036048849.html?search=1",
  "https://www.daraz.com.np/products/10m-router-internet-patch-lead-lan-ethernet-network-cable-i128522538-s1036051901.html?search=1",
  "https://www.daraz.com.np/products/cat5e-10m-router-internet-patch-lead-lan-ethernet-network-cable-i123826838-s1033611852.html?search=1",
  "https://www.daraz.com.np/products/cat5e-15m-router-internet-patch-lead-lan-ethernet-network-cable-i124419234-s1033780532.html?search=1",
  "https://www.daraz.com.np/products/15m-router-internet-patch-lead-lan-ethernet-network-cable-i128521583-s1036054656.html?search=1",
  "https://www.daraz.com.np/products/type-c-mobile-otg-i118783-s1132630.html?search=1",
  "https://www.daraz.com.np/products/hdmi-female-to-hdmi-female-cable-adapter-extender-coupler-i21249-s64641.html?search=1",
  "https://www.daraz.com.np/products/black-hdmi-to-vga-display-adapter-converter-i111772-s717583.html?search=1",
  "https://www.daraz.com.np/products/general-db-new-15-hddb15-vgasvga-kvm-gender-changer-adapter-female-to-femalef-f-i21236-s1032665446.html?search=1",
  "https://www.daraz.com.np/products/sleeve-124-inch-and-led-light-combo-set-i116216861-s1031778872.html?search=1",
  "https://www.daraz.com.np/products/pair-of-2-laptop-screen-cleaning-kit-i111793-s717633.html?search=1",
  "https://www.daraz.com.np/products/3-in-1-combo-laptop-lamination-kit-for-14-inch-laptop-i111788-s717620.html?search=1",
  "https://www.daraz.com.np/products/universal-silicone-keyboard-protector-skin-for-15-inch-laptop-keyboard-protector-i29874-s93127.html?search=1",
  "https://www.daraz.com.np/products/universal-silicone-keyboard-protector-skin-for-14-inch-laptop-keyboard-protector-i29875-s93129.html?search=1",
  "https://www.daraz.com.np/products/3-in-1-kit-with-cleaning-gel-microfiber-cleaning-cloth-fiber-i111647-s717282.html?search=1",
  "https://www.daraz.com.np/products/15-laptop-screen-protector-i128567085-s1036138784.html?search=1",
  "https://www.daraz.com.np/products/15-laptop-screen-protector-i116026881-s1031728861.html?search=1",
  "https://www.daraz.com.np/products/spincart-screen-cleaning-kit-for-laptops-mobiles-lcd-led-computers-and-tv-i128155772-s1035254463.html?search=1",
  "https://www.daraz.com.np/products/3-in-1-kit-with-cleaning-gel-microfiber-cleaning-cloth-fiber-i111647-s717282.html?search=1",
  "https://www.daraz.com.np/products/3-in-1-screen-cleaning-kit-with-microfiber-cloth-brush-for-laptopsmobileslcdledcomputers-i21243-s64614.html?search=1",
  "https://www.daraz.com.np/products/keyboard-protective-film15-inch-i111716-s717446.html?search=1",
  "https://www.daraz.com.np/products/keyboard-protective-film14-inch-i111714-s717440.html?search=1",
  "https://www.daraz.com.np/products/combo-of-laptop-keyboard-skin-15-usb-light-i29870-s93118.html?search=1",
  "https://www.daraz.com.np/products/combo-of-laptop-keyboard-skin-14-usb-light-i29872-s93122.html?search=1",
  "https://www.daraz.com.np/products/laptop-screen-guard-keyboard-skin-151-inch-card-reader-combo-set-i111700-s717405.html?search=1",
  "https://www.daraz.com.np/products/3-in-1-laptop-skin-pack-156-i29895-s93188.html?search=1",
  "https://www.daraz.com.np/products/laptop-screen-guard-keyboard-skin-and-card-reader-combo-set-i111699-s717403.html?search=1",
  "https://www.daraz.com.np/products/3-in-1-laptop-skin-pack-156-i129480921-s1037461818.html?search=1",
  "https://www.daraz.com.np/products/3-in-1-laptop-skin-pack-more-safe-more-protection-146-i29896-s93190.html?search=1",
  "https://www.daraz.com.np/products/wired-optical-usb-mouse-for-laptop-and-pc-i446456-s26145198.html?search=1",
  "https://www.daraz.com.np/products/usb-mouse-black-wired-optical-mouse-1000-dpi-usb-black-i29861-s93097.html?search=1",
  "https://www.daraz.com.np/products/wired-optical-usb-mouse-for-laptop-and-pc-i129471884-s1037452933.html?search=1",
  "https://www.daraz.com.np/products/black-24-ghz-wireless-mouse-2402mhz-2480mhz-i100914138-s1021450914.html?search=1",
  "https://www.daraz.com.np/products/bajeal-gaming-mouse-with-rgb-led-light-2400dpi-10m-clicks-wired-gaming-mouse-i129474828-s1037458198.html?search=1",
  "https://www.daraz.com.np/products/hdmi-hdmi-15-meter-cable-i111829-s717712.html?search=1",
  "https://www.daraz.com.np/products/black-usb-20-extension-cable-type-a-male-to-type-a-female-i29863-s93102.html?search=1",
  "https://www.daraz.com.np/products/usb-c-to-micro-usb-adapter-convert-connector-i9038-s25510.html?search=1",
  "https://www.daraz.com.np/products/rj45-ethernet-cable-connector-f-to-f-type-almond-color-i21237-s64592.html?search=1",
  "https://www.daraz.com.np/products/male-female-3-meter-usb-cable-i111646-s717280.html?search=1",
  "https://www.daraz.com.np/products/male-female-usb-cable15m-i111840-s717745.html?search=1",
  "https://www.daraz.com.np/products/vga-to-vga-cable-15m-i111651-s717292.html?search=1",
  "https://www.daraz.com.np/products/printer-cable-15-meter-i111837-s717737.html?search=1",
  "https://www.daraz.com.np/products/printer-cable-15-meter-i112029117-s1030300566.html?search=1",
  "https://www.daraz.com.np/products/desktop-power-cable-15m-i111718-s717452.html?search=1",
  "https://www.daraz.com.np/products/laptop-power-cable-i111717-s717449.html?search=1",
];
console.log(urls.length);

const processInBatches = async (urlList, batchSize, startingCounter) => {

  let counter = startingCounter;
  for (let i = 0; i < urlList.length; i += batchSize) {
    const batch = urlList.slice(i, i + batchSize);
    await Promise.all(
      batch.map((url, index) => downloadImages(url, counter + index))
    );
    counter += batchSize;
  }
};

// Process URLs in batches of 10 starting from counter 30
processInBatches(urls, 10, 1);
