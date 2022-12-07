import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      schedule: {
        rate: ['cron(0 0 ? * * *)'], // check at 6pm
        input: {
          hours: 14, // and look at weather overnight, until 10am
          reminderTime: '8pm'
        }
      }
    },
    {
      schedule: {
        rate: ['cron(0 16 ? * * *)'], // check at 10am
        input: {
          hours: 4, // and look until 5pm
          reminderTime: 'noon'
        }
      }
    },
  ],
};
