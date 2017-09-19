<template lang="pug">
  #app-content
    utab-header(:login="isAuth")
    main
      h1 Welcome!
      link-list(:loading="loading", no_item_text="No Tournament Available")
        legend(slot="legend") Tournaments
        router-link(v-for="tournament in tournaments", :to="tournament.href", :key="tournament", v-if="!loading")
          link-list-item {{ tournament.tournament_name }}
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapActions } from 'vuex'
import utab_header from 'components/utab-header.vue'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'

export default {
  components: {
    'utab-header': utab_header,
    'link-list': link_list,
    'link-list-item': link_list_item
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    has_tournaments () {
      return this.tournaments && this.tournaments.length > 0
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
    this.init_tournaments()
      .then(() => {
        this.loading = false
      })
  }
}
</script>

<style lang="stylus">
  @import "../common"

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
