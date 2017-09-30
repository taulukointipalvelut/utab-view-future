import Raw from './Raw'
import Compiled from './Compiled'
import Slide from './slide/Index'
//import slide_routes from './slide/routes'

export default [
    {
        path: 'compiled',
        props: true,
        component: Compiled
    }, {
        path: '',
        redirect: 'raw'
    }, {
        path: 'raw',
        props: true,
        component: Raw
    }/*, {
        path: 'slide',
        props: true,
        component: Slide,
        children: slide_routes
    }*/
]
