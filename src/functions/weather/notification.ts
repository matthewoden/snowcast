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


export async function addReminder() {
  console.log(`IFTTT: calling webhook`)

  const {body} = await agent.get(`https://maker.ifttt.com/trigger/snowcast/with/key/${process.env.IFTTT_WEBHOOK_KEY}`)

  return body
}
