import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  public async index({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  public async store({ auth, request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)

    try {
      await auth.use('web').login(user)
      response.redirect().toRoute('url')
    } catch (error) {
      response.redirect().back()
    }
  }
}
