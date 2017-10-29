import Home from './Home'
import User from './user/Index'
import user_routes from './user/routes'

export default [
    {
        path: ':participant(\\adjudicator|speaker|audience)',
        props: true,
        component: User,
        children: user_routes
    }, {
        path: 'home',
        component: Home
    }, {
        path: '',
        redirect: 'home'
    }
]
