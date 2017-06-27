import Index from 'pages/Index'
import Login from 'pages/Login'
import Tournament from 'pages/tournament/Index'
import tournament_routes from 'pages/tournament/routes'

export default [
  {
    path: '/home',
    component: Index
  }, {
    path: '/login',
    component: Login
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