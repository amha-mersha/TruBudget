import nodemailer, { SentMessageInfo } from "nodemailer";
import * as SMTPTransport from "nodemailer/lib/smtp-transport";
import * as Mail from "nodemailer/lib/mailer";
import config from "./config";
import logger from "./logger";
import SMTPConnection from "nodemailer/lib/smtp-connection";
import { isEmpty } from "./util";

const sendMail = async (
  emailAddresses: string | string[],
  subject?: string,
  emailText?: string,
  template?: unknown,
): Promise<void> => {
  const auth: SMTPConnection.AuthenticationType | undefined =
    isEmpty(config.smtpServer.user) && isEmpty(config.smtpServer.password)
      ? undefined
      : {
          user: config.smtpServer.user,
          pass: config.smtpServer.password,
        };

  const transportOptions: SMTPTransport.Options = {
    host: config.smtpServer.host,
    port: config.smtpServer.port,
    secure: config.smtpServer.secure,
    auth,
  };

  try {
    logger.debug({ transportOptions }, "Sending email with transport options");
    const transporter = nodemailer.createTransport(transportOptions);
    const info: SentMessageInfo = await transporter.sendMail({
      from: config.email.from,
      to: emailAddresses,
      subject: subject || config.email.subject,
      text: emailText || config.email.text,
      html: template,
    } as Mail.Options);

    logger.info(`Email sent to ${emailAddresses}: ${info.messageId}`);
  } catch (error) {
    logger.error(`Failed to send email to ${emailAddresses}: ${error}`);
    throw error; // maybe handle it higher on call stack
  }
};
export default sendMail;
