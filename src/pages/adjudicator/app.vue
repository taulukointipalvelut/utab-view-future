<template lang="pug">
  #app-content
    utab-header(icon="arrow-left", icon_href="/", :login="login", base_url="./", :tournament="tournament")
    main
      h1 Adjudicators
      link-list(v-for="round in rounds", :key="round")
        legend(slot="legend") {{ round.name }}
        link-list-item(:href="url('draw.html', round.name)") Draw &amp; Allocation
        link-list-item(:href="url('ballot/index.html', round.name)") Score Sheet
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
      }]
    }
  },
  methods: {
    url (target, query) {
      return `${ target }?round=${ query }&prev=adjudicator.html`
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
