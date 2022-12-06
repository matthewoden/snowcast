import { middyfy } from '@libs/lambda';
import agent from 'superagent';
import summary from './summary'
import { addReminder, sendMessage } from './notification';
import { DateTime } from 'luxon';

const coordinates = {
  lat: process.env.LATITUDE,
  lon: process.env.LONGITUDE,
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
    const {body: {hourly, daily}} = await agent
      .get(`https://api.openweathermap.org/data/3.0/onecall`)
      .query({
          ...coordinates,
          appId: process.env.OPENWEATHER_KEY,
          units: 'imperial',
          exclude: 'minutely,alerts'
        });

    const precipitation = summary(hourly)
    const message = precipitation.map(h => h.message).join('\n').trim() || 'No precipitation in the next 48 hours.'

    const now = DateTime.now().setZone('America/Chicago')
    if (precipitation.length > 0) {
      // if there's precipitation later today, or overnight, send a reminder
      const found = precipitation.find(({startDate, endDate}) =>
        startDate.diff(now).as('hours') < 16 || endDate.diff(now).as('hours') < 16)
      if (found) {
        await addReminder()
      }
    }



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
