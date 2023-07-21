import {
	ConflictException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { SignupDto } from './dto/signup.dto'
import { SigninDto } from './dto/signin.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { signinType, signupType } from './types/types'
import { User } from '@prisma/client'

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService
	) {}

	async signUp(body: SignupDto): Promise<signupType> {
		const { email, password, name } = body
		const checkUser = await this.findUserByEmail(email)
		if (checkUser) {
			throw new ConflictException('Email address is already registered')
		}
		const hashPassword = await bcrypt.hash(password, 12)
		const result = await this.prisma.user.create({
			data: { email, name, password: hashPassword },
			select: { name: true, email: true }
		})
		return result
	}

	async signIn(body: SigninDto): Promise<signinType> {
		const { email, password } = body

		const findUser = await this.findUserByEmail(email)

		const passCompare = bcrypt.compareSync(password, findUser?.password ?? '')

		if (!findUser || !passCompare) {
			throw new UnauthorizedException(
				'Email address or password does not correct'
			)
		}

		const payload = {
			id: findUser.id
		}

		const token = await this.jwtService.signAsync(payload)
		return { accessToken: token }
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

	findAll() {
		return `This action returns all auth`
	}

	update(id: number, updateAuthDto: UpdateAuthDto) {
		return `This action updates a #${id} auth`
	}

	remove(id: number) {
		return `This action removes a #${id} auth`
	}
}
