<template lang="pug">
  .router-view-content(v-if="!loading")
    section.page-header
      h1 {{ current_round.round_name }}
      h3 Ctrl + Scroll to change scale
    section(v-if="draw_opened")
      el-table(stripe, :data="sorted_rows")
        el-table-column(label="Venue", prop="venue")
        el-table-column(label="Gov", prop="gov.name")
        el-table-column(label="Opp", prop="opp.name")
        el-table-column.adjudicator-container(label="Chair", v-if="allocation_opened")
          template(scope="scope")
            .adjudicator(v-for="adjudicator in scope.row.chairs") {{ adjudicator.name }}
        el-table-column.adjudicator-container(label="Panel", v-if="allocation_opened")
          template(scope="scope")
            .adjudicator(v-for="adjudicator in scope.row.panels") {{ adjudicator.name }}
        el-table-column.adjudicator-container(label="Trainee", v-if="allocation_opened")
          template(scope="scope")
            .adjudicator(v-for="adjudicator in scope.row.trainees") {{ scope.row.trainees.length }}
    section(v-else)
      p Draw for {{ current_round }} is not released.
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list'
import link_list_item from 'components/link-list-item'

export default {
  props: ['tournament', 'loading'],
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item
  },
  data () {
    return {}
  },
  computed: {
    current_round () {
      return this.tournament.rounds.find(round => round.r === this.tournament.current_round_num)
    },
    sorted_rows () {
      return this.tournament.draws.find(d => d.r === this.tournament.current_round_num).allocation
        .slice().sort((a, b) => a.venue.localeCompare(b.venue))
    },
    draw_opened () {
      let current_round = this.tournament.rounds.find(round => round.r === this.tournament.current_round_num)
      return current_round.draw_opened
    },
    allocation_opened () {
      let current_round = this.tournament.rounds.find(round => round.r === this.tournament.current_round_num)
      return current_round.allocation_opened
    },
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'isAuth'
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

<style lang="stylus" scoped>
  .adjudicator-container
    display flex
    flex-flow column wrap

  .adjudicator
    flex 1
</style>
