const nodemailer = require('nodemailer');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendMail(to, link) {
    try {
      console.log('SMTP_HOST:', process.env.SMTP_HOST);
      console.log('SMTP_PORT:', process.env.SMTP_PORT);
      console.log('SMTP_USER:', process.env.SMTP_USER);
      console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD);

      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Activation account on ToDoshbord',
        text: '',
        html: `
      <div>
      <h1>For activate account follow this link</h1>
      <a href="${link}">${link}</a>
      </div>`,
      });

      console.log('mail was send');
    } catch (e) {
      throw new Error('Ошибка при отправке письма:', e);
    }
    // await this.transporter.verify((error, success) => {
    //   if (error) {
    //     console.error('Ошибка при проверке подключения:', error);
    //   } else {
    //     console.log('Сервер готов принимать сообщения');
    //   }
    // });
  }
}

module.exports = new MailService();
