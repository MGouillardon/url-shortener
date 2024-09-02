import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  public async index({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  public async store({ auth, request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.create({ email, password })

    try {
      await auth.use('web').login(user)
      response.redirect().toRoute('url')
    } catch (error) {
      response.redirect().back()
    }
  }
}
