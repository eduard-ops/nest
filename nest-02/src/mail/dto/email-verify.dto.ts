import {
	IsNotEmpty,
	IsEmail,
	MaxLength,
	MinLength,
	IsString
} from 'class-validator'

export class EmailVerifyDto {
	@IsNotEmpty()
	@IsEmail()
	@MinLength(8)
	@MaxLength(64)
	email: string

	@IsString()
	@IsNotEmpty()
	@MaxLength(4)
	@MinLength(4)
	code: string
}
