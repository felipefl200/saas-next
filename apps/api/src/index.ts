import { defineAbilitiesFor, projectSchema } from '@saas/auth'

const ability = defineAbilitiesFor({ role: 'MEMBER', id: '1' })

const userCanInviteSomeone = ability.can('manage', 'User')
const userCanDeleteSomeone = ability.can('delete', 'User')

const project = projectSchema.parse({
	id: 'project-id',
	ownerId: '2',
})

console.log(project)
