import Home from './Home'
import Round from './round/Index'
import round_routes from './round/routes'
import Participant from './Participant'
import Login from './Login'

export default [
    {
        path: ':participant(\\adjudicator|speaker|audience)',
        props: true,
        component: Participant
    }, {
        path: 'home',
        component: Home
    }, {
        path: 'audience',
        component: Participant
    }, {
        path: 'login',
        component: Login
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
