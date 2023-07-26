import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'config/jwt.config'
import { ConfigService, ConfigModule } from '@nestjs/config'

import { JwtStrategy } from './strategy/jwt.strategy'

import { PrismaService } from 'prisma/prisma.service'

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getJwtConfig,
			inject: [ConfigService]
		})
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, PrismaService]
})
export class AuthModule {}
