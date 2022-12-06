import getSummary from '../weather/summary'
import { addReminder, sendMessage } from '@libs/notification';
import { DateTime } from 'luxon';
import { getHourlyForecast } from '@libs/openweather';
import { response } from '@libs/response';

const snowReminder = async ({ hours, reminderTime }) => {
  try {
    console.log('Checking for snow...')
    const hourly = await getHourlyForecast()
    const summary = getSummary(hourly)

    console.log(`found ${summary.length} precipitation events in the next 48 hours`)

    if (summary.length > 0) {
      const now = DateTime.now().setZone('America/Chicago')
      const foundSnow = summary.find(({startDate, endDate, lowTemp}) =>
        [startDate, endDate].some(d => d.diff(now).as('hours') < hours) && lowTemp <= 32
      )

      if (foundSnow) {
        console.log('setting snow reminder for:', reminderTime)
        await addReminder(reminderTime, foundSnow.message)
      } else {
        console.log('no snow in desired range')
      }
    } else {
      console.log('no snow in the next 48 hours')
    }

    return response(200, "Snow reminder set, if needed.")

  } catch (error) {
    console.error(error);
    const message = 'There was an error adding a reminder.';
    await sendMessage(message)
    return response(500, message)
  }
};

export const main = snowReminder;
