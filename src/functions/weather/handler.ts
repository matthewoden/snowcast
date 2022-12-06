import { middyfy } from '@libs/lambda';
import agent from 'superagent';
import summary from './summary'
import { sendMessage } from './notification';

const stLouis = {
  lat: 38.619440,
  lon: -90.251470,
}

const response = (status, message) => {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
    })
  }
}

const weather = async () => {
  try {
    console.log('Fetching the local weather forecast...');
    const {body: {hourly}} = await agent
      .get(`https://api.openweathermap.org/data/3.0/onecall`)
      .query({
          ...stLouis,
          appId: process.env.OPENWEATHER_KEY,
          units: 'imperial',
          exclude: 'minutely,daily,alerts'
        });

    const message = summary(hourly).trim() || 'No precipitation in the next 48 hours.'
    await sendMessage(`Weather: \n${message}`)
    return response(200, message)

  } catch (error) {
    console.error(error);
    const message = 'There was an error fetching the weather forecast.';
    await sendMessage(message)
    return response(500, message)
  }
};

export const main = middyfy(weather);
