import twilio from 'twilio';
import crypto from 'crypto';

const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

export function generateCode() {
  return crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase();
}

export async function sendToken(number, token) {
  // Generate the token
  const message = await client.messages.create({
    body: `${token} is your SafeSend verification code. :)`,
    to: number,
    from: '+12017012952'
  });

  return message.sid;
}
