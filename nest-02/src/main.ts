import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from 'prisma/prisma.service'
import { ValidationPipe } from '@nestjs/common'
import * as morgan from 'morgan'

const { port } = process.env

const PORT = port || 3000

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule)
	const prismaService = app.get(PrismaService)
	await prismaService.enableShutdownHooks(app)
	app.use(morgan('tiny'))
	app.useGlobalPipes(new ValidationPipe())
	app.setGlobalPrefix('api')
	await app.listen(PORT, () =>
		console.log(`Database connected successful, server started on port ${PORT}`)
	)
}

void bootstrap()
