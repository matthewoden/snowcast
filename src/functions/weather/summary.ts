import {DateTime} from 'luxon'

type Hourly = {
  dt: number;
  temp: number;
  pop: number;
  weather: {
    main: string;
    description: string;
  }[];
};

type WindowRange = {
  startDate: DateTime;
  endDate: DateTime;
  lowTemp: number;
  message: string;
};



const summary = (hourly: Hourly[]): WindowRange[] => {
    return hourly.map(({dt, temp, weather, pop}) => {
    const date = DateTime.fromSeconds(dt, {zone: 'utc'}).setZone('America/Chicago');
    const day = date.toFormat('EEE')
    const time = date.toFormat('ha')
    const roundedTemp = Math.round(temp)
    const main = weather[0].main
    const isPrecipitation = ['rain', 'snow', 'drizzle', 'thunderstorm'].includes(main.toLowerCase())
    const chanceOfPrecipitation = pop * 100
    return { date, day, time, temp: roundedTemp, isPrecipitation, chanceOfPrecipitation, main }
  })
  .reduce((acc, {date, day, time, temp, isPrecipitation, main, chanceOfPrecipitation}, index, list) => {
    // find windows of precipitation, and join them for a summary.
    if (isPrecipitation && chanceOfPrecipitation > 20) {
      const newWindow = {
        startDate: date,
        startDay: day,
        startTime: time,
        endDate: date,
        endDay: day,
        endTime: time,
        lowTemp: temp,
        temp,
        main,
        isPrecipitation,
        chanceOfPrecipitation
      }

      if (acc.length === 0) {
        acc.push(newWindow)
      } else {
        const lastHour = list[index - 1]
        const lastWindow = acc[acc.length - 1]

        if (lastHour.isPrecipitation) {
          lastWindow.chanceOfPrecipitation = Math.max(lastWindow.chanceOfPrecipitation, chanceOfPrecipitation)
          lastWindow.lowTemp = Math.min(lastWindow.lowTemp, temp)
          lastWindow.endDate = date
          lastWindow.endDay = day
          lastWindow.endTime = time
        } else {
          acc.push(newWindow)
        }
      }
    }
    return acc
  }, [])
  .map(({startDate, startDay, startTime, endDate, endDay, endTime, main, lowTemp, chanceOfPrecipitation}) => {

  // if we're looking at adjacent days, or an overnight forecast just show the start day and end time.
    const closeTogether = startDate.plus({days: 1}).toFormat('EEE') === endDay && startDate.hour > 12  && endDate.hour < 12

    let range = `${startDay}, ${startTime} - ${endDay}, ${endTime}`
    if (startDay === endDay || closeTogether) {
      if (startTime === endTime) {
        range = `${startDay}, ${startTime}`
      } else {
        range = `${startDay}, ${startTime} - ${endTime}`
      }
    }
    return {
      startDate,
      endDate,
      lowTemp,
      message: `${range} \n${main} (${chanceOfPrecipitation}%) | ${lowTemp}°F\n`
    }
  })
}

export default summary
