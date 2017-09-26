import Home from './Home'
import Tournament from './Tournament'
import Allocation from './Allocation'
//import Round from './Round'

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
    path: ':tournament_name/allocation',
    props: true,
    component: Allocation
/*  }, {
    path: ':tournament_name/:r',
    props: true,
    component: Round
*/  }, {
    path: '',
    redirect: 'home'
}]
