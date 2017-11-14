import Raw from './Raw'
import Compiled from './Compiled'

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
    }
]
