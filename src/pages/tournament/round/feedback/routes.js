import Home from './Home'

export default [{
    path: 'home',
    props: true,
    component: Home
  }, {
    path: '',
    redirect: 'home'
}]
