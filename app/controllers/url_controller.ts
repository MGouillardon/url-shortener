import Url from '#models/url'
import User from '#models/user'
import { urlStoreValidator } from '#validators/url/store'
import type { HttpContext } from '@adonisjs/core/http'

export default class UrlController {
  public async index({ view }: HttpContext) {
    return view.render('pages/url/index')
  }

  public async store({ request, response, auth, session }: HttpContext) {
    try {
      const { url, title } = await request.validateUsing(urlStoreValidator)
      const user = auth.user as User

      const newUrl = new Url()
      newUrl.title = title || ''
      newUrl.url = url.trim()
      newUrl.shortened = await this.generateShortUrl()

      await newUrl.related('user').associate(user)
      await newUrl.save()

      session.flash('success', 'URL shortened successfully')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Failed to shorten URL')
      return response.redirect().back()
    }
  }

  private async generateShortUrl() {
    return Math.random().toString(36).substring(7)
  }
}
