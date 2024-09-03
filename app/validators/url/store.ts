import vine from '@vinejs/vine'

export const urlStoreValidator = vine.compile(
  vine.object({
    url: vine.string().url(),
  })
)
