<template lang="pug">
  .router-view-content
    router-view(:tournament="tournament", :round="round", :adjudicators="adjudicators", :teams="teams")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  props: ['tournament', 'round'],
  computed: {
    ...mapState([
      'loading',
      'auth',
      'adjudicators',
      'teams'
    ]),
    ...mapGetters([
      'isAuth'
    ])
  }
}
</script>
