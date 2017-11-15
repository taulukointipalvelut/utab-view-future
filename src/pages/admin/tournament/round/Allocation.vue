<template lang="pug">
  .router-view-content
    .allocation-content
      section.page-header
        h1 Draw &amp; Allocation
        h3 {{ target_round.name }} #[span(v-if="draw_time && draw_time.updated") , {{ draw_time.text }}]
      section
        el-table.allocation-table(:data="draw_adjusted.allocation", :row-class-name="row_class", border, empty-text="Need More Teams")
          el-table-column(label="Venue", align="center")
            template(slot-scope="scope")
              draggable.adj-list(v-model="scope.row.venues", :options="venue_options")
                .draggable-item(v-for="id in scope.row.venues", :class="warn_item_venue(id)")
                  el-popover(:open-delay="500", placement="right", trigger="click")
                    el-button.detail-button(slot="reference", @mouseover.native="selected_venue = id", @mouseout.native="selected_venue = null") {{ entity_name_by_id(id) }}
                    lazy-item
                      div(v-if="entity_accessible(id)")
                        p id: {{ id }}
                        p priority: {{ access_detail(entity_by_id[id], r_str).priority }}
          el-table-column(v-for="side in ['gov', 'opp']", :key="side", :label="style.side_labels[side]", align="center")
            template(slot-scope="scope")
              draggable.adj-list(v-model="scope.row.teams[side]", :options="team_options")
                .draggable-item(v-for="id in scope.row.teams[side]", :class="warn_item_team(id, side)")
                  el-popover(:open-delay="500", placement="right", trigger="click")
                    el-button.detail-button(slot="reference", @mouseover.native="selected_team = id", @mouseout.native="selected_team = null") {{ entity_name_by_id(id) }}
                    lazy-item
                      div(v-if="team_accessible(id)")
                        p ranking: {{ compiled_team_result_by_id[id].ranking }}
                        p win: {{ compiled_team_result_by_id[id].win }}
                        p sum: {{ compiled_team_result_by_id[id].sum }}
                        p margin: {{ compiled_team_result_by_id[id].margin }}
                        p institutions: {{ institution_names_by_team_id(id) }}
                        p opponents: {{ compiled_team_result_by_id[id].past_opponents.map(entity_name_by_id).join(', ') }}
                        p sides: {{ compiled_team_result_by_id[id].past_sides.join(', ') }}
                        p speakers: {{ speaker_names_by_team_id(id) }}
                        p id: {{ id }}
          el-table-column(v-for="label in ['chairs', 'panels', 'trainees']", :label="capitalize(label)", :key="label", align="center")
            template(slot-scope="scope")
              draggable.adj-list(v-model="scope.row[label]", :options="adjudicator_options")
                .draggable-item(v-for="id in scope.row[label]", :class="warn_item_adjudicator(id)")
                  el-popover(:open-delay="500", placement="right", trigger="click")
                    el-button.detail-button(slot="reference", @mouseover.native="selected_adjudicator = id", @mouseout.native="selected_adjudicator = null") {{ entity_name_by_id(id) }}
                    lazy-item
                      div(v-if="adjudicator_accessible(id)")
                        p ranking: {{ compiled_adjudicator_result_by_id[id].ranking }}
                        p average: {{ compiled_adjudicator_result_by_id[id].average }}
                        p conflicts: {{ conflict_names_by_adjudicator_id(id) }}
                        p institutions: {{ institution_names_by_adjudicator_id(id) }}
                        p judged_teams: {{ compiled_adjudicator_result_by_id[id].judged_teams.map(entity_name_by_id).join(', ') }}
                        p judged: {{ compiled_adjudicator_result_by_id[id].num_experienced }}
                        p judged as chair: {{ compiled_adjudicator_result_by_id[id].num_experienced_chair }}
                        p id: {{ id }}
          el-table-column(label="Warnings", align="center")
            el-table-column(label="Draw", align="center")
              template(slot-scope="scope")
                div(v-for="warning in warn_square_teams(scope.row)", :key="warning.name", @mouseover="selected_warning = warning", @mouseout="selected_warning = null")
                  el-popover(placement="right", width="200", trigger="click")
                    el-button.warning-button(type="warning", size="mini", slot="reference")  {{ warning.name }}
                    p {{ warning.message }}
                    p(v-if="warning.teams.length > 0") teams: {{ warning.teams.map(entity_name_by_id).join(', ') }}
            el-table-column(label="Alloc", align="center")
              template(slot-scope="scope")
                div(v-for="warning in warn_square_adjudicators(scope.row)", :key="warning.name", @mouseover="selected_warning = warning", @mouseout="selected_warning = null")
                  el-popover(placement="right", width="200", trigger="click")
                    el-button.warning-button(type="warning", size="mini", slot="reference")  {{ warning.name }}
                    p {{ warning.message }}
                    p(v-if="warning.teams.length > 0") teams: {{ warning.teams.map(entity_name_by_id).join(', ') }}
                    p(v-if="warning.adjudicators.length > 0") adjudicators: {{ warning.adjudicators.map(entity_name_by_id).join(', ') }}
        .operations
          el-button(@click="on_fix_draw", v-if="need_fix") Remove Unavailables
          el-button(@click="on_reset_draw") Reset
          el-button(@click="on_edit_request") Request
          el-button(type="primary", @click="on_send_allocation", :disabled="!sendable", :loading="submit_loading") #[el-icon(name="upload")] &nbsp;{{ suggested_action.charAt(0).toUpperCase() + suggested_action.slice(1) }}
          el-button(@click="on_delete_draw", type="danger", :disabled="new_draw", :loading="delete_loading") Delete
        legend Legend
          el-row(:gutter="10", justify="space-between", style="width: 100%;")
            el-col(v-for="class_label in Object.keys(warning_classes)", :key="class_label", :span="5")
              div.legend-content(:class="warning_classes[class_label]", @mouseover="")
                span {{ class_label }}
    .page-footer
      legend Waiting Adjudicators
      .adj-list-container
        draggable.adj-list.src(v-model="adjudicators", :options="adjudicator_options")
          .draggable-item(v-for="id in adjudicators", :class="warn_item_adjudicator(id)")
            el-popover(:open-delay="500", placement="right", trigger="click")
              el-button.detail-button(slot="reference", @mouseover.native="selected_adjudicator = id", @mouseout.native="selected_adjudicator = null") {{ entity_name_by_id(id) }}
              lazy-item
                div(v-if="adjudicator_accessible(id)")
                  p ranking: {{ compiled_adjudicator_result_by_id[id].ranking }}
                  p average: {{ compiled_adjudicator_result_by_id[id].average }}
                  p conflicts: {{ conflict_names_by_adjudicator_id(id) }}
                  p institutions: {{ institution_names_by_adjudicator_id(id) }}
                  p judged_teams: {{ compiled_adjudicator_result_by_id[id].judged_teams.map(entity_name_by_id).join(', ') }}
                  p judged: {{ compiled_adjudicator_result_by_id[id].num_experienced }}
                  p judged as chair: {{ compiled_adjudicator_result_by_id[id].num_experienced_chair }}
                  p id: {{ id }}
      legend Waiting Teams
      .adj-list-container
        draggable.adj-list.src(v-model="teams", :options="team_options")
          .draggable-item(v-for="id in teams", :class="warn_item_team(id, '')")
            el-popover(:open-delay="500", placement="right", trigger="click")
              el-button.detail-button(slot="reference", @mouseover.native="selected_team = id", @mouseout.native="selected_team = null") {{ entity_name_by_id(id) }}
              lazy-item
                div(v-if="team_accessible(id)")
                  p ranking: {{ compiled_team_result_by_id[id].ranking }}
                  p win: {{ compiled_team_result_by_id[id].win }}
                  p sum: {{ compiled_team_result_by_id[id].sum }}
                  p margin: {{ compiled_team_result_by_id[id].margin }}
                  p institutions: {{ institution_names_by_team_id(id) }}
                  p opponents: {{ compiled_team_result_by_id[id].past_opponents.map(entity_name_by_id).join(', ') }}
                  p sides: {{ compiled_team_result_by_id[id].past_sides.join(', ') }}
                  p speakers: {{ speaker_names_by_team_id(id) }}
                  p id: {{ id }}
      legend Waiting Venues
      .adj-list-container
        draggable.adj-list.src(v-model="venues", :options="venue_options")
          .draggable-item(v-for="id in venues", :class="warn_item_venue(id)")
            el-popover(:open-delay="500", placement="right", trigger="click")
              el-button.detail-button(slot="reference", @mouseover.native="selected_venue = id", @mouseout.native="selected_venue = null") {{ entity_name_by_id(id) }}
              lazy-item
                div(v-if="entity_accessible(id)")
                  p id: {{ id }}
                  p priority: {{ access_detail(entity_by_id[id], r_str).priority }}

    el-dialog(title="Request Draw", :visible.sync="dialog.draw.visible")
      el-tabs(v-model="dialog.draw.allocation_type")
        el-tab-pane(v-for="label in (draw_temp !== null ? ['all', 'teams', 'adjudicators', 'venues'] : ['all', 'teams'])", :label="capitalize(label)", :key="label", :name="label")
          .dialog-body
            h3(v-if="label === 'adjudicators' || label === 'venues'", style="text-align: center;") Request allocation of {{ capitalize(label) }} with existing draw
            el-form(:model="dialog.draw.form.model", :rules="dialog.draw.form.rules")
              el-form-item(label="Shuffle Venue", v-if="label === 'all' || label === 'venues'")
                el-switch(active-text="", inactive-text="", v-model="dialog.draw.form.model.shuffle")
              //el-form-item(label="Simple", prop="simple")
                el-switch(active-text="", inactive-text="", v-model="dialog.draw.form.model.simple", :disabled="label === 'venues' && dialog.draw.form.model.shuffle")
              el-form-item(label="Force", prop="force")
                el-switch(active-text="", inactive-text="", v-model="dialog.draw.form.model.force", :disabled="label === 'venues' && dialog.draw.form.model.shuffle")
              el-form-item(label="Teaming algorithm", v-if="label === 'all' || label === 'teams'")
                el-select(v-model="dialog.draw.form.model.team_allocation_algorithm")
                  el-option(v-for="algorithm in ['standard', 'strict']", :key="algorithm", :value="algorithm", :label="algorithm")
              el-form-item(label="Allocation algorithm", v-if="label === 'all' || label === 'adjudicators'")
                el-select(v-model="dialog.draw.form.model.adjudicator_allocation_algorithm")
                  el-option(v-for="algorithm in ['standard', 'traditional']", :key="algorithm", :value="algorithm", :label="algorithm")
              el-form-item(v-for="sub_label in ['chairs', 'panels', 'trainees']", :key="sub_label", :label="capitalize(sub_label)+' per venue'", v-if="label === 'all' || label === 'adjudicators'")
                el-input-number(v-model="dialog.draw.form.model.numbers_of_adjudicators[sub_label]", :min="{ chairs: 1, panels: 0, trainees: 0 }[sub_label]")
              el-form-item(label="Considering Rounds", v-if="!dialog.draw.form.model.shuffle")
                el-checkbox(v-model="dialog.draw.consider_all") All Rounds Before {{ target_round.name }}
                el-select(v-if="!dialog.draw.consider_all", v-model="dialog.draw.considering_rs", multiple, :disabled="label === 'venues' && dialog.draw.form.model.shuffle")
                  el-option(v-for="round in target_tournament.rounds.slice().sort((r1, r2) => r1.r > r2.r ? 1 : -1)", :key="round.r", :value="round.r", :label="round.name")
            div(v-for="r in dialog.draw.considering_rs", :key="r")
              p(style="color: red;", v-if="adjudicators_ss_unsubmitted(r).length > 0 && (['all', 'teams', 'adjudicators'].includes(label) || (label === 'venues' && !dialog.draw.form.model.shuffle))") {{ round_name_by_r(r) }}> Need Score Sheets from: {{ adjudicators_ss_unsubmitted(r).map(entity_name_by_id).join(", ") }}
              p(style="color: red;", v-if="entities_es_unsubmitted(r).length > 0 && ['all', 'adjudicators'].includes(label)") {{ round_name_by_r(r) }}> Need Evaluation Sheets from: {{ entities_es_unsubmitted(r).map(entity_name_by_id).join(", ") }}
      .dialog-footer(slot="footer")
        el-button(@click="dialog.draw.visible = false") Cancel
        el-button(type="primary", :loading="dialog.draw.loading", @click="on_request_draw") Send
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import utab_header from 'components/utab-header.vue'
import draggable from 'vuedraggable'
import math from 'assets/js/math.js'
import lazy_item from 'components/lazy-item'

