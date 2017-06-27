<template lang="pug">
  .router-view-content(v-if="tournament")
    section.page-header
      h1 Adjudicators
    section
      loading-container(:loading="loading", no_item_text="No Round Available")
        link-list(v-for="round in rounds", :key="round")
          legend(slot="legend") {{ round.name }}
          router-link(:to="url(round, 'draw')")
            link-list-item Draw &amp; Allocation
          router-link(:to="url(round, 'ballot')")
            link-list-item Score Sheet
      link-list
        legend(slot="legend") Admin
        router-link(:to="auth.href.login.to")
          link-list-item Login
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list'
import link_list_item from 'components/link-list-item'
import loading_container from 'components/loading-container'

export default {
  props: ['tournament', 'rounds', 'loading'],
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item,
    'loading-container': loading_container
  },
  data () {
    return {}
  },
  computed: {
    has_rounds () {
      return this.rounds && this.rounds.length > 0
    },
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'isAuth'
    ])
  },
  methods: {
    url (round, ...targets) {
      return `${ round.href.to }/${ targets.join('/') }`
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
