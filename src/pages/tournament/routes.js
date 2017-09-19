import Home from './Home'
import Round from './round/Index'
import round_routes from './round/routes'
import Adjudicator from './Adjudicator'

export default [{
    path: 'adjudicator',
    component: Adjudicator
  }, {
    path: 'home',
    component: Home
  }, {
    path: ':round_num',
    props: true,
    component: Round,
    children: round_routes
  }, {
    path: '',
    redirect: 'home'
}]
