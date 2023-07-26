export type ISignup = {
	email: string
	name: string
}

export interface ISignin {
	accessToken: string
	refreshToken: string
}

export interface ITokens {
	accessToken: string
	refreshToken: string
}
