import fastifyCors from '@fastify/cors'
import { fastify } from 'fastify'
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { createAccount } from './http/routes/auth/create-account'

const PORT = 3000

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

app.register(createAccount)

app.listen({ port: PORT }, () => {
	console.log(`Server listening on port ${PORT}`)
})
