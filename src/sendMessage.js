const axios = require('axios');

module.exports = (senderPSID, message) => {
  return axios.post('https://graph.facebook.com/v2.6/me/messages', {
    access_token: process.env.PAGE_ACCESS_TOKEN,
    recipient: { id: senderPSID },
    message: message
  });
};
