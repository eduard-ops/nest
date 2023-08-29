import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'

import { ConfigModule } from '@nestjs/config'
import { MailModule } from './mail/mail.module'
import config from 'config'

@Module({
	imports: [
		ConfigModule.forRoot({ load: [config], isGlobal: true }),
		AuthModule,
		MailModule
	]
})
export class AppModule {}
