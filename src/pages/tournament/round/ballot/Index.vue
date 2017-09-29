<template lang="pug">
  .router-view-content
    router-view(:tournament="tournament", :loading="loading")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  props: ['tournament'],
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState([
      'auth'
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
      tournament: this.tournament
    }).then(() => {
        this.loading = false
      })
  }
}
</script>
