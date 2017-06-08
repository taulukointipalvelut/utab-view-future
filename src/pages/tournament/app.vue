<template lang="pug">
  #app-content
    utab-header(icon="arrow-left", icon_href="/", :login="login", base_url="./", :tournament="tournament")
    main
      h1 {{ tournament.name }}
      link-list
        link-list-item(href="audience.html") Audience
        link-list-item(href="debater.html") Debaters
        link-list-item(href="adjudicator.html") Adjudicators
      link-list
        legend(slot="legend") Rounds
        link-list-item(v-for="round in rounds", :key="round", :href="url('round.html', round.name)") {{ round.name }}
      link-list
        legend(slot="legend") Admin
        link-list-item(href="login.html") Login
</template>

<script>
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
      login: false,
      tournament: {
        name: 'PDA Tournament 2018',
        href: 'tournament.html'
      },
      rounds: [{
        name: 'Round 1',
        href: 'round.html?round=Round%201'
      }, {
        name: 'Round 2',
        href: 'round.html?round=Round%202'
      }]
    }
  },
  methods: {
    url (target, query) {
      return `${ target }?round=${ query }`
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
