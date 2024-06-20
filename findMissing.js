const fs = require('fs');
const path = require('path');

function findMissingFiles(directoryPath, maxNumber) {
  for (let number = 1; number <= maxNumber; number++) {
    const filename = `${number}a.webp`;
    const filePath = path.join(directoryPath, filename);

    if (!fs.existsSync(filePath)) {
      console.log(`${filename} `);
    }
  }
}

// Example usage:
const directoryPath = './images'; // Replace with the path to your directory
const maxNumber = 296;
findMissingFiles(directoryPath, maxNumber);



