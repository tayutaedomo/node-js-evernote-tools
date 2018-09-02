module.exports = {
  "API_CONSUMER_KEY" : process.env.API_CONSUMER_KEY,
  "API_CONSUMER_SECRET" : process.env.API_CONSUMER_SECRET,
  "SANDBOX" : process.env.SANDBOX == 'true',
  "CHINA" : process.env.CHINA == 'true',
  "AUTH_CALLBACK_URL": process.env.AUTHT_CALLBACK_URL || 'http://localhost:3000/oauth_callback'
};

