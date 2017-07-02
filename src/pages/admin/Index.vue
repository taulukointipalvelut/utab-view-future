<template lang="pug">
  #app-content(v-loading.fillscreen.lock="loading_tournaments", element-loading-text="Loading...")
    utab-header(:login="isAuth")
    main
      router-view(:tournaments="tournaments", :loading="loading")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import utab_header from 'components/utab-header.vue'

export default {
  components: {
    'utab-header': utab_header
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    loading_tournaments () {
      return !this.tournaments
    },
    icon_href () {
      return this.tournament ? this.tournament.href : { to: '/home' }
    },
    ...mapState([
      'auth',
      'tournaments'
    ]),
    ...mapGetters([
      'isAuth'
    ])
  },
  methods: {
    ...mapActions([
      'init_tournaments'
    ])
  },
  mounted () {
    if (!this.isAuth) {
      this.$router.replace({ path: this.auth.href.login.to, query: { next: this.$route.fullPath } })
    }
    this.init_tournaments()
      .then(() => {
        this.loading = false
      })
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
