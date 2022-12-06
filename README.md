# Snowcast

I need to make sure that my sidewalk is salted and cleared, but I don't always remember to check the weather.

I wrote this service to gather the next 48 hours from [OpenWeather](https://openweathermap.org/api/one-call-3), and create a precipitation summary for St. Louis every day at 6pm. If there's a need for immediate action -- such as currently snowing/raining or there will be overnight precipitation, a reminder is added to my phone at a time when I'll be able to do that (for example, at 8pm)
## Example Output

Each window of precipitation has the start date, end date, precipitation type, and
lowest temperature. If a window happens on the same day, or overnight, the range
is truncated.

```
Weather:
Tue, 2PM - 3PM
Rain (86%) | 46°F

Tue, 5PM
Rain (82%) | 47°F

Wed, 11PM - 2AM
Rain (74%) | 51°F

Thu, 5AM - 9AM
Rain (100%) | 52°F
```

## Dependencies

### Infrastructure

This is a serverless project. `npm -ig serverless` to install the serverless framework. You'll need your own local credentials.

### Notifications

This uses Twilio for SMS. I could have used SNS with AWS, but I have twilio credits to burn.

Adding reminders is done via IFTTT's app to integrate with iOS notifications, but you could do it with android just as easily. The lambda calls a webhook with the snowcast event, and my applet uses that to trigger a reminder for that day.

You can create your own, or [use the one I built](https://ifttt.com/applets/rwA53x6W-when-a-webhook-gets-the-snowcast-event-add-a-reminder-to-salt-and-shovel)

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npm run deploy` to deploy this stack to AWS

## Test this service

- Run `npm run dev` to invoke the function locally. AWS Credentials will need to be available before testing.

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas


### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file
