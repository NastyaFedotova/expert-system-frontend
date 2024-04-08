const path = require('path');

module.exports = {
  sassOptions: {
    additionalData: `
              @import "src/styles/variables.module.scss";
              @import "src/styles/mixins.module.scss";
            `,
  },
  images: {
    domains: ['127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/api/v1/images/**',
      },
    ],
  },
};
