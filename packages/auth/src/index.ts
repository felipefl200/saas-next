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
import { projectSubject } from './subjects/projects'
import { userSubject } from './subjects/user'

const appAbilitiesSchema = z.union([
	userSubject,
	projectSubject,
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

	const ability = builder.build()

	return ability
}
