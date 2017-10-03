<template lang="pug">
  .router-view-content
    section.page-header
      h1 Allocation
      h3(v-if="!loading") {{ round_by_r(r_str).name }}
    section
      loading-container(:loading="loading")
        el-table(:data="draw_adjusted.allocation", :row-class-name="row_class", border)
          el-table-column(label="Venue")
            template(scope="scope")
              draggable.adj-list(v-model="scope.row.venues", :options="venue_options")
                .draggable-item(v-for="id in scope.row.venues") {{ venue_by_id(id).name }}
                  el-popover(placement="right", trigger="hover")
                    el-button.details(slot="reference", size="mini") #[el-icon(name="more")]
                    p id: {{ id }}
          el-table-column(label="Gov")
            template(scope="scope")
              draggable.adj-list(v-model="scope.row.teams.og", :options="team_options", @start="evt => on_team(evt.oldIndex, scope.row.teams.og)", @end="on_end", @mouseover.native="evt => {test = evt}", @mouseleave.native="test=null")
                .draggable-item(v-for="id in scope.row.teams.og", :class="{same_institution: team_same_institution(id)}") {{ team_by_id(id).name }}
                  el-popover(placement="right", trigger="hover")
                    el-button.details(slot="reference", size="mini") #[el-icon(name="more")]
                    p id: {{ id }}
                    p institutions: {{ institution_names_by_team_id(id) }}
                    p speakers: {{ speaker_names_by_team_id(id) }}
          el-table-column(label="Opp")
            template(scope="scope")
              draggable.adj-list(v-model="scope.row.teams.oo", :options="team_options", @start="evt => on_team(evt.oldIndex, scope.row.teams.oo)", @end="on_end")
                .draggable-item(v-for="id in scope.row.teams.oo", :class="{same_institution: team_same_institution(id)}") {{ team_by_id(id).name }}
                  el-popover(placement="right", trigger="hover")
                    el-button.details(slot="reference", size="mini") #[el-icon(name="more")]
                    p id: {{ id }}
                    p institutions: {{ institution_names_by_team_id(id) }}
                    p speakers: {{ speaker_names_by_team_id(id) }}
          el-table-column(label="Chairs")
            template(scope="scope")
              draggable.adj-list.chair(v-model="scope.row.chairs", :options="adjudicator_options", @start="evt => on_adjudicator(evt.oldIndex, scope.row.chairs)", @end="on_end")
                .draggable-item(v-for="id in scope.row.chairs", :class="{same_institution: adjudicator_same_institution(id)}") {{ adjudicator_by_id(id).name }}
                  el-popover(placement="right", trigger="hover")
                    el-button.details(slot="reference", size="mini") #[el-icon(name="more")]
                    p id: {{ id }}
                    p institutions: {{ institution_names_by_adjudicator_id(id) }}
          el-table-column(label="Panels")
            template(scope="scope")
              draggable.adj-list.panel(v-model="scope.row.panels", :options="adjudicator_options", @start="evt => on_adjudicator(evt.oldIndex, scope.row.panels)", @end="on_end")
                .draggable-item(v-for="id in scope.row.panels", :class="{same_institution: adjudicator_same_institution(id)}") {{ adjudicator_by_id(id).name }}
                  el-popover(placement="right", trigger="hover")
                    el-button.details(slot="reference", size="mini") #[el-icon(name="more")]
                    p id: {{ id }}
                    p institutions: {{ institution_names_by_adjudicator_id(id) }}
          el-table-column(label="Trainees")
            template(scope="scope")
              draggable.adj-list.trainee(v-model="scope.row.trainees", :options="adjudicator_options", @start="evt => on_adjudicator(evt.oldIndex, scope.row.trainees)", @end="on_end")
                .draggable-item(v-for="id in scope.row.trainees", :class="{same_institution: adjudicator_same_institution(id)}") {{ adjudicator_by_id(id).name }}
                  el-popover(placement="right", trigger="hover")
                    el-button.details(slot="reference", size="mini") #[el-icon(name="more")]
                    p id: {{ id }}
                    p institutions: {{ institution_names_by_adjudicator_id(id) }}
          el-table-column(label="Warnings")
            template(scope="scope")
              div(v-for="warning in warn(scope.row)", :key="warning.code")
                el-popover(placement="right", width="200", trigger="hover")
                  el-button(type="warning", size="mini", slot="reference")  {{ warning.name }}
                  p code: {{ warning.code }}
                  p message: {{ warning.message }}
                  p details: {{ warning.details }}
        .operations
          el-button(@click="on_request_draw") Request
          el-button(type="primary", @click="on_send_allocation", :disabled="!sendable") #[el-icon(name="upload")] &nbsp;{{ suggested_action.charAt(0).toUpperCase() + suggested_action.slice(1) }}

    legend Waiting Adjudicators
    loading-container(:loading="loading")
      section.adj-list-container
        draggable.adj-list.src(v-model="adjudicators", :options="adjudicator_options", @start="evt => on_adjudicator(evt.oldIndex, adjudicators)", @end="on_end")
          .draggable-item(v-for="id in adjudicators", :class="{same_institution: adjudicator_same_institution(id)}") {{ adjudicator_by_id(id).name }}
            el-popover(placement="right", trigger="hover")
              el-button.details(slot="reference", size="mini") #[el-icon(name="more")]
              p id: {{ id }}
              p institutions: {{ institution_names_by_adjudicator_id(id) }}
    legend Waiting Teams
    loading-container(:loading="loading")
      section.adj-list-container
        draggable.adj-list.src(v-model="teams", :options="team_options", @start="evt => on_team(evt.oldIndex, teams)", @end="on_end")
          .draggable-item(v-for="id in teams", :class="{same_institution: team_same_institution(id)}") {{ team_by_id(id).name }}
            el-popover(placement="right", trigger="hover")
              el-button.details(slot="reference", size="mini") #[el-icon(name="more")]
              p id: {{ id }}
              p institutions: {{ institution_names_by_team_id(id) }}
              p speakers: {{ speaker_names_by_team_id(id) }}
    legend Waiting Venues
    loading-container(:loading="loading")
      section.adj-list-container
        draggable.adj-list.src(v-model="venues", :options="venue_options")
          .draggable-item(v-for="id in venues") {{ venue_by_id(id).name }}
            el-popover(placement="right", trigger="hover")
              el-button.details(slot="reference", size="mini") #[el-icon(name="more")]
              p id: {{ id }}
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import utab_header from 'components/utab-header.vue'
import loading_container from 'components/loading-container.vue'
import draggable from 'vuedraggable'
import math from 'assets/js/math.js'

