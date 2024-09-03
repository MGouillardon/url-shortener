import Url from '#models/url'
import User from '#models/user'

export default class UrlService {
  public async createUrl(user: User, url: string, title?: string): Promise<Url> {
    const newUrl = new Url()
    newUrl.title = title || ''
    newUrl.url = this.normalizeUrl(url)
    newUrl.shortened = await this.generateShortUrl()

    await newUrl.related('user').associate(user)
    await newUrl.save()

    return newUrl
  }

  public async getUrlByShortCode(shortCode: string): Promise<Url> {
    return await Url.findByOrFail('shortened', shortCode);
  }

  public async deleteUrlByShortCode(shortCode: string): Promise<void> {
    const url = await Url.findByOrFail('shortened', shortCode)
    await url.delete()
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`
    }
    return url
  }

  private async generateShortUrl(): Promise<string> {
    let shortUrl: string;
    let existingUrl: Url | null;
  
    do {
      shortUrl = this.createShortUrl();
      existingUrl = await Url.findBy('shortened', shortUrl);
    } while (existingUrl);
  
    return shortUrl;
  }
  
  private createShortUrl(): string {
    return Math.random().toString(36).substring(7);
  }
}
