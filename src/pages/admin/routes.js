import Home from './Home'
import Tournament from './Tournament'
import Allocation from './Allocation'
import Result from './Result'
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
    path: ':tournament_name/rounds/:r/allocation',
    props: true,
    component: Allocation
  }, {
    path: ':tournament_name/result',
    props: true,
    component: Result
  }, {
/*  }, {
    path: ':tournament_name/rounds/:r',
    props: true,
    component: Round
  }, {*/
    path: '',
    redirect: 'home'
}]
