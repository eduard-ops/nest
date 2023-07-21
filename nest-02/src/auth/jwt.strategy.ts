import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

import { User } from '@prisma/client'
import { Injectable } from '@nestjs/common'

import { AuthService } from './auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		readonly configService: ConfigService,

		private readonly AuthService: AuthService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('accessSecret')
		})
	}

	async validate({ id }: Pick<User, 'id'>): Promise<User | null> {
		return await this.AuthService.findUserById(+id)
	}
}
