import Home from './Home'
import Tournament from './tournament/Index'
import tournament_routes from './tournament/routes'

export default [{
    path: 'home',
    component: Home
  }, {
    path: ':tournament_id',
    props: true,
    component: Tournament,
    children: tournament_routes
  }, {
    path: '',
    redirect: 'home'
}]
