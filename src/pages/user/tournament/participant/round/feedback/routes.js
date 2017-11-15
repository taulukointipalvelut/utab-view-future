import Home from './Home'
import Evaluation from './team/Index'
import evaluation_routes from './team/routes'

export default [{
    path: 'home',
    props: true,
    component: Home
  }, {
    path: ':from_id_str',
    props: true,
    component: Evaluation,
    children: evaluation_routes
  }, {
    path: '',
    redirect: 'home'
}]
