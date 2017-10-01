<template lang="pug">
  .router-view-content(v-if="!loading")
    section.page-header
      h1 {{ round_by_r(r_str).name }}
    section
      link-list
        legend(slot="legend") Audience
        router-link(to="draw")
          link-list-item Draw &amp; Allocation
      link-list
        legend(slot="legend") Debaters
        router-link(to="evaluation")
          link-list-item Judge Evaluation Sheet
      link-list
        legend(slot="legend") Adjudicators
        router-link(to="ballot")
          link-list-item Score Sheet
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list'
import link_list_item from 'components/link-list-item'

export default {
  props: ['r_str', 'loading'],
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item
  },
  data () {
    return {}
  },
  computed: {
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'isAuth',
      'round_by_r'
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
