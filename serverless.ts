import type { AWS } from '@serverless/typescript';

import weather from '@functions/weather';
import reminder from '@functions/reminder';

const serverlessConfiguration: AWS = {
  service: 'snowcast',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { weather, reminder },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
    dotenv: {
      required: {
        env: [
          'PHONE_NUMBER',
          'TWILIO_SID',
          'TWILIO_AUTH',
          'TWILIO_NUMBER',
          'OPENWEATHER_KEY',
          'IFTTT_WEBHOOK_KEY',
          'LATITUDE',
          'LONGITUDE',
        ]
      }
    }
  },
};

module.exports = serverlessConfiguration;
