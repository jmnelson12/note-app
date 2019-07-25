function responseToSend(res, { success = false, message = "", payload = {} }) {
    return res.json({
        success,
        message,
        payload
    });
}

module.exports = {
    responseToSend
};