export default {
  components: {
    'utab-header': utab_header,
    'draggable': draggable,
    'loading-container': loading_container
  },
  props: ['r_str'],
  data () {
    return {
      new: true,
      active_institutions: [],
      team_options: {
        group: { name: 'team-list' },
        animation: 100
      },
      adjudicator_options: {
        group: { name: 'adjudicator-list' },
        animation: 100
      },
      venue_options: {
        group: { name: 'venue-list' },
        animation: 100
      },
      draw_adjusted: { r: parseInt(this.r_str), allocation: [] },
      teams: [],
      adjudicators: [],
      venues: []
    }
  },
  computed: {
    sendable () {
      if (this.draw_adjusted.allocation.length === 0) {
        return false
      }
      for (let square of this.draw_adjusted.allocation) {
        if (!this.square_sendable(square)) {
          return false
        }
      }
      return true
    },
    loading_tournaments () {
      return !this.tournaments
    },
    icon_href () {
      return this.tournament ? this.tournament.href : { to: '/home' }
    },
    suggested_action () {
      if (this.new) {
        return 'submit'
      } else {
        return 'update'
      }
    },
    ...mapState([
      'auth',
      'tournaments',
      'loading'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament',
      'team_by_id',
      'adjudicator_by_id',
      'venue_by_id',
      'institution_by_id',
      'speaker_by_id',
      'round_by_r',
      'draw_by_r',
      'details_1'
    ])
  },
  methods: {
    ...mapActions([
      'request_draw',
      'submit_draw',
      'update_draw',
      'init_all'
    ]),
    team_same_institution (id) {
      return !math.disjoint(this.details_1(this.team_by_id(id)).institutions, this.active_institutions)
    },
    adjudicator_same_institution (id) {
      return !math.disjoint(this.details_1(this.adjudicator_by_id(id)).institutions, this.active_institutions)
    },
    on_team (index, teams) {
      this.active_institutions = this.details_1(this.team_by_id(teams[index])).institutions
    },
    on_adjudicator (index, adjudicators) {
      this.active_institutions = this.details_1(this.adjudicator_by_id(adjudicators[index])).institutions
    },
    on_end () {
      this.active_institutions = []
    },
    speaker_names_by_team_id (id) {
      return this.details_1(this.team_by_id(id))
        .speakers.map(this.speaker_by_id).map(s => s.name).join(', ')
    },
    institution_names_by_team_id (id) {
      return this.details_1(this.team_by_id(id)).institutions
        .map(this.institution_by_id).map(i => i.name).join(', ')
    },
    institution_names_by_adjudicator_id (id) {
      return this.details_1(this.adjudicator_by_id(id)).institutions
        .map(this.institution_by_id).map(i => i.name).join(', ')
    },
    row_class(row, index) {
      if (this.square_sendable(row)) {
        return 'sendable'
      } else {
        return 'unsendable'
      }
    },
    square_sendable (square) {
      if (square.teams.og.length !== 1 || square.teams.oo.length !== 1) {
        return false
      } else if (square.venues.length !== 1 || square.chairs.length === 0) {
        return false
      } else {
        return true
      }
    },
    warn (square) {
      let warnings = []
      let warn_funcs = [this.warn_institutions, this.warn_conflicts]
      for (let warn_func of warn_funcs) {
        let warning = warn_func(square)
        if (warning !== null) {
          warnings.push(warning)
        }
      }
      return warnings
    },
    warn_institutions (square) {
      let t0_insti = square.teams.og.length === 0 ? [] : this.details_1(this.team_by_id(square.teams.og)).institutions
      let t1_insti = square.teams.oo.length === 0 ? [] : this.details_1(this.team_by_id(square.teams.oo)).institutions
      if (!math.disjoint(t0_insti, t1_insti)) {
        return {
          code: 600,
          name: 'institution',
          message: 'Team institution conflict',
          details: {
            dup_institutions: math.common(t0_insti, t1_insti)
          }
        }
      } else {
        return null
      }
    },
    warn_conflicts (square) {
      let t0_insti = square.teams.og.length === 0 ? [] : this.details_1(this.team_by_id(square.teams.og)).institutions
      let t1_insti = square.teams.oo.length === 0 ? [] : this.details_1(this.team_by_id(square.teams.oo)).institutions
      let adj_insti = Array.prototype.concat.apply(
                        [],
                        square.chairs.concat(square.panels).concat(square.trainees).map(this.adjudicator_by_id)
                          .map(adj => adj.institutions))
      if (!math.disjoint(t0_insti, adj_insti) || !math.disjoint(t1_insti, adj_insti)) {
        return {
          code: 600,
          name: 'conflict',
          message: 'Adjudicator conflict',
          details: {
            dup_institutions0: math.common(t0_insti, adj_insti),
            dup_institutions1: math.common(t1_insti, adj_insti)
          }
        }
      } else {
        return null
      }
    },
    convert_to_draw () {
      let draw = {
        r: parseInt(this.r_str),
        allocation: []
      }
      for (let raw_square of this.draw_adjusted.allocation) {
        let square = {
          venue: raw_square.venues[0],
          teams: {
            og: raw_square.teams.og[0],
            oo: raw_square.teams.oo[0]
          },
          chairs: raw_square.chairs,
          panels: raw_square.panels,
          trainees: raw_square.trainees
        }
        draw.allocation.push(square)
      }
      return draw
    },
    on_request_draw () {
      let tournament = this.target_tournament
      return this.request_draw({ tournament, r_str: this.r_str }).then(() => {
        this.init_allocation()
      })
    },
    on_send_allocation () {
      let tournament = this.target_tournament
      let draw = this.convert_to_draw()
      let action = this.suggested_action
      let actions = {
        'update': this.update_draw,
        'submit': this.submit_draw
      }
      return actions[action]({ tournament, draw }).then(() => { this.new = false })
    },
    adjudicators_in_draw () {
      let adjudicators_in_draw = []
      for (let square of this.draw_adjusted.allocation) {
        adjudicators_in_draw = adjudicators_in_draw.concat(square.chairs).concat(square.panels).concat(square.trainees)
      }
      return adjudicators_in_draw
    },
    teams_in_draw () {
      let teams_in_draw = []
      for (let square of this.draw_adjusted.allocation) {
        teams_in_draw = teams_in_draw.concat(square.teams.og).concat(square.teams.oo)
      }
      return teams_in_draw
    },
    venues_in_draw () {
      let venues_in_draw = []
      for (let square of this.draw_adjusted.allocation) {
        venues_in_draw = venues_in_draw.concat(square.venues)
      }
      return venues_in_draw
    },
    init_allocation () {
        let draw = this.draw_by_r(this.r_str)
        let tournament = this.target_tournament
        this.draw_adjusted.allocation = []
        if (draw !== undefined ) {
            for (let square of draw.allocation) {
                this.draw_adjusted.allocation.push({
                    venues: [square.venue],
                    teams: {
                        og: [square.teams.og],
                        oo: [square.teams.oo]
                    },
                    chairs: square.chairs,
                    panels: square.panels,
                    trainees: square.trainees
                })
            }
        } else {
            for (let square of Array(Math.floor(tournament.teams.length/2))) {
                this.draw_adjusted.allocation.push({
                    venues: [],
                    teams: {
                        og: [],
                        oo: []
                    },
                    chairs: [],
                    panels: [],
                    trainees: []
                })
            }
        }
        this.venues = tournament.venues.map(v => v.id).filter(id => !this.venues_in_draw().includes(id))
        this.adjudicators = tournament.adjudicators.map(a => a.id).filter(id => !this.adjudicators_in_draw().includes(id))
        this.teams = tournament.teams.map(t => t.id).filter(id => !this.teams_in_draw().includes(id))
    }
  },
  mounted () {
    if (!this.isAuth) {
      this.$router.replace({ path: this.auth.href.login.to, query: { next: this.$route.fullPath } })
    }
    this.init_all().then(() => {
      this.new = this.draw_by_r(this.r_str) === undefined ? true : false
      this.init_allocation()
    })
  }
}
</script>

<style lang="stylus">
  @import '../../draggable'

  .operations
    display flex
    justify-content flex-end
    margin-top 1rem

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

  .same_institution
    border-color lightgreen

  .el-table .unsendable
    background #ff5e62
    transition all 1.5s

  .el-table .sendable
    background #ffffff
    transition all 1.5s

  .details
    border none

  .el-table .cell
    padding 0

  .el-table .col-cell,
  .el-table th .cell
    padding 0 18px

  .adj-list
    margin 5px
    min-height 30px
    min-width 20%

  .adj-list-container
    width calc(100% - .5rem)
    background rgba(0, 0, 0, .05)
    padding-left .5rem
    padding-bottom .5rem
    min-height 50px

    .adj-list.src
      display flex
      flex-flow row wrap
      margin 0

      .draggable-item
        margin-right .5rem
</style>
