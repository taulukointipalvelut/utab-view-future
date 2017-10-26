import Home from './Home'
import Tournament from './Tournament'
import Allocation from './Allocation'
import Result from './result/Index'
import result_routes from './result/routes'

export default [{
    path: 'home',
    component: Home
  }, {
    path: ':tournament_id/home',
    props: true,
    component: Tournament
  }, {
    path: ':tournament_id',
    redirect: ':tournament_id/home'
  }, {
    path: ':tournament_id/rounds/:r_str/allocation',
    props: true,
    component: Allocation
  }, {
    path: ':tournament_id/result',
    props: true,
    component: Result,
    children: result_routes
  }, {
    path: '',
    redirect: 'home'
}]
