import Url from '#models/url'
import User from '#models/user'
import { urlStoreValidator } from '#validators/url/store'
import type { HttpContext } from '@adonisjs/core/http'

export default class UrlController {
  public async index({ view, auth, request }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    const urls = await Url.query()
      .where('userId', user.id)
      .orderBy('createdAt', 'desc')
      .paginate(page, 2)

    return view.render('pages/url/index', { urls: urls })
  }

  public async store({ request, response, auth, session }: HttpContext) {
    try {
      const { url, title } = await request.validateUsing(urlStoreValidator)
      const user = auth.user as User

      const newUrl = new Url()
      newUrl.title = title || ''
      newUrl.url = this.normalizeUrl(url)
      newUrl.shortened = await this.generateShortUrl()

      await newUrl.related('user').associate(user)
      await newUrl.save()

      session.flash('success', 'URL shortened successfully')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', "Couldn't shorten the URL")
      return response.redirect().back()
    }
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`
    }
    return url
  }

  private async generateShortUrl(): Promise<string> {
    let shortUrl: string
    let existingUrl: Url | null

    do {
      shortUrl = Math.random().toString(36).substring(7)
      existingUrl = await Url.findBy('shortened', shortUrl)
    } while (existingUrl)

    return shortUrl
  }

  public async redirect({ params, response, session }: HttpContext) {
    try {
      const url = await Url.findByOrFail('shortened', params.shortCode)
      return response.redirect(url.url)
    } catch (error) {
      session.flash('error', 'The URL does not exist')
      return response.redirect().toRoute('dashboard')
    }
  }
}
