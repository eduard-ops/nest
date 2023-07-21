import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	MaxLength
} from 'class-validator'

export class SigninDto {
	@IsNotEmpty()
	@IsEmail()
	@MinLength(8)
	@MaxLength(64)
	email: string

	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	@MaxLength(20)
	password: string
}
