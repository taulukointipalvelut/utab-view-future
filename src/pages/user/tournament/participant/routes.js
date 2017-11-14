import Home from './Home'
import Round from './round/Index'
import round_routes from './round/routes'

export default [
    {
        path: 'home',
        props: true,
        component: Home
    }, {
        path: 'rounds/:r_str',
        props: true,
        component: Round,
        children: round_routes
    }, {
        path: '',
        redirect: 'home'
    }
]
