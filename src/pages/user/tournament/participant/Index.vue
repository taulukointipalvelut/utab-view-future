<template lang="pug">
  loading-container(:loading="one_loading || one_reloading")
    router-view(v-if="!one_loading")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import utab_header from 'components/utab-header.vue'
import loading_container from 'components/loading-container'

export default {
  components: {
    'loading-container': loading_container,
    'utab-header': utab_header
  },
  props: ['participant'],
  computed: {
    loading_tournament () {
      return !this.target_tournament
    },
    icon_href () {
      return this.target_tournament ? this.tournament_href(this.target_tournament) : { to: '/home' }
    },
    ...mapState([
      'rounds',
      'auth'
    ]),
    ...mapGetters([
      'target_tournament',
      'tournament_href',
      'is_auth',
      'one_loading',
      'one_reloading'
    ])
  },
  methods: {
    ...mapActions([
      'init_one'
    ])
  },
  watch: {
    is_auth (new_value) {
      if (!new_value) {
        this.$router.replace({
          path: this.auth.href.login.to,
          query: { next: this.$route.fullPath, tournament_id: this.target_tournament.id }
        })
      }
    }
  },
  mounted () {
    if (!this.is_auth && this.target_tournament.auth[this.participant].required) {
      this.$router.replace({
        path: this.auth.href.login.to+'?message=Login Timed Out',
        query: { next: this.$route.fullPath, tournament_id: this.target_tournament.id }
      })
    } else {
      this.init_one({ tournament: this.target_tournament })
    }
  }
}
</script>

<style lang="stylus">
  body
    background-color #f5f5f5
  #app-content
    margin 0
    padding 0
    width 100%
    min-height 100vh
  a
    text-decoration none
    color inherit
  main
    padding 5%

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>
