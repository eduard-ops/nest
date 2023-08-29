import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

import { User } from '@prisma/client'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { AuthService } from '../auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		readonly configService: ConfigService,

		private readonly AuthService: AuthService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('accessSecretKey')
		})
	}

	async validate({ id }: Pick<User, 'id'>): Promise<User | null> {
		const findUser = await this.AuthService.findToken(+id)

		if (!findUser.accessToken) {
			throw new UnauthorizedException('Unauthorized')
		}

		return await this.AuthService.findUserById(+id)
	}
}
