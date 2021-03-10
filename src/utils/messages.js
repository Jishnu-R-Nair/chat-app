const formatMessage = (text) => ({ text, createdAt: new Date().getTime() });

module.exports = {
  formatMessage,
};
