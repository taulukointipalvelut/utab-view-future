import Home from './Home'
import Reveal from './reveal/Index'
import reveal_routes from './reveal/routes'

export default [
    {
        path: 'home',
        component: Home
    }, {
        path: 'reveal',
        component: Reveal,
        children: reveal_routes
    }, {
        path: '',
        redirect: 'home'
    }
]
