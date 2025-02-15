import { prisma } from '@/lib/prisma'
import { hash } from 'argon2'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function createAccount(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/users',
		{
			schema: {
				tags: ['auth'],
				summary: 'Create a new account',
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string().min(8),
				}),
			},
		},
		async (request, reply) => {
			const { email, name, password } = request.body

			const userWithSameEmail = await prisma.user.findUnique({
				where: {
					email,
				},
			})

			if (userWithSameEmail) {
				reply.status(400).send({
					message: 'Email already in use',
				})
				return
			}

			const passwordHash = await hash(password)

			await prisma.user.create({
				data: {
					email,
					name,
					password: passwordHash,
				},
			})

			return reply.status(201).send({
				message: 'Account created',
			})
		},
	)
}
