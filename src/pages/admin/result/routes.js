import Raw from './Raw'
import Compiled from './Compiled'
import Reveal from './reveal/Index'
import reveal_routes from './reveal/routes'

export default [
    {
        path: 'compiled',
        props: true,
        component: Compiled
    }, {
        path: 'raw',
        props: true,
        component: Raw
    }, {
        path: 'reveal',
        props: true,
        component: Reveal,
        children: reveal_routes
    }, {
        path: '',
        redirect: 'raw'
    }
]
