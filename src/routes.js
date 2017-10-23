import Index from 'pages/Index'
import Login from 'pages/Login'
import Signup from 'pages/Signup'
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
    path: '/:tournament_name',
    component: Tournament,
    props: true,
    children: tournament_routes
  }, {
    path: '/',
    redirect: '/home'
  }
]
