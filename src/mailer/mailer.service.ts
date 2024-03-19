import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
//Error: Missing credentials for "PLAIN" at SMTPConnection
export class MailerService {
    constructor(private configService: ConfigService) {}

    mainTransporter() {
        const transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            secure: false,
            auth: {
                user: 'c60d21867221e6',
                pass: 'bf60f575949cbc',
                type: 'login',
            },
        })

        return transporter
    }
    async sendMail() {
        const mailOptions = {
            from: {
                name: this.configService.get('DEFAULT_MAIL_NAME'),
                address: this.configService.get('DEFAULT_MAIL_ADDRESS'),
            },
            to: {
                name: 'User',
                address: 'suxrobjon1998@gmail.com',
            },
            subject: 'Test Mail',
            text: 'This is a test mail',
        }

        try {
            const info = await this.mainTransporter().sendMail(mailOptions)
            return info
        } catch (error) {
            console.error('error', error)
        }
    }

    sendMailCreatedNewCompany(email: string, subject: string, template: string) {
        const mailOptions = {
            from: {
                name: this.configService.get('DEFAULT_MAIL_NAME'),
                address: this.configService.get('DEFAULT_MAIL_ADDRESS'),
            },
            to: {
                name: 'User',
                address: email,
            },
            subject: subject,
            html: template,
        }
        try {
            const info = this.mainTransporter().sendMail(mailOptions)
            return info
        } catch (error) {
            console.error('error', error)
        }
    }

    async sendAddPassworUrl(email: string, url: string) {
        const mailOptions = {
            from: {
                name: this.configService.get('DEFAULT_MAIL_NAME'),
                address: this.configService.get('DEFAULT_MAIL_ADDRESS'),
            },
            to: {
                name: 'User',
                address: email,
            },
            subject: 'Iltimos, parol biriktiring!',
            html: `<h1 style="color: green">Assalomu alaykum, Tabriklaymiz sizning karta muvaffaqiyatli yaratildi</h1> <br>
             <p>Iltimos quydagi link orqal kartangiz parol biriktiring!</p> <br> <a href="${url}">Parol biriktirish</a>`,
        }
        try {
            const info = await this.mainTransporter().sendMail(mailOptions)
            return info
        } catch (error) {
            console.error('error', error)
        }
    }

    async sendAddPassworUrlCompany(email: string) {
        const mailOptions = {
            from: {
                name: this.configService.get('DEFAULT_MAIL_NAME'),
                address: this.configService.get('DEFAULT_MAIL_ADDRESS'),
            },
            to: {
                name: 'User',
                address: email,
            },
            subject: 'Muaffaqiyatli karta yaratildi!',
            html: `<h1 style="color: green">Assalomu alaykum, Tabriklaymiz sizning kartangiz muvaffaqiyatli yaratildi</h1> <br>`,
        }
        try {
            const info = await this.mainTransporter().sendMail(mailOptions)
            return info
        } catch (error) {
            console.error('error', error)
        }
    }

    async sendTransactionUrl(from_card_number: number, email: string, to_card_number: number, amount: number) {
        let time = new Date()
        const mailOptions = {
            from: {
                name: this.configService.get('DEFAULT_MAIL_NAME'),
                address: this.configService.get('DEFAULT_MAIL_ADDRESS'),
            },
            to: {
                name: 'User',
                address: email,
            },
            subject: 'Transaction',
            html: `<div style="max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h1 style="color: #333; text-align: center;">Transaction Confirmation</h1>
        <p style="color: #666;">Dear User,</p>
        <p style="color: #666;">We are writing to confirm that your transaction has been successfully processed. Below are the details of your transaction:</p>
        
        <div style="margin-top: 30px;">
            <div style="background: #f9f9f9; padding: 10px; border-radius: 5px;">
                <p><span style="font-weight: bold;">From Card Number:</span> ${from_card_number}</p>
                <p><span style="font-weight: bold;">To Card Number:</span> ${to_card_number}</p>
                <p><span style="font-weight: bold;">Amount:</span> ${amount}</p>
                <p><span style="font-weight: bold;">Date:</span> ${time}</p>
            </div>
        </div>

        <div style="margin-top: 30px; text-align: center;">
            <p style="font-size: 12px;">This is an automated message, please do not reply to this email.</p>
        </div>
    </div>`,

            // get time  now
        }

        try {
            const info = await this.mainTransporter().sendMail(mailOptions)
            return info
        } catch (error) {
            console.error('error', error)
        }
    }

    async sendTransactionCode(email: string, url: string) {
        const mailOptions = {
            from: {
                name: this.configService.get('DEFAULT_MAIL_NAME'),
                address: this.configService.get('DEFAULT_MAIL_ADDRESS'),
            },
            to: {
                name: 'User',
                address: email,
            },
            subject: 'Transaction',
            html: `<div style="max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h1 style="color: #333; text-align: center;">Transaction Confirmation</h1>
        <p style="color: #666;">Dear User,</p>
        <p style="color: #666;">We are writing to confirm that your transaction has been successfully processed. Below are the details of your transaction:</p>
        
        <div style="margin-top: 30px;">
            <div style="background: #f9f9f9; padding: 10px; border-radius: 5px;">
                <p><span style="font-weight: bold;">Transaction Code:</span> <a href="${url}">Transaction Code</a> </p>
                <p><span style="font-weight: bold;">Date:</span> ${new Date()}</p>
            </div>
        </div>
   
        <div style="margin-top: 30px; text-align: center;">
            <p style="font-size: 12px;">This is an automated message, please do not reply to this email.</p>
        </div>
    </div>`,
        }

        try {
            const info = await this.mainTransporter().sendMail(mailOptions)
            return info
        } catch (error) {
            console.error('error', error)
        }
    }
}
