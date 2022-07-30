const nodemailer = require('nodemailer')

class MailService {
    constructor() {
        this.tranporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }
    async sendActivationEmail(to, link) {

        await this.tranporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Activate account in ' + process.env.API_URL,
                text: '',
                html: `
				<section>
					<h1>Подтверждение аккаунта NZox.</h1>
					<p style="width: 80%">Перейдите по ссылке чтобы подтвердить аккаунт и наслаждайтесь всеми возможностями приложения.</p>
					<a href=${link}>${link}</a>
					<small>С ув. Никита Змановский</small>
				</section>
			`
            }, (err, info) => console.log(err))
    }
}
module.exports = new MailService()
