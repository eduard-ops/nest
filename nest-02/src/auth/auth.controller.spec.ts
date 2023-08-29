import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { MailService } from '../mail/mail.service'
import { PrismaService } from '../prisma/prisma.service'
import { ConfigModule } from '@nestjs/config'

import { SignupDto } from './dto/signup.dto'

import { ISignup } from './types/interfaces'

describe('AuthController', () => {
	let authController: AuthController
	let authService: AuthService

	const mockAuthService = {
		signUp: jest.fn(),
		signIn: jest.fn(),
		getNewTokens: jest.fn(),
		verifyEmail: jest.fn(),
		againSendVerify: jest.fn(),
		signOut: jest.fn()
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: mockAuthService
				},
				{
					provide: JwtService,
					useValue: {}
				},
				{
					provide: PrismaService,
					useValue: {}
				},
				{
					provide: MailService,
					useValue: {}
				}
			],
			imports: [ConfigModule]
		}).compile()
		authController = module.get<AuthController>(AuthController)
		authService = module.get<AuthService>(AuthService)
	})

	describe('register', () => {
		it('should return an object containing name and email', async () => {
			const signupDto: SignupDto = {
				name: 'Test User',
				email: 'test@example.com',
				password: ''
			}
			const result: ISignup = {
				name: 'Test User',
				email: 'test@example.com'
			}

			mockAuthService.signUp.mockResolvedValue(result)

			expect(await authController.register(signupDto)).toStrictEqual(result)
		})
	})
})
