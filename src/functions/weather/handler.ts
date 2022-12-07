import { sendMessage } from '@libs/notification';
import { getHourlyForecast, getSummary } from '@libs/openweather';
import { response } from '@libs/response';



const weather = async () => {
  try {
    console.log('Fetching the local weather forecast...');

    const hourly = await getHourlyForecast()
    const summary = getSummary(hourly)
    const message = summary.map(h => h.message).join('\n').trim() || 'No precipitation in the next 48 hours.'

    await sendMessage(`Weather: \n${message}`)
    return response(200, message)

  } catch (error) {
    console.error(error);
    const message = 'There was an error fetching the weather forecast.';
    await sendMessage(message)
    return response(500, message)
  }
};

export default weather
