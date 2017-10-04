import Raw from './Raw'
import Compiled from './Compiled'
import Slide from './slide/Index'
//import slide_routes from './slide/routes'

export default [
    {
        path: 'compiled',
        component: Compiled
    }, {
        path: 'raw/:r_str',
        component: Raw,
        props: true
    }, {
        path: '',
        redirect: 'compiled'
    }/*, {
        path: 'slide',
        props: true,
        component: Slide,
        children: slide_routes
    }*/
]
