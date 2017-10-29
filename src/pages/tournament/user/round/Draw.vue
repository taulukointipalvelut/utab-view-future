<template lang="pug">
  .router-view-content(v-if="!loading")
    section(v-if="!loading").page-header
      h1 {{ target_round.name }}
      h3(v-if="draw_time && draw_time.updated") {{ draw_time.text }}
    section(v-if="!loading && team_allocation_opened && sorted_rows.length > 0")
      el-table.draw(stripe, :data="sorted_rows")
        el-table-column(label="Venue")
          template(slot-scope="scope")
            .venue {{ entity_name_by_id(scope.row.venue) }}
        el-table-column(:label="smartphone ? style.side_labels_short['gov'] : style.side_labels['gov']")
          template(slot-scope="scope")
            .team-gov {{ entity_name_by_id(scope.row.teams.gov) }}
        el-table-column(:label="smartphone ? style.side_labels_short['opp'] : style.side_labels['opp']")
          template(slot-scope="scope")
            .team-opp {{ entity_name_by_id(scope.row.teams.opp) }}
        el-table-column.adjudicator-container(label="Chair", v-if="adjudicator_allocation_opened")
          template(slot-scope="scope")
            .adjudicator(v-for="id in scope.row.chairs") {{ entity_name_by_id(id) }}
        el-table-column.adjudicator-container(label="Panel", v-if="adjudicator_allocation_opened")
          template(slot-scope="scope")
            .adjudicator(v-for="id in scope.row.panels") {{ entity_name_by_id(id) }}
        el-table-column.adjudicator-container(label="Trainee", v-if="adjudicator_allocation_opened")
          template(slot-scope="scope")
            .adjudicator(v-for="id in scope.row.trainees") {{ entity_name_by_id(id) }}
    section(v-else)
      p Draw for {{ target_round.name }} is not released.
</template>

<script>
import { smartphone } from 'assets/js/media-query.js'
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
      let draw = this.target_draw
      return draw ? draw.allocation.slice()
        .sort((a, b) => this.entity_name_by_id(a.venue).localeCompare(this.entity_name_by_id(b.venue))) : []
    },
    smartphone: smartphone,
    team_allocation_opened () {
      let round = this.target_round
      return round ? round.user_defined_data.team_allocation_opened : false
    },
    adjudicator_allocation_opened () {
      let round = this.target_round
      return round ? round.user_defined_data.adjudicator_allocation_opened : false
    },
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'entity_name_by_id',
      'target_round',
      'target_draw',
      'draw_time',
      'style',
      'target_tournament',
      'entity_name_by_id'
    ])
  },
  methods: {
    ...mapActions([
      'init_one'
    ])
  },
  mounted () {
    //this.init_draws({ tournament: this.target_tournament })
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

<style lang="stylus" scoped>
  //.draw
  //  font-size 1rem

    .venue
      align center

    .team-gov
      align right

    .team-opp
      align left

    .adjudicator-container
      display flex
      flex-flow column wrap

    .adjudicator
      flex 1
</style>
