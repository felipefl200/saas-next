import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
	type ZodTypeProvider,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { createAccount } from './http/routes/auth/create-account'

const PORT = 3000

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Fastify API',
			description: 'FullStack Saas Appp',
			version: '0.1.0',
		},
		servers: [],
	},
	transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
	routePrefix: '/docs',
})

app.register(fastifyCors)

app.register(createAccount)

app.listen({ port: PORT }, () => {
	console.log(`Server listening on port ${PORT}`)
})
