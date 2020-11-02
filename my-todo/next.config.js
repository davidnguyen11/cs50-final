const path = require('path');

module.exports = {
  // disable default icon of nextjs at a bottom of page
  devIndicators: {
    autoPrerender: false,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};
