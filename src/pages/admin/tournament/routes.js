import Home from './Home'
import Compiled from './Compiled'
import Round from './round/Index'
import round_routes from './round/routes'

export default [{
    path: 'home',
    props: true,
    component: Home
  }, {
    path: 'rounds/:r_str',
    props: true,
    component: Round,
    children: round_routes
  }, {
    path: 'result',
    component: Compiled
  }, {
    path: '',
    redirect: 'home'
  }]
