<template lang="pug">
  #app-content(v-loading.fillscreen.lock="loading_tournament", element-loading-text="Loading...")
    utab-header(:login="isAuth", :tournament="tournament")
    main(v-if="tournament")
      router-view(:tournament="tournament", :loading="loading")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import utab_header from 'components/utab-header.vue'

export default {
  components: {
    'utab-header': utab_header
  },
  props: ['tournament_name'],
  data () {
    return {
      loading: true
    }
  },
  computed: {
    loading_tournament () {
      return !this.tournament
    },
    has_rounds () {
      return this.rounds && this.rounds.length > 0
    },
    icon_href () {
      return this.tournament ? this.tournament.href : { to: '/home' }
    },
    tournament () {
      return this.target_tournament
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
      return `${ this.tournament.tournament_name }/${ targets.join('/') }`
    },
    ...mapActions([
      'init_rounds'
    ])
  },
  mounted () {
    this.init_rounds({ tournament: this.tournament })
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
