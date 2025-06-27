const axios = require('axios');

const sendSMS = async (to, text) => {
  const url = 'https://msg.smsguruonline.com/fe/api/v1/send';

  const params = {
    username: 'vimlajewellers.trans',
    password: '0RvS8',
    unicode: false,
    from: 'VIMLAJ',
    to,
    dltprincipalEntityId: '1201159680625344081',
    dltContentId: '1707175093772914727',
    text,
  };

  await axios.get(url, { params });
};

module.exports = sendSMS;
