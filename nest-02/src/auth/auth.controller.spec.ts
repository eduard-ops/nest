import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
	let controller: AuthController
	let service: AuthService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [AuthService]
		}).compile()

		controller = module.get<AuthController>(AuthController)
		service = module.get<AuthService>(AuthService)
	})

	describe('signup', () => {
		it('should register a new user', async () => {
			const userData = {
				name: 'igor',
				email: 'test@example.com',
				password: 'password'
			}
			jest.spyOn(service, 'signUp').mockResolvedValueOnce(userData)
			const result = await controller.register(userData)
			expect(result).toEqual({ userData })
			// eslint-disable-next-line @typescript-eslint/unbound-method
			expect(service.signUp).toHaveBeenCalledWith(userData)
		})
	})
})
