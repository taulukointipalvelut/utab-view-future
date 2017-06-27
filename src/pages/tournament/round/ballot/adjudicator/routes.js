import Speaker from './Speaker'
import Score from './Score'

export default [
  {
    path: 'speaker',
    name: 'speaker',
    component: Speaker
  },
  {
    path: 'score/:sequence_name',
    name: 'score',
    props: true,
    component: Score
  },
  {
    path: 'home',
    redirect: 'speaker'
  },
  {
    path: '',
    redirect: 'speaker'
  }
]