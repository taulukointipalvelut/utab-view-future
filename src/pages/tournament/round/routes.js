import Home from './Home'
import Ballot from './ballot/Index'
import ballot_routes from './ballot/routes'

export default [{
    path: 'ballot',
    component: Ballot,
    children: ballot_routes
  }, {
    path: 'home',
    component: Home
  }, {
    path: '',
    redirect: 'home'
}]