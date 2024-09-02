import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
  vine.object({
    fullName: vine
      .string()
      .minLength(4)
      .alphaNumeric()
      .unique(async (db, value) => {
        const users = await db.from('users').where('full_name', value).first()
        return !users
      }),

    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const users = await db.from('users').where('email', value).first()
        return !users
      }),
    password: vine.string().minLength(8),
  })
)
