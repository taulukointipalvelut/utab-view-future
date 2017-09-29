import Home from './Home'
import Adjudicator from './adjudicator/Index'
import adjudicator_routes from './adjudicator/routes'

export default [{
    path: 'home',
    props: true,
    component: Home
  }, {
    path: ':id_str',
    props: true,
    component: Adjudicator,
    children: adjudicator_routes
  }, {
    path: '',
    redirect: 'home'
}]
