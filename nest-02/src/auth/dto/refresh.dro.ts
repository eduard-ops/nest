import { IsNotEmpty, IsJWT } from 'class-validator'

export class RefreshDto {
	@IsNotEmpty()
	@IsJWT()
	refreshToken: string
}
