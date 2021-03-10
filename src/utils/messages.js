const generateMessage = (text) => ({ text, createdAt: new Date().getTime() });
const generateLocationMessage = (url) => {
  return {
    url,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
