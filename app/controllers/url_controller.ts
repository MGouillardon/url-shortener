import type { HttpContext } from '@adonisjs/core/http'

export default class UrlController {
  public async index({ view }: HttpContext) {
    return view.render('pages/url/index')
  }
}