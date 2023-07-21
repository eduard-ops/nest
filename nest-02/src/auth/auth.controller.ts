import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from '@nestjs/common'

import { AuthService } from './auth.service'

import { SignupDto } from './dto/signup.dto'

import { UpdateAuthDto } from './dto/update-auth.dto'

import { signinType, signupType } from './types/types'
import { SigninDto } from './dto/signin.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	async register(@Body() body: SignupDto): Promise<signupType> {
		const { name, email } = await this.authService.signUp(body)
		return { name, email }
	}

	@Post('signin')
	async login(@Body() body: SigninDto): Promise<signinType> {
		const data = await this.authService.signIn(body)
		return data
	}

	@Get()
	findAll() {
		return this.authService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') _id: string) {}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
		return this.authService.update(+id, updateAuthDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.authService.remove(+id)
	}
}
