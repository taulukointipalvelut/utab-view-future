import Speaker from './Speaker'
import Score from './Score'
import Winner from './Winner'
import Check from './Check'

export default [
  {
    path: 'speaker',
    name: 'speaker',
    props: true,
    component: Speaker
  },
  {
    path: 'score/:sequence_name',
    name: 'score',
    props: true,
    component: Score
  },
  {
    path: 'winner',
    name: 'winner',
    component: Winner
  },
  {
    path: 'check',
    name: 'check',
    component: Check
  },
  {
    path: 'home',
    redirect: 'speaker'
  }
]
