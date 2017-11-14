import Home from './Home'
import Participant from './participant/Index'
import participant_routes from './participant/routes'

export default [
    {
        path: ':participant(\\adjudicator|speaker|audience)',
        props: true,
        component: Participant,
        children: participant_routes
    }, {
        path: 'home',
        component: Home
    }, {
        path: '',
        redirect: 'home'
    }
]
