import {
	Controller,
	Post,
	Body,
	HttpCode,
	Get,
	Req,
	Param
} from '@nestjs/common'

import { AuthService } from './auth.service'

import { SignupDto } from './dto/signup.dto'

import { ISignin, ISignup, ITokens } from './types/interfaces'

import { SigninDto } from './dto/signin.dto'

import { Auth } from './guards/jwt.guard'
import { User } from '@prisma/client'

import { EmailVerifyDto } from '../mail/dto/email-verify.dto'

import { RefreshDto } from './dto/refresh.dro'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	@HttpCode(201)
	async register(@Body() body: SignupDto): Promise<ISignup> {
		const { name, email } = await this.authService.signUp(body)
		return { name, email }
	}

	@Post('signin')
	@HttpCode(200)
	async login(@Body() body: SigninDto): Promise<ISignin> {
		const data = await this.authService.signIn(body)
		return data
	}

	@Post('refresh')
	@HttpCode(200)
	async getNewTokens(@Body() body: RefreshDto): Promise<ITokens> {
		const data = await this.authService.getNewTokens(body.refreshToken)
		return data
	}

	@Post('email/verify')
	@HttpCode(200)
	async verifyEmail(
		@Body() body: EmailVerifyDto
	): Promise<{ message: string }> {
		const { code, email } = body

		await this.authService.verifyEmail(+code, email)
		return { message: 'Verification successful' }
	}

	@Post('email/resend-verification/:email')
	@HttpCode(200)
	async againSendVerify(
		@Param() { email }: { email: string }
	): Promise<{ message: string }> {
		await this.authService.againSendVerify(email)
		return { message: 'Verification email sent' }
	}

	@Get('signout')
	@HttpCode(204)
	@Auth()
	async logout(@Req() req: Request & { user: User }): Promise<object> {
		const { id } = req.user
		await this.authService.signOut(id)
		return {}
	}
}
