const fs = require('fs');
const path = require('path');

function countAndInsertValues(files) {
    // Define an object to store the count of each number
    const countMap = {};

    // Iterate through each file
    files.forEach(file => {
        // Extract the base name of the file
        const fileName = path.basename(file);

        // Extract the number from the file name
        const number = fileName.match(/\d+/)[0];

        // Increment the count for this number
        countMap[number] = (countMap[number] || 0) + 1;
    });

    // Define an object to store the result
    const result = {};

    // Iterate through the countMap to convert counts to alphabet characters
    for (const number in countMap) {
        // Calculate the character code for 'a' by adding the count to the character code of 'a' - 1
        const characterCode = countMap[number] + 'a'.charCodeAt(0) - 1;

        // Convert the character code to the corresponding alphabet character
        const alphabetCharacter = String.fromCharCode(characterCode);

        // Insert the value into the result object
        result[number] = alphabetCharacter;
    }

    // Return the result object
    return result;
}

// Example usage:
const directoryPath = 'images';
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    const result = countAndInsertValues(files.map(file => path.join(directoryPath, file)));
   
    for(const key in result) {
        console.log(`${result[key]}`);
    }
});
