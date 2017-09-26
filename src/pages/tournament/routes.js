import Home from './Home'
import Round from './round/Index'
import round_routes from './round/routes'
import Adjudicator from './Adjudicator'

export default [
    {
        path: 'adjudicator',
        component: Adjudicator
    }, {
        path: 'home',
        component: Home
    }, {
        path: 'audience',
        redirect: 'home'
    }, {
        path: 'debater',
        redirect: 'home'
    }, {
        path: 'rounds/:r',
        props: true,
        component: Round,
        children: round_routes
    }, {
        path: '',
        redirect: 'home'
    }
]
