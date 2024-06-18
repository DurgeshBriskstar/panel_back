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
module.exports = {
    convertUTCtoLocal,
    base64ToBuffer
}