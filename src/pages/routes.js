import Login from './Login'
import Signup from './Signup'
import User from './user/Index'
import user_routes from './user/routes'
import Admin from './admin/Index'
import admin_routes from './admin/routes'

export default [
  {
    path: '/login',
    component: Login
  }, {
    path: '/signup',
    component: Signup
  }, {
    path: '/admin',
    component: Admin,
    props: true,
    meta: {
      requiresAuth: true
    },
    children: admin_routes
  }, {
    path: '/',
    component: User,
    props: true,
    children: user_routes
  }
]
