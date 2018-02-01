/**
* Authenticates webhook for Facebook
* @returns {any}
*/
module.exports = async context => {
  if (
    context.params.mode === 'subscribe' &&
    context.params.verifyToken === process.env.VERIFY_TOKEN
  ) {
    return JSON.parse(context.params.challenge);
  }
  throw new Error('Invalid auth request');
};

