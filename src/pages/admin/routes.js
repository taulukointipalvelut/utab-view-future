import Home from './Home'
//import Tournament from './Tournament'
//import Round from './Round'

export default [{
    path: 'home',
    component: Home
/*  }, {
    path: ':tournament_name/home',
    props: true,
    component: Tournament
  }, {
    path: ':tournament_name',
    redirect: ':tournament_name/home'
  }, {
    path: ':tournament_name/:round_name',
    props: true,
    component: Round
*/  }, {
    path: '',
    redirect: 'home'
}]