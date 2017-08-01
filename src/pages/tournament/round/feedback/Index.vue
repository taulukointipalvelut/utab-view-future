<template lang="pug">
  .router-view-content
    router-view(:tournament="tournament", :round="round", :adjudicators="adjudicators", :teams="teams", :loading="loading")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  props: ['tournament', 'round'],
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState([
      'auth',
      'adjudicators',
      'teams'
    ]),
    ...mapGetters([
      'isAuth'
    ])
  },
  methods: {
    ...mapActions([
      'init_adjudicators'
    ])
  },
  mounted () {
    this.init_adjudicators({
      tournament: this.tournament,
      round: this.round
    }).then(() => {
        this.loading = false
      })
  }
}
</script>
