const generateMessage = (text, username = 'Admin') => ({
  text,
  createdAt: new Date().getTime(),
  username,
});
const generateLocationMessage = (url, username) => {
  return {
    url,
    createdAt: new Date().getTime(),
    username,
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
