import User from '#models/user'
import { registerUserValidator } from '#validators/auth/register'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  public async index({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  public async store({ auth, request, response, session }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(registerUserValidator)
    const user = await User.create({ fullName, email, password })

    try {
      await auth.use('web').login(user)
      session.flash('success', 'You have been registered successfully.')
      response.redirect().toRoute('url')
    } catch (error) {
      session.flash('error', 'An error occurred while trying to register you. Please try again.')
      return response.redirect().back()
    }
  }
}
