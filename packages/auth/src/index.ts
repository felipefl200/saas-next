import {
	AbilityBuilder,
	type CreateAbility,
	type MongoAbility,
	createMongoAbility,
} from '@casl/ability'

import { z } from 'zod'
import type { User } from './models/user'
import { permissions } from './permissions'
import { billingSubject } from './subjects/billing'
import { inviteSubject } from './subjects/invite'
import { organizationSubject } from './subjects/organization'
import { projectSubject } from './subjects/projects'
import { userSubject } from './subjects/user'

export * from './models/user'
export * from './models/organization'
export * from './models/project'

const appAbilitiesSchema = z.union([
	userSubject,
	projectSubject,
	organizationSubject,
	userSubject,
	inviteSubject,
	billingSubject,
	z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilitiesFor(user: User) {
	const builder = new AbilityBuilder<AppAbility>(createAppAbility)

	if (typeof permissions[user.role] !== 'function') {
		throw new Error(`No permissions defined for role ${user.role}`)
	}

	permissions[user.role](user, builder)

	const ability = builder.build({
		detectSubjectType(subject) {
			return subject.__typename
		},
	})

	return ability
}
