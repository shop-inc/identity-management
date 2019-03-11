/** Helper functions that are reused throughout the microservice */
// @ts-ignore
import jwt from 'jsonwebtoken';
import env from '../config';
import User from '../database/models/user';
import { serverLogger } from '../loggers';
import MailEventEmitter from './mail';

const { SECRET_KEY } = env;

export const generateJWT = (user: User, expiresAfter?: number) => {
  return jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: expiresAfter || 60 * 60 * 24 });
};

export class VerificationEmail {
  private readonly mailData: MailData;
  private readonly mailer: MailEventEmitter;
  private readonly user: User;
  private readonly token: string;

  constructor(user: User) {
    this.mailer = new MailEventEmitter();
    // TODO Handle mail sending failure
    this.mailer.on('success', this.handleSendSuccess);
    this.mailer.on('failure', this.handleSendFailure);
    this.user = user;
    this.token = generateJWT(user, 60 * 60 * 24 * 3);
    this.mailData = {
      to: user.email,
      subject: 'Shop-Inc Account Verification Email',
      html: this.verificationMailTemplate(user.name),
    };
  }

  public send = () => {
    this.mailer.emit('send', this.mailData);
  };

  private verificationMailTemplate = (name: string) => {
    // TODO Create a good verification email template
    return `<div>${name} ${this.token}</div>`;
  };

  private handleSendSuccess = () => {
    // Update user verified status
    this.user.updateMailSent();
  };

  private handleSendFailure = (mailData: MailData) => {
    // TODO Handle sending failure
    serverLogger(`Verification email for ${mailData.to} was not sent.`);
  };
}
