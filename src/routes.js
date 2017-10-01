import Index from 'pages/Index'
import Login from 'pages/Login'
import Tournament from 'pages/tournament/Index'
import tournament_routes from 'pages/tournament/routes'
import Admin from 'pages/admin/Index'
import admin_routes from 'pages/admin/routes'

export default [
  {
    path: '/home',
    component: Index
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/admin',
    component: Admin,
    props: true,
    meta: {
      requiresAuth: true
    },
    children: admin_routes
  }, {
    path: '/logout',
    redirect: '/home'
  }, {
    path: '/:tournament_name',
    component: Tournament,
    props: true,
    children: tournament_routes
  }, {
    path: '/',
    redirect: '/home'
  }
]
