<template lang="pug">
  #app-content(v-loading.fillscreen.lock="loading_tournament", element-loading-text="Loading...")
    utab-header(:login="isAuth")
    main(v-if="target_tournament")
      router-view
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import utab_header from 'components/utab-header.vue'

export default {
  components: {
    'utab-header': utab_header
  },
  computed: {
    loading_tournament () {
      return !this.target_tournament
    },
    has_rounds () {
      return this.rounds && this.rounds.length > 0
    },
    icon_href () {
      return this.target_tournament ? this.target_tournament.href : { to: '/home' }
    },
    ...mapState([
      'auth',
      'rounds'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament'
    ])
  },
  methods: {
    url (...targets) {
      return `${ this.target_tournament.name }/${ targets.join('/') }`
    },
    ...mapActions([
      'init_rounds'
    ])
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
