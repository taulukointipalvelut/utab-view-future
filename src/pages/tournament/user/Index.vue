<template lang="pug">
  loading-container.router-view-content(:loading="loading", no_item_text="Fail to load round data")
    router-view(:loading="loading", :oneloading="oneloading")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import utab_header from 'components/utab-header.vue'
import loading_container from 'components/loading-container'

export default {
  components: {
    'utab-header': utab_header,
    'loading-container': loading_container
  },
  data () {
    return {
      oneloading: false
    }
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
      'loading',
      'auth'
    ]),
    ...mapGetters([
      'target_tournament',
      'tournament_href',
      'is_auth'
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
      this.oneloading = true
      this.init_one({ tournament: this.target_tournament })
          .then(() => {
              this.oneloading = false
          })
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
