import Home from './Home'
import Allocation from './Allocation'
import Result from './result/Index'
import result_routes from './result/routes'

export default [{
    path: 'home',
    props: true,
    component: Home
  }, {
    path: 'rounds/:r_str/allocation',
    props: true,
    component: Allocation
  }, {
    path: 'result',
    props: true,
    component: Result,
    children: result_routes
  }, {
    path: '',
    redirect: 'home'
  }]
