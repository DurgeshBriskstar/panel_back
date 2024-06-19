const fs = require('fs');
const path = require('path');

const convertUTCtoLocal = (utcTime, timeZone) => ({
    $function: {
        body: function (utcTime, timeZone) {
            return new Date(utcTime).toLocaleString('en-US', { timeZone: timeZone });
        },
        args: [utcTime, timeZone],
        lang: 'js'
    }
});

const base64ToBuffer = (base64String) => {
    const base64Image = base64String.split(';base64,').pop();
    return Buffer.from(base64Image, 'base64');
};

const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

async function saveFileAndContinue(imagePath, buffer) {
    try {
        fs.writeFile(imagePath, buffer, async (err) => {
            if (err) {
                return false
            }
            return true;
        });
        return true;
    } catch (err) {
        console.log("err", err);
        return false
    }
}
module.exports = {
    convertUTCtoLocal,
    base64ToBuffer,
    ensureDirectoryExistence,
    saveFileAndContinue
}