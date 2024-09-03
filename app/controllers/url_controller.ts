import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Url from '#models/url'
import User from '#models/user'
import { urlStoreValidator } from '#validators/url/store'
import UrlService from '#services/url_service'

@inject()
export default class UrlController {
  constructor(private urlService: UrlService) {}

  public async index({ view, auth, request }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    const limit = 2

    const urls = await Url.query()
      .where('userId', user.id)
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return view.render('pages/url/index', { urls })
  }

  public async store({ request, response, auth, session }: HttpContext) {
    const { url, title } = await request.validateUsing(urlStoreValidator)
    const user = auth.user as User

    try {
      await this.urlService.createUrl(user, url, title)
      session.flash('success', 'URL shortened successfully')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Couldn't shorten the URL")
      return response.redirect().back()
    }
  }

  public async redirect({ params, response, session }: HttpContext) {
    const { shortCode } = params

    try {
      const url = await this.urlService.getUrlByShortCode(shortCode)
      return response.redirect(url.url)
    } catch (error) {
      session.flash('error', 'The URL does not exist')
      return response.redirect().toRoute('dashboard')
    }
  }

  public async delete({ params, response, session }: HttpContext) {
    const { shortCode } = params

    try {
      await this.urlService.deleteUrlByShortCode(shortCode)
      session.flash('success', 'URL deleted successfully')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Couldn't delete the URL")
      return response.redirect().back()
    }
  }
}
