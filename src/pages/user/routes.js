import Tournament from './tournament/Index'
import tournament_routes from './tournament/routes'
import Home from './Home'

export default [
  {
    path: 'home',
    component: Home
  }, {
    path: ':tournament_id',
    component: Tournament,
    props: true,
    children: tournament_routes
  }, {
    path: '',
    redirect: 'home'
  }
]