export default {
  components: {
    'utab-header': utab_header,
    'draggable': draggable,
    'lazy-item': lazy_item
  },
  props: ['r_str'],
  data () {
    return {
      submit_loading: false,
      delete_loading: false,
      allocation_loading: true,
      dialog: {
        draw: {
          allocation_type: 'all',
          consider_all: true,
          visible: false,
          loading: false,
          considering_rs: [],
          form: {
            model: {
              simple: false,
              force: false,
              shuffle: false,
              team_allocation_algorithm: 'standard',
              team_allocation_algorithm_options: {
                avoid_conflict: false,
                method: 'straight',
                //weights: [1, 0, 1, 0],
                filters: ['by_strength', 'by_side', 'by_past_opponent', 'by_institution']
              },
              adjudicator_allocation_algorithm: 'standard',
              adjudicator_allocation_algorithm_options: {
                assign: 'high_to_high',
                //filters: ['']
              },
              numbers_of_adjudicators: {
                chairs: 1,
                panels: 0,
                trainees: 0
              },
              venue_allocation_algorithm_options: {
                //
              }
            },
            rules: {}
          }
        }
      },
      new_draw: true,
      selected_team: null,
      selected_adjudicator: null,
      selected_warning: null,
      selected_venue: null,
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
    need_fix () {
      if (this.draw_temp !== null) {
          let available_team_ids = this.available_teams(this.r_str).map(t => t.id)
          for (let square of this.draw_temp.allocation) {
            if (square.teams.gov !== null && !available_team_ids.includes(square.teams.gov)) {
              return true
            } else if (square.teams.opp !== null && !available_team_ids.includes(square.teams.opp)) {
              return true
            }
          }
          return false
      } else {
          return false
      }
    },
    warning_classes () {
      return {
        'Same Institution': 'same-institution',
        'Already Judged': 'already-judged',
        'Sided': 'sided',
        'Different Win': 'different-win',
        'Conflicts': 'conflicts',
        'Personal Conflicts': 'personal-conflicts',
        'Past Matched': 'past-matched'
      }
    },
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
    suggested_action () {
      if (this.new_draw) {
        return 'save'
      } else {
        return 'update'
      }
    },
    ...mapState([
      'tournaments'
    ]),
    ...mapGetters([
      'style',
      'target_tournament',
      'entity_by_id',
      'entity_name_by_id',
      'available_teams',
      'available_adjudicators',
      'available_venues',
      'target_round',
      'target_draw',
      'draw_time',
      'access_detail',
      'compiled_team_result_by_id',
      'compiled_adjudicator_result_by_id',
      'round_name_by_r',
      'entities_es_unsubmitted',
      'adjudicators_ss_unsubmitted'
    ])
  },
  methods: {
    team_accessible (id) {
      return this.entity_by_id[id] !== undefined && this.compiled_team_result_by_id[id] !== undefined
    },
    adjudicator_accessible (id) {
      return this.entity_by_id[id] !== undefined && this.compiled_adjudicator_result_by_id[id] !== undefined
    },
    entity_accessible (id) {
      return this.entity_by_id[id] !== undefined
    },
    on_edit_request () {
      this.dialog.draw.visible = true
      this.dialog.draw.considering_rs = this.target_tournament.rounds
                                  .slice().sort((r1, r2) => r1.r > r2.r ? 1 : -1)
                                  .filter(round => round.r < this.target_round.r)
                                  .map(round => round.r)
    },
    on_reset_draw () {
      this.draw_temp = null,
      this.init_allocation()
    },
    on_fix_draw () {
      let new_allocation_temp = []
      let available_ids = this.available_teams(this.r_str)
                              .concat(this.available_adjudicators(this.r_str)
                              .concat(this.available_venues(this.r_str)))
                              .map(e => e.id)
      for (let square of this.draw_temp.allocation) {
        let ids = [square.venue, square.teams.gov, square.teams.opp].concat(square.chairs).concat(square.panels).concat(square.trainees)
        if (math.wrapped(ids, available_ids)) {
          new_allocation_temp.push(square)
        }
      }
      this.draw_temp.allocation = new_allocation_temp
      this.init_allocation()
    },
    async on_delete_draw () {
      const ans = await this.$confirm('Are you sure?')
      if (ans === 'confirm') {
        this.delete_loading = true
        let payload = {
          tournament: this.target_tournament,
          draw: this.target_draw
        }
        await this.send_delete_draw(payload)
        this.delete_loading = false
        this.draw_temp = null
        this.new_draw = true
        this.init_allocation()
      }
    },
    capitalize: math.capitalize,
    ...mapActions([
      'request_draw',
      'submit_draw',
      'update_draw',
      'send_delete_draw',
      'request_compiled_results'
    ]),
    warn_item_team (id, side) {
        let warn_item_team = {
          'unavailable': false,
          'selected': id === this.selected_team || (this.selected_warning !== null && this.selected_warning.teams.includes(id)),
          'same-institution': false,
          'different-win': false,
          'past-matched': false,
          'personal-conflicts': false,
          'conflicts': false,
          'sided': false,
          'sided-border': false,
          'already-judged': false
        }

        if (this.selected_team !== null) {//FOR RELATIONS WARNINGS
          let team0 = this.entity_by_id[this.selected_team]
          let team1 = this.entity_by_id[id]
          if (team0 !== undefined && team1 !== undefined) {
            let result0 = this.compiled_team_result_by_id[this.selected_team]
            let result1 = this.compiled_team_result_by_id[id]

            warn_item_team['same-institution'] = this.check_institutions(team0, team1)
            warn_item_team['different-win'] = this.check_wins(team0, team1, result0, result1)
            warn_item_team['past-matched'] = this.check_past_matched(team0, team1, result0, result1)
          }
        }
        if (this.selected_adjudicator !== null) {//FOR ADJUDICATOR RELATIONS WARNINGS
          let team = this.entity_by_id[id]
          let adjudicator = this.entity_by_id[this.selected_adjudicator]
          if (team !== undefined && adjudicator !== undefined) {
            let team_result = this.compiled_team_result_by_id[id]
            let adj_result = this.compiled_adjudicator_result_by_id[this.selected_adjudicator]
            warn_item_team['already-judged'] = this.check_judged(team, adjudicator, team_result, adj_result)

            warn_item_team['conflicts'] = this.check_conflicts(team, adjudicator)
            warn_item_team['personal-conflicts'] = this.check_personal_conflicts(team, adjudicator)
          }
        }
        let result = this.compiled_team_result_by_id[id]
        if (result !== undefined) {
          warn_item_team['sided-border'] = this.check_sided(result, side)
        }
        let team = this.entity_by_id[id]
        warn_item_team['unavailable'] = team === undefined || !this.access_detail(team, this.r_str).available
        return warn_item_team
    },
    warn_item_adjudicator (id) {
        let warn_item_adjudicator = {
          'unavailable': false,
          'selected': id === this.selected_adjudicator || (this.selected_warning !== null && this.selected_warning.adjudicators.includes(id)),
          'conflicts': false,
          'personal-conflicts': false,
          'same-institution': false,
          'already-judged': false,
          'zero-judged-border': false
        }

        if (this.selected_team !== null) {//FOR RELATIONS WARNINGS
          let team = this.entity_by_id[this.selected_team]
          let adjudicator = this.entity_by_id[id]
          if (team !== undefined && adjudicator !== undefined) {
            let team_result = this.compiled_team_result_by_id[this.selected_team]
            let adj_result = this.compiled_adjudicator_result_by_id[id]
            warn_item_adjudicator['already-judged'] = this.check_judged(team, adjudicator, team_result, adj_result)

            warn_item_adjudicator['conflicts'] = this.check_conflicts(team, adjudicator)
            warn_item_adjudicator['personal-conflicts'] = this.check_personal_conflicts(team, adjudicator)
          }
        }
        if (this.selected_adjudicator !== null) {//FOR ADJUDICATOR RELATIONS WARNINGS
          let adjudicator0 = this.entity_by_id[id]
          let adjudicator1 = this.entity_by_id[this.selected_adjudicator]
          if (adjudicator1 !== undefined && adjudicator0 !== undefined) {
            warn_item_adjudicator['same-institution'] = this.check_institutions(adjudicator0, adjudicator1)
          }
        }
        let result = this.compiled_adjudicator_result_by_id[id]
        if (result !== undefined) {
          warn_item_adjudicator['zero-judged-border'] = this.check_zero_judged(result)
        }
        let adjudicator = this.entity_by_id[id]
        warn_item_adjudicator['unavailable'] = adjudicator === undefined || !this.access_detail(adjudicator, this.r_str).available
        return warn_item_adjudicator
    },
    warn_item_venue (id) {
        let warn_item_venue = {
          'unavailable': false,
          'selected': id === this.selected_venue
        }
        let v = this.entity_by_id[id]
        warn_item_venue['unavailable'] = v === undefined || !this.access_detail(v, this.r_str).available
        return warn_item_venue
    },
    on_team (selected) {
      this.selected_team = selected
    },
    on_adjudicator (selected) {
      this.selected_adjudicator = selected
    },
    on_end () {
      this.selected_team = null
      this.selected_adjudicator = null
    },
    speaker_names_by_team_id (id) {
      return this.access_detail(this.entity_by_id[id], this.r_str)
        .speakers.map(this.entity_name_by_id).join(', ')
    },
    institution_names_by_team_id (id) {
      return this.access_detail(this.entity_by_id[id], this.r_str).institutions
        .map(this.entity_name_by_id).join(', ')
    },
    institution_names_by_adjudicator_id (id) {
      return this.access_detail(this.entity_by_id[id], this.r_str).institutions
        .map(this.entity_name_by_id).join(', ')
    },
    conflict_names_by_adjudicator_id (id) {
      return this.access_detail(this.entity_by_id[id], this.r_str).conflicts
        .map(this.entity_name_by_id).join(', ')
    },
    row_class({row}) {
      if (this.square_sendable(row)) {
        return 'sendable'
      } else {
        return 'unsendable'
      }
    },
    square_sendable (square) {
      let square_adjudicators = square.chairs.concat(square.panels).concat(square.trainees)
      let sub_entity_ids = square.teams.opp.concat(square.teams.gov).concat(square.venues).concat(square_adjudicators)
      let sub_entities = sub_entity_ids.map(id => this.entity_by_id[id]).filter(e => e !== undefined)
      if (square.teams.gov.length !== 1 || square.teams.opp.length !== 1) {
        return false
      } else if (square.venues.length > 1) {
        return false
      } else if (sub_entities.some(e => !this.access_detail(e, this.r_str).available)) {
        return false
      } else {
        return true
      }
    },
    warn_square_teams (square) {
      let warnings = []
      for (let side of ['gov', 'opp']) {
        for (let id of square.teams[side]) {
          let team = this.entity_by_id[id]
          let result = this.compiled_team_result_by_id[id]
          if (team === undefined || result === undefined) { continue }
          if (this.check_sided(result, side)) {
            warnings.push({
              name: "OneSided",
              message: "Team is one sided to "+side,
              teams: [id],
              adjudicators: []
            })
          }
        }
      }
      let checks = [{
        require_results: false,
        func: this.check_institutions,
        name: "DupInsti",
        message: "Two teams belong to the same institution",
      }, {
        require_results: true,
        func: this.check_wins,
        name: "DiffWin",
        message: "Two teams have different total win",
      }, {
        require_results: true,
        func: this.check_past_matched,
        name: "PastOpp",
        message: "Two teams have matched in the previous rounds",
      }]
      for (let pair of math.pairs(square.teams.gov, square.teams.opp)) {
        let gov = this.entity_by_id[pair[0]]
        let opp = this.entity_by_id[pair[1]]
        if (gov === undefined || opp === undefined) { continue }
        let result0 = this.compiled_team_result_by_id[pair[0]]
        let result1 = this.compiled_team_result_by_id[pair[1]]
        if (result0 === undefined || result1 === undefined) { continue }
        for (let check of checks) {
          if (check.func(gov, opp, result0, result1)) {
            warnings.push({
              name: check.name,
              message: check.message,
              teams: pair,
              adjudicators: []
            })
          }
        }
      }
      return warnings
    },
    warn_square_adjudicators (square) {
      let warnings = []
      let ta_checks = [{
        require_results: false,
        func: this.check_conflicts,
        name: "Conflict",
        message: "Adjudicators have an institution conflict",
      }, {
        require_results: false,
        func: this.check_personal_conflicts,
        name: "Personal",
        message: "Adjudicators have a personal conflict",
      }, {
        require_results: true,
        func: this.check_judged,
        name: "Judged",
        message: "Adjudicators already watched the teams",
      }]
      for (let pair of math.pairs(square.teams.gov.concat(square.teams.opp), square.chairs.concat(square.panels).concat(square.trainees))) {
        let team = this.entity_by_id[pair[0]]
        let adj = this.entity_by_id[pair[1]]
        if (adj === undefined || team === undefined) { continue }
        for (let check of ta_checks) {
          let team_result = this.compiled_team_result_by_id[pair[0]]
          let adj_result = this.compiled_adjudicator_result_by_id[pair[1]]
          if (team_result === undefined || adj_result === undefined) { continue }
          if (check.func(team, adj, team_result, adj_result)) {
            warnings.push({
              name: check.name,
              message: check.message,
              teams: [pair[0]],
              adjudicators: [pair[1]]
            })
          }
        }
      }
      let aa_checks = [{
        //require_results: false,
        func: this.check_institutions,
        name: "AdjInsti",
        message: "Adjudicators belong to the same institution",
      }]
      let adjudicators = square.chairs.concat(square.panels).concat(square.trainees)
      for (let pair of math.pairs(adjudicators, adjudicators)) {
        if (pair[0] >= pair[1]) { continue }
        let adj0 = this.entity_by_id[pair[0]]
        let adj1 = this.entity_by_id[pair[1]]
        if (adj0 === undefined || adj1 === undefined) { continue }
        for (let check of aa_checks) {
          if (check.func(adj0, adj1)) {
            warnings.push({
              name: check.name,
              message: check.message,
              teams: [],
              adjudicators: pair
            })
          }
        }
      }
      if (adjudicators.length === 0) {
        warnings.push({
          name: "NoAdj",
          message: "No adjudicators are allocated",
          teams: [],
          adjudicators: []
        })
      } else if (adjudicators.length % 2 === 0) {
        warnings.push({
          name: "EvenAdjs",
          message: "Even number of adjudicators are allocated",
          teams: [],
          adjudicators: []
        })
      }
      return warnings
    },
    check_sided (result, side) {
      return Math.abs(math.count(result.past_sides.concat([side]), 'gov') - math.count(result.past_sides.concat([side]), 'opp')) > 1
    },
    check_institutions (team0, team1) {
      return !math.disjoint(this.access_detail(team0, this.r_str).institutions, this.access_detail(team1, this.r_str).institutions) && team0.id !== team1.id
    },
    check_wins (team0, team1, result0, result1) {
      return result0.win !== result1.win
    },
    check_past_matched (team0, team1, result0, result1) {
      return result0.past_opponents.includes(team1.id)
    },
    check_judged (team, adj, team_result, adj_result) {
      return adj_result.judged_teams.includes(team.id)
    },
    check_zero_judged (result) {
      return result.num_experienced === 0
    },
    check_personal_conflicts (team, adj) {
      return this.access_detail(adj, this.r_str).conflicts.includes(team.id)
    },
    check_conflicts (team, adj) {
      return !math.disjoint(this.access_detail(team, this.r_str).institutions, this.access_detail(adj, this.r_str).institutions)
    },
    convert_to_draw () {
      let draw = {
        r: parseInt(this.r_str, 10),
        allocation: []
      }
      for (let raw_square of this.draw_adjusted.allocation) {
        let square = {
          id: raw_square.id,
          venue: raw_square.venues.length > 0 ? raw_square.venues[0] : null,
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
          shuffle: model.shuffle
        }
      }
      options.by = this.dialog.draw.consider_all ? this.target_tournament.rounds.filter(round => round.r < this.target_round.r).map(round => round.r)
                                                 : this.dialog.draw.considering_rs
      return this.request_draw({ tournament, r_str: this.r_str, options, draw, allocation_type }).then((data) => {
        this.draw_temp = data
        this.init_allocation()
        this.dialog.draw.loading = false
        this.dialog.draw.visible = false
      }).catch(() => {
        this.dialog.draw.loading = false
        this.dialog.draw.visible = false
      })
    },
    on_send_allocation () {
      this.submit_loading = true
      let tournament = this.target_tournament
      let draw = this.convert_to_draw()
      let action = this.suggested_action
      let actions = {
        'update': this.update_draw,
        'save': this.submit_draw
      }
      return actions[action]({ tournament, draw }).then(() => {
        this.new_draw = false
        this.submit_loading = false
      })
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
        let that = this
        let tournament = this.target_tournament
        this.draw_adjusted.allocation = []

        if (this.draw_temp !== null) {
            draw = this.draw_temp
        } else if (this.target_draw !== undefined) {
            draw = this.target_draw
            this.draw_temp = draw
        } else {
            draw = { r: parseInt(this.r_str, 10), allocation: [] }
            this.draw_temp = draw
        }
        let allocation = draw.allocation
        let sorted_allocation = allocation.slice().sort(function (a, b) {
          let venue1 = that.entity_by_id[a.venue]
          let venue2 = that.entity_by_id[b.venue]
          let pr1 = venue1 !== undefined ? that.access_detail(venue1, that.r_str).priority : 1
          let pr2 = venue2 !== undefined ? that.access_detail(venue2, that.r_str).priority : 1
          return pr1 > pr2 ? 1 : -1
        })

        let c = 0

        for (let square of sorted_allocation) {
            this.draw_adjusted.allocation.push({
                id: c,
                venues: square.venue === null ? [] : [square.venue],
                teams: {
                    gov: [square.teams.gov],
                    opp: [square.teams.opp]
                },
                chairs: square.chairs,
                panels: square.panels,
                trainees: square.trainees
            })
            c += 1
        }
        for (let i = 0; i < Math.floor(this.available_teams(this.r_str).length/2) - sorted_allocation.length; i++) {
            this.draw_adjusted.allocation.push({
                id: c,
                venues: [],
                teams: {
                    gov: [],
                    opp: []
                },
                chairs: [],
                panels: [],
                trainees: []
            })
            c += 1
        }

        this.venues = tournament.venues.map(v => v.id).filter(id => !this.venues_in_draw().includes(id))
        this.adjudicators = tournament.adjudicators.map(a => a.id).filter(id => !this.adjudicators_in_draw().includes(id))
        this.teams = tournament.teams.map(t => t.id).filter(id => !this.teams_in_draw().includes(id))
    }
  },
  async mounted () {
    this.new_draw = this.target_draw === undefined ? true : false
    this.allocation_loading = true
    this.init_allocation()
    let request = {
      rs: this.target_tournament.rounds.filter(round => round.r < parseInt(this.r_str, 10)).map(round => round.r),
      options: { force: true }
    }
    await Promise.all([
      this.request_compiled_results({ tournament: this.target_tournament, label_singular: 'team', label: 'teams', request }),
      this.request_compiled_results({ tournament: this.target_tournament, label_singular: 'adjudicator',label: 'adjudicators', request })
    ])
    this.allocation_loading = false
  }
}
</script>

<style lang="stylus">
  @import "../../../../common"

  .draggable-item
    background rgba(172, 240, 255, 0.35)
    border-radius 5px
    padding 0.2rem
    margin-top .5rem
    cursor pointer

  .unavailable
    color white
    background gray

  .router-view-content
    .allocation-content
      position relative
      padding-bottom 40vh

  .allocation-table
    th
      padding 0.3rem
    tr.el-table__row
      td
        padding 0

  .page-footer
    bottom 0
    left 0
    right 0
    z-index 1
    position fixed
    max-height 40vh
    padding-bottom 2vh
    border-top solid 2px gray
    padding-left 5%
    padding-right 5%
    padding-top 1%
    background rgb(240, 240, 240)
    overflow-y scroll

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

  .selected
    transition-timing-function ease
    transition all 0.4s
    //border 2px solid #20A0FF
    background-color rgba(#20a0ff, 0.5)

  .same-institution
    transition-timing-function ease
    transition all 0.4s
    //border 2px solid #F7B82A
    background-color #c0da1d

  .already-judged
    transition-timing-function ease
    transition all 0.4s
    //border 2px solid #F7B82A
    background-color lightgray

  .sided
    transition-timing-function ease
    transition all 0.4s
    //border 2px solid #F7B82A
    background-color #F7B82A

  .sided-border
    transition-timing-function ease
    transition all 0.4s
    box-sizing border-box
    border 2px solid #F7B82A

  .zero-judged-border
    transition-timing-function ease
    transition all 0.4s
    box-sizing border-box
    border 2px solid #F7B82A

  .different-win
    transition-timing-function ease
    transition all 0.4s
    //border 2px solid #13CE66
    background-color #13CE66

  .past-matched
    transition-timing-function ease
    transition all 0.4s
    background-color #7613cf

  .conflicts
    transition-timing-function ease
    transition all 0.4s
    //border 2px solid #FF4949
    background-color #FF4949

  .personal-conflicts
    transition-timing-function ease
    transition all 0.4s
    //border 2px solid #FF4949
    background-color #ff49b1

  .el-table .unsendable
    background #ff5e62
    transition all 1.5s

  .el-table .sendable
    background #ffffff
    transition all 1.5s

  .legend-content
    text-align center
    opacity 0.8
    color white
    border-radius 4px

  .warning-button
    padding 0.2rem

  .detail-button
    width 100%
    border none
    outline 0
    font-size 12px
    padding 0
    background rgba(255, 255, 255, 0)
    &:hover
      background rgba(255, 255, 255, 0)
      color unset
    &:active
      background rgba(255, 255, 255, 0)
      color unset
    &:focus
      background rgba(255, 255, 255, 0)
      color unset

  .el-table .cell
    padding 0

  .el-table .col-cell,
  .el-table th .cell
    padding 0 18px

  .adj-list
    margin 5px
    min-height 36px
    min-width 20%

  .adj-list-container
    width calc(100% - .5rem)
    background white
    padding-left .5rem
    padding-bottom .5rem
    //min-height 40px
    border-radius 2px
    box-shadow 1px 1px 0 rgba(0, 0, 0, 0.1)

    .adj-list.src
      display flex
      flex-flow row wrap
      margin 0

      .draggable-item
        margin-right .5rem
</style>
