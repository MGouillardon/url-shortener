import User from '#models/user'
import { loginUserValidator } from '#validators/auth/login'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  public async index({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  public async handle({ auth, request, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginUserValidator)
    const user = await User.verifyCredentials(email, password)

    try {
      await auth.use('web').login(user)
      session.flash('success', 'You have been logged in successfully.')
      response.redirect().toRoute('dashboard')
    } catch (error) {
      response.redirect().back()
    }
  }
}
