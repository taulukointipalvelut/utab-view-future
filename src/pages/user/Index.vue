<template lang="pug">
  #app-content(v-loading.fillscreen.lock="loading || reloading", element-loading-text="Loading...")
    utab-header
    main
      router-view(v-if="!loading")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import utab_header from 'components/utab-header.vue'

export default {
  components: {
    'utab-header': utab_header
  },
  computed: {
    ...mapState([
      'auth',
      'loading',
      'reloading'
    ]),
    ...mapGetters([
      'is_auth',
      'tournament_href',
      'target_tournament'
    ])
  },
  mounted () {
    if (!this.is_auth) {
      this.$router.replace({ path: this.auth.href.login.to+'?message=Please Login', query: { next: this.$route.fullPath } })
    }
  },
  watch: {
    is_auth (new_value) {
      if (!new_value) {
        this.$router.replace({ path: this.auth.href.login.to+'?message=Login Timed Out', query: { next: this.$route.fullPath } })
      }
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
