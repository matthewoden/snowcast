import twilio from 'twilio'
import agent from 'superagent'

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH)

export async function sendMessage(message: string) {
  console.log(`twilio: sending message: \n${message}`)

  let response = await client.messages.create({
    body: message,
    to: process.env.PHONE_NUMBER,
    from: process.env.TWILIO_NUMBER,
  })

  return response.sid
}


export async function addReminder(reminderTime: string, snowTime: string) {
  console.log(`IFTTT: calling webhook`)
  const event = 'snowcast'
  const baseUrl = `https://maker.ifttt.com/trigger/${event}/with/key`

  console.log(reminderTime, snowTime)
  const {body} = await agent
    .get(`${baseUrl}/${process.env.IFTTT_WEBHOOK_KEY}`)
    .query({ value1: reminderTime, value2: `Snowcast detected wintry weather: ${snowTime}` })

  console.log(body)
  return body
}
