<template lang="pug">
  .router-view-content(v-if="!loading")
    section(v-if="!loading").page-header
      h1 {{ round_by_r(r_str).name }}
    section(v-if="!loading && team_allocation_opened && sorted_rows.length > 0")
      el-table(stripe, :data="sorted_rows")
        el-table-column(label="Venue")
          template(slot-scope="scope")
            span {{ venue_by_id(scope.row.venue).name }}
        el-table-column(:label="style.side_labels_short['gov']")
          template(slot-scope="scope")
            span {{ team_by_id(scope.row.teams.gov).name }}
        el-table-column(:label="style.side_labels_short['opp']")
          template(slot-scope="scope")
            span {{ team_by_id(scope.row.teams.opp).name }}
        el-table-column.adjudicator-container(label="Chair", v-if="adjudicator_allocation_opened")
          template(slot-scope="scope")
            .adjudicator(v-for="id in scope.row.chairs") {{ adjudicator_by_id(id).name }}
        el-table-column.adjudicator-container(label="Panel", v-if="adjudicator_allocation_opened")
          template(slot-scope="scope")
            .adjudicator(v-for="id in scope.row.panels") {{ adjudicator_by_id(id).name }}
        el-table-column.adjudicator-container(label="Trainee", v-if="adjudicator_allocation_opened")
          template(slot-scope="scope")
            .adjudicator(v-for="id in scope.row.trainees") {{ adjudicator_by_id(id).name }}
    section(v-else)
      p Draw for {{ round_by_r(r_str).name }} is not released.
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list'
import link_list_item from 'components/link-list-item'

export default {
  props: ['r_str'],
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item
  },
  computed: {
    sorted_rows () {
      let draw = this.draw_by_r(this.r_str)
      return draw ? draw.allocation.slice().sort((a, b) => a.id > b.id ? 1 : -1) : []
    },
    team_allocation_opened () {
      let round = this.round_by_r(this.r_str)
      return round ? round.team_allocation_opened : false
    },
    adjudicator_allocation_opened () {
      let round = this.round_by_r(this.r_str)
      return round ? round.adjudicator_allocation_opened : false
    },
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'team_by_id',
      'adjudicator_by_id',
      'round_by_r',
      'draw_by_r',
      'venue_by_id',
      'style'
    ])
  },
  methods: {
    ...mapActions([
      'init_draws'
    ])
  },
  mounted () {
    this.init_draws()
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
