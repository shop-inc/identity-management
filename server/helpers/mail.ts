import { EventEmitter } from 'events';
import mailgun, { Mailgun } from 'mailgun-js';
import env from '../config';

const { MAILGUN_API_KEY, MAILGUN_DOMAIN, ADMINISTRATOR_EMAIL } = env;

export class MailEventEmitter extends EventEmitter {
  private mailgun: Mailgun;

  constructor() {
    super();
    this.mailgun = mailgun({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });
    this.on('send', this.sendMail);
  }

  private sendMail = (mailData: MailData) => {
    this.mailgun.messages().send(
      { from: `Shop-Inc Auth <${ADMINISTRATOR_EMAIL}>`, ...mailData }, (error) => {
        if (error) {
          // FIXME Failure has not been handled yet
          this.emit('failure', mailData);
          return;
        }
        this.emit('success');
      });
  };
}

export default MailEventEmitter;
