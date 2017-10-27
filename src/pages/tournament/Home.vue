<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section.page-header
      h1 {{ target_tournament.name }}
    section
      link-list
        router-link(to="audience")
          link-list-item Audience
        router-link(to="debater")
          link-list-item Debaters
        router-link(to="adjudicator")
          link-list-item Judges
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
  computed: {
    has_rounds () {
      return this.target_tournament.rounds && this.target_tournament.rounds.length > 0
    },
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'target_tournament'
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
