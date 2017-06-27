<template lang="pug">
  .router-view-content(v-if="tournament")
    section.page-header
      h1 {{ tournament.name }}
    section
      link-list
        router-link(:to="url('audience')")
          link-list-item Audience
        router-link(:to="url('debater')")
          link-list-item Debaters
        router-link(:to="url('adjudicator')")
          link-list-item Adjudicators
      link-list(:loading="loading", no_item_text="No Round Available")
        legend(slot="legend") Rounds
        router-link(v-for="round in rounds", :key="round", :to="url(round.href.to)")
          link-list-item {{ round.name }}
      link-list
        legend(slot="legend") Admin
        router-link(:to="auth.href.login.to")
          link-list-item Login
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'

export default {
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item
  },
  props: ['tournament', 'rounds', 'loading'],
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
    url (...targets) {
      return `/${ this.tournament.name }/${ targets.join('/') }`
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
