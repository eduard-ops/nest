import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getMailConfig } from 'config/mail.config'
import { PrismaService } from 'prisma/prisma.service'

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMailConfig,
			inject: [ConfigService]
		})
	],
	providers: [MailService, PrismaService],
	exports: [MailService]
})
export class MailModule {}
