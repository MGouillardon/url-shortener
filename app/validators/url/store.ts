import vine from '@vinejs/vine'

export const urlStoreValidator = vine.compile(
  vine.object({
    title: vine.string().optional(),
    url: vine.string().url(),
  })
)
