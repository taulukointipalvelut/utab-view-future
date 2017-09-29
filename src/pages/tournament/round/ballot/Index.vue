<template lang="pug">
  .router-view-content
    router-view(:loading="loading")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
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
      'isAuth',
      'target_tournament'
    ])
  },
  methods: {
    ...mapActions([
      'init_adjudicators'
    ])
  },
  mounted () {
    this.init_adjudicators({
      tournament: this.target_tournament
    }).then(() => {
        this.loading = false
      })
  }
}
</script>
