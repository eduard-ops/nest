import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'

import { SignupDto } from './dto/signup.dto'

import { SigninDto } from './dto/signin.dto'

import { PrismaService } from '../prisma/prisma.service'

import { JwtService } from '@nestjs/jwt'

import * as bcrypt from 'bcrypt'

import { ISignin, ISignup, ITokens } from './types/interfaces'

import { User } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { MailService } from '../mail/mail.service'
import * as moment from 'moment'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly mailServise: MailService,
		private readonly config: ConfigService
	) {}

	async signUp(body: SignupDto): Promise<ISignup> {
		const { email, password, name } = body
		const checkUser = await this.findUserByEmail(email)
		if (checkUser) {
			throw new ConflictException('Email address is already registered')
		}
		const hashPassword = await bcrypt.hash(password, 12)

		const result = await this.prisma.user.create({
			data: { email, name, password: hashPassword },
			select: { name: true, email: true, id: true }
		})

		const { verificationCode, verifyTime } = this.mailServise.generateCode()

		await this.mailServise.sendEmailConfirmation(
			result.email,
			result.name,
			verificationCode
		)

		await this.mailServise.createEmailVerifications(
			email,
			verificationCode,
			verifyTime
		)

		return result
	}

	async signIn(body: SigninDto): Promise<ISignin> {
		const { email, password } = body

		const findUser = await this.findUserByEmail(email)

		const passCompare = bcrypt.compareSync(password, findUser.password)

		const verifyUser = await this.mailServise.findCodeByEmail(email)

		if (!findUser || !passCompare || !verifyUser.isVerify) {
			throw new UnauthorizedException(
				401,
				`Email is wrong or not verify, or password is wrong`
			)
		}

		const { accessToken, refreshToken } = await this.generateTokens(findUser.id)

		await this.prisma.user.update({
			where: { id: findUser.id },
			data: { accessToken, refreshToken }
		})

		return { accessToken, refreshToken }
	}

	async signOut(id: number): Promise<void> {
		await this.prisma.user.update({
			where: { id },
			data: { accessToken: '', refreshToken: '' }
		})
	}

	async verifyEmail(code: number, email: string): Promise<void> {
		const res = await this.mailServise.findCodeByEmail(email)

		if (!res) {
			throw new NotFoundException('Email not found')
		}

		if (res.emailCode !== code) {
			throw new BadRequestException(401, 'Invalid code')
		}

		const currentTime = moment().unix()
		if (res.expiredTime <= currentTime) {
			throw new BadRequestException(401, 'Code has been expired')
		}

		await this.mailServise.confirmVerifyEmail(email)
	}

	async againSendVerify(email: string): Promise<void> {
		const res = await this.mailServise.findCodeByEmail(email)

		const user = await this.findUserByEmail(email)

		if (!res) {
			throw new NotFoundException('Email not found')
		}

		if (res.isVerify) {
			throw new BadRequestException('Verification has already been passed')
		}

		const { verificationCode, verifyTime } = this.mailServise.generateCode()

		await this.mailServise.updateEmailVerifications(
			email,
			verificationCode,
			verifyTime
		)

		await this.mailServise.sendEmailConfirmation(
			email,
			user.name,
			verificationCode
		)
	}

	async getNewTokens(token: string): Promise<ITokens> {
		const result = await this.validToken(
			token,
			this.config.get('refreshSecretKey')
		)

		const findToken = await this.prisma.user.findFirst({
			where: { refreshToken: token }
		})

		if (!result || !findToken) {
			throw new UnauthorizedException('Invalid refresh token')
		}

		const user = await this.findUserById(result.id)

		const { accessToken, refreshToken } = await this.generateTokens(user.id)

		await this.prisma.user.update({
			where: { id: user.id },
			data: { accessToken, refreshToken }
		})

		return { accessToken, refreshToken }
	}

	async findToken(id: number): Promise<User | null> {
		return await this.prisma.user.findUnique({ where: { id } })
	}

	async validToken(
		token: string,
		secret: string
	): Promise<{ id: number } | null> {
		try {
			const result: { id: number } = await this.jwtService.verifyAsync(token, {
				secret
			})

			return result
		} catch (error) {
			return null
		}
	}

	async generateTokens(id: number): Promise<ITokens> {
		const accessToken = await this.jwtService.signAsync({ id })
		const refreshToken = await this.jwtService.signAsync(
			{ id },
			{
				secret: this.config.get('refreshSecretKey'),
				expiresIn: this.config.get('refreshTokenExpires')
			}
		)

		return { accessToken, refreshToken }
	}

	async findUserByEmail(email: string): Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	async findUserById(id: number): Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: {
				id
			}
		})
	}
}
