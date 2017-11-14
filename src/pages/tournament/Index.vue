<template lang="pug">
  #app-content(v-loading.fillscreen.lock="one_loading", element-loading-text="Loading...")
    utab-header
    main(v-if="!one_loading")
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
    icon_href () {
      return this.target_tournament ? this.tournament_href(this.target_tournament) : { to: '/home' }
    },
    ...mapState([
      'rounds'
    ]),
    ...mapGetters([
      'target_tournament',
      'tournament_href',
      'one_loading'
    ])
  },
  methods: {
    ...mapActions(['init_one'])
  },
  mounted () {
    this.init_one({ tournament: this.target_tournament })
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
