import { ConfigService } from '@nestjs/config'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

import { join } from 'path'

export const getMailConfig = async (
	configService: ConfigService
	// eslint-disable-next-line @typescript-eslint/require-await
): Promise<object> => ({
	transport: {
		host: configService.get('hostMail'),
		port: 2525,
		auth: {
			user: configService.get('mailUser'),
			pass: configService.get('mailPass')
		}
	},
	defaults: {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		from: `"No Reply" <${configService.get('mailFrom')}>`
	},
	template: {
		dir: join(__dirname, '../mail', 'templates'),
		adapter: new HandlebarsAdapter(),
		options: {
			strict: true
		}
	}
})
