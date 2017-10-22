import Team from './Team'
import Speaker from './Speaker'
import Adjudicator from './Adjudicator'
import Poi from './Poi'
import Best from './Best'
export default [
    {
        path: 'team',
        props: true,
        component: Team
    }, {
        path: 'speaker',
        props: true,
        component: Speaker
    }, {
        path: 'adjudicator',
        props: true,
        component: Adjudicator
    }, {
        path: 'poi',
        props: true,
        component: Poi
    }, {
        path: 'best',
        props: true,
        component: Best
    }/*, {
        path: '',
        redirect: 'team'
    }*/
]
