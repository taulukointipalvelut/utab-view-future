import Home from './Home'
import Tournament from './Tournament'
import Allocation from './Allocation'
import Result from './result/Index'
import result_routes from './result/routes'

export default [{
    path: 'home',
    component: Home
  }, {
    path: ':tournament_name/home',
    props: true,
    component: Tournament
  }, {
    path: ':tournament_name',
    redirect: ':tournament_name/home'
  }, {
    path: ':tournament_name/rounds/:r_str/allocation',
    props: true,
    component: Allocation
  }, {
    path: ':tournament_name/result',
    props: true,
    component: Result,
    children: result_routes
  }, {
    path: '',
    redirect: 'home'
}]
