<template lang="pug">
  .router-view-content
    section.page-header
      h1 Draw &amp; Allocation
      h3(v-if="!loading") {{ round_by_r(r_str).name }}
    section(v-if="style")
      loading-container(:loading="loading")
        el-table(:data="draw_adjusted.allocation", :row-class-name="row_class", border)
          el-table-column(label="Venue")
            template(scope="scope")
              draggable.adj-list(v-model="scope.row.venues", :options="venue_options")
                .draggable-item(v-for="id in scope.row.venues") {{ venue_by_id(id).name }}
                  el-popover(placement="right", trigger="hover")
                    el-button.details(slot="reference", size="mini") #[el-icon(name="more")]
                    p id: {{ id }}
          el-table-column(v-for="side in ['gov', 'opp']", :key="side", :label="style.side_labels_short[side]")
            template(scope="scope")
              draggable.adj-list(v-model="scope.row.teams[side]", :options="team_options", @start="evt => on_team(evt.oldIndex, scope.row.teams[side])", @end="on_end", @mouseover.native="evt => {test = evt}", @mouseleave.native="test=null")
                .draggable-item(v-for="id in scope.row.teams[side]", :class="{same_institution: team_same_institution(id)}") {{ team_by_id(id).name }}
                  el-popover(placement="right", trigger="hover")
                    el-button.details(slot="reference", size="mini") #[el-icon(name="more")]
                    p id: {{ id }}
                    p institutions: {{ institution_names_by_team_id(id) }}
                    p speakers: {{ speaker_names_by_team_id(id) }}
          el-table-column(v-for="label in ['chairs', 'panels', 'trainees']", :label="capitalize(label)", :key="label")
            template(scope="scope")
              draggable(class="adj-list", v-model="scope.row[label]", :options="adjudicator_options", @start="evt => on_adjudicator(evt.oldIndex, scope.row[label])", @end="on_end")
                .draggable-item(v-for="id in scope.row[label]", :class="{same_institution: adjudicator_same_institution(id)}") {{ adjudicator_by_id(id).name }}
                  el-popover(placement="right", trigger="hover")
                    el-button.details(slot="reference", size="mini") #[el-icon(name="more")]
                    p id: {{ id }}
                    p institutions: {{ institution_names_by_adjudicator_id(id) }}
          el-table-column(v-for="label in ['team', 'adj']", :key="label", :label="{ team: 'Warnings(Team)', adj: 'Warnings(Adj)' }[label]")
            template(scope="scope")
              div(v-for="warning in warn(label, scope.row)", :key="warning.code")
                el-popover(placement="right", width="200", trigger="hover")
                  el-button(type="warning", size="mini", slot="reference")  {{ warning.name }}
                  p code: {{ warning.code }}
                  p message: {{ warning.message }}
                  p details: {{ warning.details }}
        .operations
          el-button(@click="on_reset_draw") Reset
          el-button(@click="dialog.draw.visible = true") Request
          el-button(type="primary", @click="on_send_allocation", :disabled="!sendable") #[el-icon(name="upload")] &nbsp;{{ suggested_action.charAt(0).toUpperCase() + suggested_action.slice(1) }}
          el-button(@click="on_delete_draw", type="danger", :disabled="new_draw") Delete

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

      el-dialog(title="Request Draw", :visible.sync="dialog.draw.visible", v-if="!loading")
        el-tabs(v-model="dialog.draw.allocation_type")
          el-tab-pane(v-for="label in (draw_temp !== null ? ['all', 'teams', 'adjudicators', 'venues'] : ['all', 'teams'])", :label="capitalize(label)", :key="label", :name="label")
            .dialog-body
              h3(v-if="label === 'adjudicators' || label === 'venues'", style="text-align: center;") Request allocation of {{ capitalize(label) }} with existing draw
              el-form(:model="dialog.draw.form.model", :rules="dialog.draw.form.rules")
                el-form-item(label="Shuffle Venue", v-if="label === 'all' || label === 'venues'")
                  el-switch(on-text="", off-text="", v-model="dialog.draw.form.model.venue_allocation_algorithm_options.shuffle")
                el-form-item(label="Simple", prop="simple", v-if="label !== 'venues' || !dialog.draw.form.model.venue_allocation_algorithm_options.shuffle")
                  el-switch(on-text="", off-text="", v-model="dialog.draw.form.model.simple")
                el-form-item(label="Force", prop="force", v-if="label !== 'venues' || !dialog.draw.form.model.venue_allocation_algorithm_options.shuffle")
                  el-switch(on-text="", off-text="", v-model="dialog.draw.form.model.force")
                el-form-item(label="Teaming algorithm", v-if="label === 'all' || label === 'teams'")
                  el-select(v-model="dialog.draw.form.model.team_allocation_algorithm")
                    el-option(v-for="algorithm in ['standard', 'traditional']", :key="algorithm", :value="algorithm", :label="algorithm")
                el-form-item(label="Allocation algorithm", v-if="label === 'all' || label === 'adjudicators'")
                  el-select(v-model="dialog.draw.form.model.adjudicator_allocation_algorithm")
                    el-option(v-for="algorithm in ['standard', 'strict']", :key="algorithm", :value="algorithm", :label="algorithm")
                el-form-item(v-for="sub_label in ['chairs', 'panels', 'trainees']", :key="sub_label", :label="capitalize(sub_label)+' per venue'", v-if="label === 'all' || label === 'adjudicators'")
                  el-input-number(v-model="dialog.draw.form.model.numbers_of_adjudicators[sub_label]", :min="{ chairs: 1, panels: 0, trainees: 0 }[sub_label]")
                el-form-item(label="Considering Rounds")
                  el-checkbox(v-for="round in target_tournament.rounds.slice().sort((r1, r2) => r1.r > r2.r)", :key="round.r", v-model="dialog.draw.considering_rs[round.r]", :checked="round.r < parseInt(r_str, 10)") {{ round.name }}
        .dialog-footer(slot="footer")
          el-button(@click="dialog.draw.visible = false") Cancel
          el-button(type="primary", :loading="dialog.draw.loading", @click="on_request_draw") Send
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
      dialog: {
        draw: {
          allocation_type: 'all',
          visible: false,
          loading: false,
          considering_rs: Array(parseInt(this.r_str, 10)).fill(false),
          form: {
            model: {
              simple: false,
              force: false,
              team_allocation_algorithm: 'standard',
              team_allocation_algorithm_options: {
                avoid_conflict: false,
                method: 'custom',
                weights: [1, 0, 1, 0, 0, 0, 0],
                filters: ['by_strength', 'by_side', 'by_past_opponent', 'by_institution']
              },
              adjudicator_allocation_algorithm: 'standard',
              adjudicator_allocation_algorithm_options: {
                assign: 'high_to_slight'
              },
              numbers_of_adjudicators: {
                chairs: 1,
                panels: 0,
                trainees: 0
              },
              venue_allocation_algorithm_options: {
                shuffle: false
              }
            },
            rules: {}
          }
        }
      },
      new_draw: true,
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
      draw_adjusted: { r: parseInt(this.r_str, 10), allocation: [] },
      teams: [],
      adjudicators: [],
      venues: [],
      draw_temp: null
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
      if (this.new_draw) {
        return 'save'
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
      'style',
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
    on_reset_draw () {
      this.draw_temp = null,
      this.init_allocation()
    },
    async on_delete_draw () {
      const ans = await this.$confirm('Are you sure?')
      if (ans === 'confirm') {
        let payload = {
          tournament: this.target_tournament,
          draw: this.round_by_r(this.r_str)
        }
        this.send_delete_draw(payload).then(() => {
          this.draw_temp = null
          this.new_draw = true
          this.init_allocation()
        })
      }
    },
    capitalize: math.capitalize,
    ...mapActions([
      'request_draw',
      'submit_draw',
      'update_draw',
      'init_all',
      'send_delete_draw'
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
      if (square.teams.gov.length !== 1 || square.teams.opp.length !== 1) {
        return false
      } else if (square.venues.length > 1) {
        return false
      } else {
        return true
      }
    },
    warn (label, square) {
      let warnings = []
      let check_funcs = {
        team: [this.check_institutions],
        adj: [this.check_conflicts]
      }
      for (let check_func of check_funcs[label]) {
        let warning = check_func(square)
        if (warning !== null) {
          warnings.push(warning)
        }
      }
      return warnings
    },
    check_institutions (square) {
      let t0_insti = square.teams.gov.length === 0 ? [] : this.details_1(this.team_by_id(square.teams.gov)).institutions
      let t1_insti = square.teams.opp.length === 0 ? [] : this.details_1(this.team_by_id(square.teams.opp)).institutions
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
    check_conflicts (square) {
      let t0_insti = square.teams.gov.length === 0 ? [] : this.details_1(this.team_by_id(square.teams.gov)).institutions
      let t1_insti = square.teams.opp.length === 0 ? [] : this.details_1(this.team_by_id(square.teams.opp)).institutions
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
        r: parseInt(this.r_str, 10),
        allocation: []
      }
      for (let raw_square of this.draw_adjusted.allocation) {
        let square = {
          venue: raw_square.venues[0],
          teams: {
            gov: raw_square.teams.gov[0],
            opp: raw_square.teams.opp[0]
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
      this.dialog.draw.visible = false
      this.dialog.draw.loading = true
      let tournament = this.target_tournament
      let model = this.dialog.draw.form.model
      let allocation_type = this.dialog.draw.allocation_type
      let options = {}
      let draw = {}
      if (allocation_type === 'all') {
        options = model
      } else if (allocation_type === 'teams') {
        options = {
          simple: model.simple,
          force: model.force,
          algorithm: model.team_allocation_algorithm,
          algorithm_options: model.team_allocation_algorithm_options,
        }
      } else if (allocation_type === 'adjudicators') {
        draw = this.draw_temp
        options = {
          simple: model.simple,
          force: model.force,
          algorithm: model.adjudicator_allocation_algorithm,
          algorithm_options: model.adjudicator_allocation_algorithm_options,
          numbers_of_adjudicators: model.numbers_of_adjudicators
        }
      } else {
        draw = this.draw_temp
        options = {
          simple: model.simple,
          force: model.force,
          shuffle: model.venue_allocation_algorithm_options.shuffle
        }
      }
      options.by = Object.keys(this.dialog.draw.considering_rs).filter(key => this.dialog.draw.considering_rs[key]).map(key => parseInt(key, 10))
      return this.request_draw({ tournament, r_str: this.r_str, options, draw, allocation_type }).then((data) => {
        this.draw_temp = data
        this.init_allocation()
        this.dialog.draw.loading = false
      }).catch(() => {
        this.dialog.draw.loading = false
      })
    },
    on_send_allocation () {
      let tournament = this.target_tournament
      let draw = this.convert_to_draw()
      let action = this.suggested_action
      let actions = {
        'update': this.update_draw,
        'save': this.submit_draw
      }
      return actions[action]({ tournament, draw }).then(() => { this.new_draw = false })
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
        teams_in_draw = teams_in_draw.concat(square.teams.gov).concat(square.teams.opp)
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
        let draw = {}
        let tournament = this.target_tournament
        this.draw_adjusted.allocation = []
        let no_draw = true

        if (this.draw_temp !== null) {
            draw = this.draw_temp
            no_draw = false
        } else if (this.draw_by_r(this.r_str) !== undefined) {
            draw = this.draw_by_r(this.r_str)
            this.draw_temp = draw
            no_draw = false
        }

        if (no_draw) {
            for (let square of Array(Math.floor(tournament.teams.length/2))) {
                this.draw_adjusted.allocation.push({
                    venues: [],
                    teams: {
                        gov: [],
                        opp: []
                    },
                    chairs: [],
                    panels: [],
                    trainees: []
                })
            }
        } else {
            for (let square of draw.allocation) {
                this.draw_adjusted.allocation.push({
                    venues: square.venue === null ? [] : [square.venue],
                    teams: {
                        gov: [square.teams.gov],
                        opp: [square.teams.opp]
                    },
                    chairs: square.chairs,
                    panels: square.panels,
                    trainees: square.trainees
                })
            }
        }

        this.venues = tournament.venues.map(v => v.id).filter(id => !this.venues_in_draw().includes(id))
        this.adjudicators = tournament.adjudicators.map(a => a.id).filter(id => !this.adjudicators_in_draw().includes(id))
        this.teams = tournament.teams.map(t => t.id).filter(id => !this.teams_in_draw().includes(id))
    }
  },
  mounted () {
    this.init_all().then(() => {
      this.new_draw = this.draw_by_r(this.r_str) === undefined ? true : false
      this.init_allocation()
    })
  }
}
</script>

<style lang="stylus">
  @import '../../draggable'
  @import "../../common"

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
