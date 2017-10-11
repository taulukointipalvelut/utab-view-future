import Home from './Home'
import Evaluation from './Evaluation'

export default [{
    path: 'home',
    props: true,
    component: Home
  }, {
    path: ':from_id_str',
    props: true,
    component: Evaluation
  }, {
    path: '',
    redirect: 'home'
}]
