import { Injectable } from '@nestjs/common'

import { MailerService } from '@nestjs-modules/mailer'

import { EmailVerifications } from '@prisma/client'

import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../prisma/prisma.service'

import * as moment from 'moment'

@Injectable()
export class MailService {
	constructor(
		private mailerService: MailerService,
		private config: ConfigService,
		private prisma: PrismaService
	) {}

	async sendEmailConfirmation(
		email: string,
		name: string,
		verificationCode: number
	): Promise<void> {
		await this.mailerService.sendMail({
			to: email,
			subject: 'Welcome to Nice App! Confirm your Email',
			template: './confirmation-email',
			context: {
				name,
				code: verificationCode
			}
		})
	}

	generateCode(): { verificationCode: number; verifyTime: number } {
		const verificationCode = Math.floor(1000 + Math.random() * 9000)
		const verifyTime = moment().add(5, 'minutes').unix()

		return { verificationCode, verifyTime }
	}

	async createEmailVerifications(
		email: string,
		verificationCode: number,
		verifyTime: number
	): Promise<void> {
		await this.prisma.emailVerifications.create({
			data: { email, emailCode: verificationCode, expiredTime: verifyTime }
		})
	}

	async updateEmailVerifications(
		email: string,
		verificationCode: number,
		verifyTime: number
	): Promise<void> {
		await this.prisma.emailVerifications.update({
			where: { email },
			data: {
				email,
				emailCode: verificationCode,
				expiredTime: verifyTime
			}
		})
	}

	async findCodeByEmail(email: string): Promise<EmailVerifications> {
		return await this.prisma.emailVerifications.findUnique({ where: { email } })
	}

	async confirmVerifyEmail(email: string): Promise<void> {
		await this.prisma.emailVerifications.update({
			where: { email },
			data: {
				emailCode: 0,
				expiredTime: 0,
				isVerify: true
			}
		})
	}
}
