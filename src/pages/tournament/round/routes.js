import Home from './Home'
import Draw from './Draw'
import Ballot from './ballot/Index'
import ballot_routes from './ballot/routes'

export default [{
    path: 'ballot',
    component: Ballot,
    children: ballot_routes
  }, {
    path: 'home',
    props: true,
    component: Home
  }, {
    path: 'draw',
    props: true,
    component: Draw
  }, {
    path: '',
    redirect: 'home'
}]
