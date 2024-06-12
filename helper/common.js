const convertUTCtoLocal = (utcTime, timeZone) => ({
    $function: {
        body: function (utcTime, timeZone) {
            return new Date(utcTime).toLocaleString('en-US', { timeZone: timeZone });
        },
        args: [utcTime, timeZone],
        lang: 'js'
    }
});
module.exports = {
    convertUTCtoLocal,
}