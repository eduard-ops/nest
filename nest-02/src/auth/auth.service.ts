import {
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

import { Token, User } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
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

		await this.prisma.token.create({ data: { userId: result.id } })

		return result
	}

	async signIn(body: SigninDto): Promise<ISignin> {
		const { email, password } = body

		const findUser = await this.findUserByEmail(email)

		if (!findUser) {
			throw new NotFoundException('User not found')
		}

		const passCompare = bcrypt.compareSync(password, findUser.password)

		if (!passCompare) {
			throw new UnauthorizedException('invalid password')
		}

		const { accessToken, refreshToken } = await this.generateTokens(
			findUser.id,
			this.config.get('refreshSecretKey')
		)

		await this.prisma.token.update({
			where: { userId: findUser.id },
			data: { accessToken, refreshToken }
		})

		return { accessToken, refreshToken }
	}

	async signOut(id: number): Promise<void> {
		await this.prisma.token.update({
			where: { userId: id },
			data: { accessToken: '', refreshToken: '' }
		})
	}

	async findToken(id: number): Promise<Token | null> {
		return await this.prisma.token.findUnique({ where: { id } })
	}

	async getNewTokens(token: string): Promise<ITokens> {
		const result = await this.validToken(
			token,
			this.config.get('refreshSecretKey')
		)

		const findToken = await this.prisma.token.findFirst({
			where: { refreshToken: token }
		})

		if (!result || !findToken) {
			throw new UnauthorizedException('Invalid refresh token')
		}

		const user = await this.findUserById(result.id)

		const { accessToken, refreshToken } = await this.generateTokens(
			user.id,
			this.config.get('refreshSecretKey')
		)

		await this.prisma.token.update({
			where: { userId: user.id },
			data: { accessToken, refreshToken }
		})

		return { accessToken, refreshToken }
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

	async generateTokens(id: number, refreshSecret: string): Promise<ITokens> {
		const accessToken = await this.jwtService.signAsync(
			{ id },
			{
				expiresIn: '1h'
			}
		)
		const refreshToken = await this.jwtService.signAsync(
			{ id },
			{
				expiresIn: '7d',
				secret: refreshSecret
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
