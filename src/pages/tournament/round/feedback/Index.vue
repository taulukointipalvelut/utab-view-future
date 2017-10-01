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
      'init_all'
    ])
  },
  mounted () {
    this.init_all().then(() => {
        this.loading = false
      })
  }
}
</script>
