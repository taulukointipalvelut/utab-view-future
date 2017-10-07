import Team from './Team'
import Speaker from './Speaker'

export default [
    {
        path: 'team',
        props: true,
        component: Team
    }, {
        path: 'speaker',
        props: true,
        component: Speaker
    }/*, {
        path: '',
        redirect: 'team'
    }*/
]
