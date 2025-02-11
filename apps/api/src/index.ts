import { defineAbilitiesFor } from '@saas/auth'

const ability = defineAbilitiesFor({ role: 'ADMIN' })

const userCanInviteSomeone = ability.can('manage', 'User')
const userCanDeleteSomeone = ability.can('delete', 'User')

console.log(userCanInviteSomeone)
console.log(userCanDeleteSomeone)
