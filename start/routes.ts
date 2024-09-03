/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const LoginController = () => import('#controllers/auth/login_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const UrlController = () => import('#controllers/url_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.on('/').render('pages/auth/login')

router
  .group(() => {
    router.get('/login', [LoginController, 'index']).as('auth.login')
    router.post('/login', [LoginController, 'handle']).as('auth.login.handle')
    router.get('/register', [RegisterController, 'index']).as('auth.register')
    router.post('/register', [RegisterController, 'store']).as('auth.register.store')
    router
      .post('/logout', async ({ auth, response }) => {
        await auth.use('web').logout()
        return response.redirect().toRoute('auth.login')
      })
      .as('auth.logout')
  })
  .prefix('/auth')

router
  .group(() => {
    router.get('url', [UrlController, 'index']).as('url')
    router.post('url', [UrlController, 'store']).as('url.store')
  })
  .use(middleware.auth())
