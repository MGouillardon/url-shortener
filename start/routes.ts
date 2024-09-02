/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const LoginController = () => import('#controllers/auth/login_controller')
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/auth/login')

router.get('/auth/login', [LoginController, 'index']).as('auth.login')
router.post('/auth/login', [LoginController, 'handle']).as('auth.login.handle')
