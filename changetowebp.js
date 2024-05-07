const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to convert an image to WebP format
function convertToWebp(inputImagePath, outputImagePath) {
    return sharp(inputImagePath)
        .toFormat('webp')
        .toFile(outputImagePath);
}

// Function to convert all images in a folder to WebP format
function convertImagesToWebp(inputFolder, outputFolder) {
    fs.readdir(inputFolder, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach((file) => {
            // Check if the file is an image (supports jpg, jpeg, and png)
            if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
                const inputImagePath = path.join(inputFolder, file);
                const outputImagePath = path.join(outputFolder, `${file.slice(0, -4)}.webp`);

                // Convert image to WebP format
                convertToWebp(inputImagePath, outputImagePath)
                    .then(() => {
                        console.log(`${file} converted successfully.`);
                    })
                    .catch((err) => {
                        console.error('Error converting image:', err);
                    });
            }
        });
    });
}

// Define input and output folders
const inputFolder = 'webpimg'; // Change this to your input folder path
const outputFolder = 'webp'; // Change this to your output folder path

// Create the output folder if it doesn't exist
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

// Convert images in the input folder to WebP format
convertImagesToWebp(inputFolder, outputFolder);
