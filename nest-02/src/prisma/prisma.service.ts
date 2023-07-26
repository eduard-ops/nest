/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit(): Promise<void> {
		await this.$connect()
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async enableShutdownHooks(app: INestApplication): Promise<void> {
		process.on('beforeExit', async () => {
			await app.close()
		})
	}
}
