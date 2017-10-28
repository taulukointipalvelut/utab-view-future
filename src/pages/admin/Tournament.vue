<template lang="pug">
  .router-view-content
    div
      h1(v-if="!loading") #[flexible-input(:loading="input_loading(target_tournament.id)", :text="target_tournament.name", @text-update="on_update_tournament_name", @start="flexible_input.identity=target_tournament.id")] #[canvas(id='qr', style="float: right; ")]
    loading-container(:loading="loading")
      legend(v-if="!loading") Rounds
      loading-container(:loading="loading")
        el-table(:data="target_tournament.rounds.slice().sort((r1, r2) => r1.r > r2.r ? 1 : -1)")
          el-table-column(prop="r", label="No.", align="center", :min-width="80")
          el-table-column(prop="name", label="Name", :min-width="200")
            template(slot-scope="scope")
              flexible-input(:loading="input_loading(scope.row.r)", :text="scope.row.name", @text-update="on_update_round_name(scope.row, $event)", @start="flexible_input.identity=scope.row.r", :class="{ 'round-unopened': !scope.row.user_defined_data.round_opened }")
          el-table-column(:min-width="270")
            template(slot-scope="scope")
              .round-operations
                el-button(size="small", @click="on_raw_result(scope.row)") #[el-icon(name="information")] Result
                el-button(size="small", @click="on_allocation_round(scope.row)") #[el-icon(name="menu")] Allocation
                el-button(size="small", @click="on_edit_round(scope.row)") #[el-icon(name="edit")]
                el-button(size="small", type="danger", @click="on_send_delete_round(scope.row)") #[el-icon(name="close")]
              //el-button(size="mini", @click="on_next(1)", style="width: 0.3rem; padding: 0; border: none; background: none;", v-if="scope.row.r === target_tournament.current_round_num && scope.row.r < target_tournament.total_round_num") #[el-icon(name="caret-bottom")]
              //el-button(size="mini", @click="on_next(-1)", style="width: 0.3rem; padding: 0; border: none; background: none;", v-if="scope.row.r === target_tournament.current_round_num && scope.row.r !== 1") #[el-icon(name="caret-top")]
        .operations
          el-button.compiled(:disabled="target_tournament.rounds.length === 0", @click='dialog.compile.visible=true') Compile Results
          el-button(type="primary", @click="dialog.round.visible = true") #[el-icon(name="plus")] &nbsp;Add New Round

      legend(v-if="!loading") Check-in
      el-tabs(v-if="!loading")
        el-tab-pane(v-for="label in ['teams', 'adjudicators', 'venues', 'speakers', 'institutions']", :key="label")
          span.tab-label(slot="label") {{ capitalize(label) }} #[el-badge(type="mark", :value="target_tournament[label].length")]
          loading-container(:loading="loading")
            span(v-if="target_tournament[label].length === 0") No {{ capitalize(label) }} are registered.
            el-collapse.outer-collapse(v-else, accordion, @change="outer_collapse[labels_singular[label]] = $event", :class="{ 'no-detail-entity': label==='speakers' || label==='institutions' }")
              el-collapse-item.outer-collapse-item(v-for="entity in target_tournament[label].slice().sort((e1, e2) => e1.name.localeCompare(e2.name))", :key="entity.id", :name="entity.id")
                template(slot="title")
                  div(style="width: 90%; display: inline-flex; justify-content: space-between; align-items: center;")
                    span #[flexible-input(:loading="input_loading(entity.id)", :text="entity_name_by_id(entity.id)", @text-update="on_update(label, labels_singular[label], entity, $event)", @start="flexible_input.identity=entity.id")]
                    div
                      el-button(size="small", type="danger", @click="on_delete(label, labels_singular[label], entity)") #[el-icon(name="close")]
                el-collapse.inner-collapse(accordion, @change="on_collapse(labels_singular[label], entity, $event)", v-if="parseInt(outer_collapse[labels_singular[label]], 10) === entity.id && ['venues', 'teams', 'adjudicators'].includes(label)")
                  el-collapse-item.inner-collapse-item(v-for="detail in entity.details.slice().sort((d1, d2) => d1.r > d2.r ? 1 : -1)", :key="detail.r", :name="detail.r", v-if="target_tournament.rounds.map(round => round.r).includes(detail.r)")
                    template(slot="title")
                      span(:style="detail.available ? '' : 'color: red;'") {{ round_name_by_r(detail.r) }} #[el-icon(name="warning", v-if="warn_entity_detail(detail).length > 0")] {{ warn_entity_detail(labels_singular[label], detail).join(',') }}
                    el-table.inner-table(:data="[specified(label).detail]", v-if="specified(label).id !== null")
                      el-table-column(label="Available", align="center")
                        template(slot-scope="scope")
                          el-switch(v-model="specified(label).detail.available", on-text="", off-text="")
                      el-table-column(v-for="sub_label in sub_labels_list[label]", :label="capitalize(sub_label)", align="center", :key="sub_label")
                        template(slot-scope="scope")
                          el-select(multiple, v-model="specified(label).detail[sub_label]")
                            el-option(v-for="sub_entity in data_to_select(sub_label, specified(label).id, detail.r)", :label="sub_entity.name", :value="sub_entity.id", :key="sub_entity.id")
                      el-table-column(label="", align="center")
                        template(slot-scope="scope")
                          el-button(type="primary", size="small", @click="on_save_detail(label, labels_singular[label])", :loading="collapsed[labels_singular[label]].loading") Save
            .operations
              el-button(type="primary", @click="dialog[label].visible = true") #[el-icon(name="plus")] &nbsp;Add New {{ capitalize(label) }}

      el-dialog(title="Compile Results", :visible.sync="dialog.compile.visible", v-if="!loading")
        .dialog-body
          el-form(:model="dialog.round.form.model", :rules="dialog.compile.form.rules")
            el-form-item(label="Rounds")
              el-select(v-model="dialog.compile.form.model.rs", multiple)
                el-option(v-for="round in target_tournament.rounds.slice().sort((r1, r2) => r1.r > r2.r ? 1 : -1)", :key="round.r", :value="round.r", :label="round.name")
            el-form-item(label="Force")
              el-switch(on-text="", off-text="", v-model="dialog.compile.form.model.force")
            el-form-item(label="Simple")
              el-switch(on-text="", off-text="", v-model="dialog.compile.form.model.simple")
            el-form-item(label="Target")
              el-checkbox-group(v-model="dialog.compile.entities")
                el-checkbox(label="teams", :checked="true")
                el-checkbox(label="adjudicators", :checked="true")
                el-checkbox(label="speakers", :checked="true", :disabled="dialog.compile.form.model.simple")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.compile.visible = false") Cancel
          el-button(type="primary", @click="on_compile", :disabled="dialog.compile.entities.length === 0 || dialog.compile.form.model.rs.length === 0") Request

      el-dialog(title="Add New Round", :visible.sync="dialog.round.visible", v-if="!loading")
        .dialog-body
          el-form(ref="dialog_round", :model="dialog.round.form.model", :rules="dialog.round.form.rules")
            el-form-item(label="Round No.", prop="r")
              el-input-number(v-model="dialog.round.form.model.r", :min="1", :max="view_config.max_rounds")
            el-form-item(label="Name", prop="name")
              el-input(v-model="dialog.round.form.model.name", :placeholder="'Round '+dialog.round.form.model.r")
            el-form-item(label="Round Opened", prop="round_opened")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog.round.form.model.user_defined_data.round_opened")
            el-form-item(label="Draw Opened", prop="team_allocation_opened")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog.round.form.model.user_defined_data.team_allocation_opened")
            el-form-item(label="Allocation Opened", prop="adjudicator_allocation_opened")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog.round.form.model.user_defined_data.adjudicator_allocation_opened")
            el-form-item(label="Adjudicators Evaluate Each Other", prop="evaluate_each_other")
              el-switch(:default="true", on-text="", off-text="", on-color="#13ce66", v-model="dialog.round.form.model.user_defined_data.evaluate_each_other")
            el-form-item(label="Chairs Always Evaluated", prop="chairs_always_evaluated")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog.round.form.model.user_defined_data.chairs_always_evaluated")
            el-form-item(label="Allow Low-Win/Tie-Win", prop="allow_low_tie_win")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog.round.form.model.user_defined_data.allow_low_tie_win")
            el-form-item(label="Evaluator in Team", prop="evaluator_in_team")
              el-select(v-model="dialog.round.form.model.user_defined_data.evaluator_in_team")
                el-option(v-for="index in range(3)", :key="index", :value="['team', 'speaker', null][index]", :label="['One', 'All', 'None'][index]")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.round.visible = false") Cancel
          el-button(type="primary", :loading="dialog.round.loading", @click="on_create_round()") #[el-icon(name="plus", v-if="!dialog.round.loading")] Create

      el-dialog(title="Edit Round", :visible.sync="dialog.round.edit_visible")
        .dialog-body
          el-form(:model="dialog.round.edit_form.model")
            el-form-item(label="Round No.")
              span {{ dialog.round.edit_form.model.r }}
            el-form-item(label="Name", prop="name")
              el-input(v-model="dialog.round.edit_form.model.name", :placeholder="'Round '+dialog.round.edit_form.model.r")
            el-form-item(label="Round Opened", prop="round_opened")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog.round.edit_form.model.user_defined_data.round_opened")
            el-form-item(label="Draw Opened", prop="team_allocation_opened")
              el-switch(on-text="", off-text="", v-model="dialog.round.edit_form.model.user_defined_data.team_allocation_opened")
            el-form-item(label="Allocation Opened", prop="adjudicator_allocation_opened")
              el-switch(on-text="", off-text="", v-model="dialog.round.edit_form.model.user_defined_data.adjudicator_allocation_opened")
            el-form-item(label="Adjudicators Evaluate Each Other", prop="evaluate_each_other")
              el-switch(:default="true", on-text="", off-text="", on-color="#13ce66", v-model="dialog.round.edit_form.model.user_defined_data.evaluate_each_other")
            el-form-item(label="Chairs Always Evaluated", prop="chairs_always_evaluated")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog.round.edit_form.model.user_defined_data.chairs_always_evaluated")
            el-form-item(label="Allow Low Win/Tie Win", prop="allow_low_tie_win")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog.round.edit_form.model.user_defined_data.allow_low_tie_win")
            el-form-item(label="Evaluator in Team", prop="evaluator_in_team")
              el-select(v-model="dialog.round.edit_form.model.user_defined_data.evaluator_in_team")
                el-option(v-for="index in range(3)", :key="index", :value="['team', 'speaker', null][index]", :label="['One', 'All', 'None'][index]")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.round.edit_visible = false") Cancel
          el-button(type="primary", :loading="dialog.round.edit_loading", @click="on_update_round()") OK

      el-dialog(v-for="label in ['teams', 'adjudicators', 'venues', 'speakers', 'institutions']", :title="'Add New '+capitalize(labels_singular[label])", :visible.sync="dialog[label].visible", :key="label", v-if="!loading")
        .dialog-body
          el-form(:model="dialog[label].form.model", :rules="dialog[label].form.rules")
            el-form-item(label="Name", prop="name")
              el-input(v-model="dialog[label].form.model.name")
            h3(style="text-align: center;", v-if="['teams', 'adjudicators', 'venues'].includes(label)") Values below are set default for all rounds.
            el-form-item(label="Available", prop="available", v-if="['teams', 'adjudicators', 'venues'].includes(label)")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog[label].form.model.available")
            el-form-item(v-for="sub_label in sub_labels_list[label]", :label="capitalize(sub_label)", :prop="sub_label", :key="sub_label", v-if="['teams', 'adjudicators', 'venues'].includes(label)")
              el-select(multiple, v-model="dialog[label].form.model[sub_label]")
                el-option(v-for="sub_entity in data_to_select(sub_label)", :key="sub_entity.id", :label="sub_entity.name", :value="sub_entity.id")
            el-form-item(label="Force", prop="force")
              el-switch(:default="false", on-text="", off-text="", v-model="dialog[label].force")
        .dialog-footer(slot="footer")
          el-button(@click="dialog[label].visible = false") Cancel
          el-button(type="primary", :loading="dialog[label].loading", @click="on_create(label)") #[el-icon(name="plus", v-if="!dialog[label].loading")] Create
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import loading_container from 'components/loading-container'
import flexible_input from 'components/flexible-input'
import Lazy from 'assets/js/lazy'
import math from 'assets/js/math'
import { validators, not, is_integer, is_nonzero, is_positive, exists } from 'assets/js/form-validator'
import qrious from 'qrious'

function dialog_generator () {
  return {
    round: {
      loading: false,
      edit_loading: false,
      visible: false,
      edit_visible: false,
      form: {
        model: {
          name: '',
          r: '',
          user_defined_data: {
            round_opened: true,
            team_allocation_opened: true,
            adjudicator_allocation_opened: true,
            evaluate_each_other: true,
            chairs_always_evaluated: false,
            allow_low_tie_win: true,
            evaluator_in_team: 'team'
          }
        }
      },
      edit_form: {
        model: {
          r: '',
          name: '',
          user_defined_data: {
            round_opened: true,
            team_allocation_opened: true,
            adjudicator_allocation_opened: true,
            evaluate_each_other: true,
            chairs_always_evaluated: false,
            allow_low_tie_win: true,
            evaluator_in_team: 'team'
          }
        }
      },
    },
    teams: {
      loading: false,
      visible: false,
      force: false,
      form: {
        model: {
          name: '',
          available: true,
          institutions: [],
          speakers: []
        },
        rules: {}
      }
    },
    adjudicators: {
      loading: false,
      visible: false,
      force: false,
      form: {
        model: {
          name: '',
          available: true,
          institutions: [],
          conflicts: []
        },
        rules: {}
      }
    },
    venues: {
      loading: false,
      visible: false,
      force: false,
      form: {
        model: {
          name: '',
          available: true
        },
        rules: {}
      }
    },
    speakers: {
      loading: false,
      visible: false,
      force: false,
      form: {
        model: {
          name: ''
        },
        rules: {}
      }
    },
    institutions: {
      loading: false,
      visible: false,
      force: false,
      form: {
        model: {
          name: ''
        },
        rules: {}
      }
    },
    compile: {
      entities: [],
      visible: false,
      form: {
        model: {
          rs: [],
          force: false,
          simple: false
        }
      }
    }
  }
}

export default {
  components: {
    'loading-container': loading_container,
    'flexible-input': flexible_input
  },
  data () {
    return {
      flexible_input: {
        identity: null,
        loading: false
      },
      labels_singular: {
        teams: 'team',
        adjudicators: 'adjudicator',
        speakers: 'speaker',
        institutions: 'institution',
        venues: 'venue'
      },
      sub_labels_list: {
        teams: ['institutions', 'speakers'],
        adjudicators: ['institutions', 'conflicts'],
        venues: []
      },
      outer_collapse: {
        team: null,
        adjudicator: null,
        venue: null,
      },
      collapsed: {
        team: {
          loading: false,
          id: null,
          detail: {
            r: null,
            available: false,
            speakers: [],
            institutions: []
          }
        },
        adjudicator: {
          loading: false,
          id: null,
          detail: {
            r: null,
            available: false,
            conflicts: [],
            institutions: []
          }
        },
        venue: {
          loading: false,
          id: null,
          detail: {
            r: null,
            available: false
          }
        }
      },
      team_selected: undefined,
      adjudicator_selected: undefined,
      dialog: dialog_generator()
    }
  },
  computed: {
    ...mapState([
      'auth',
      'loading',
      'adjudicators',
      'view_config'
    ]),
    ...mapGetters([
      'draw_by_r',
      'unallocated_speakers',
      'target_tournament',
      'access_detail',
      'entity_name_by_id',
      'entity_by_id',
      'round_name_by_r',
      'round_href'
    ])
  },
  methods: {
    ...mapActions([
      'send_update_tournament',
      'send_create_round',
      'send_delete_round',
      'send_delete_draw',
      'send_delete_results',
      'send_create_entities',
      'send_delete_entity',
      'send_update_entity',
      'send_update_round',
      'request_compiled_results',
      'init_one',
      'next_round'
    ]),
    specified (label) {
      return this.collapsed[this.labels_singular[label]]
    },
    range: math.range,
    input_loading (identity) {
      return this.flexible_input.identity === identity ? this.flexible_input.loading : false
    },
    async on_update_tournament_name (name) {
      let payload = { tournament: { name, id: this.target_tournament.id } }
      this.flexible_input.loading = true
      await this.send_update_tournament(payload)
      this.initialize_qr()
      this.flexible_input.loading = false
    },
    capitalize (p) {
      return p.charAt(0).toUpperCase() + p.slice(1)
    },
    data_to_select (sub_label, except_team=null, r=null) {
      let data_to_select = []
      if (sub_label === 'speakers') {
        data_to_select = this.unallocated_speakers(except_team, r)
      } else if (sub_label === 'institutions') {
        data_to_select = this.target_tournament.institutions
      } else if (sub_label === 'conflicts') {
        data_to_select = this.target_tournament.teams
      }

      return data_to_select.slice().sort((e1, e2) => e1.name.localeCompare(e2.name))
    },
    on_collapse (label_singular, entity, r) {
      if (r === '') {
        this.collapsed[label_singular].id = null
      } else {
        this.collapsed[label_singular].id = entity.id
        this.collapsed[label_singular].detail.r = parseInt(r, 10)
        this.collapsed[label_singular].detail.available = this.access_detail(entity, r).available
        if (label_singular === 'team') {
          this.collapsed[label_singular].detail.speakers = this.access_detail(entity, r).speakers.slice()
          this.collapsed[label_singular].detail.institutions = this.access_detail(entity, r).institutions.slice()
        } else if (label_singular === 'adjudicator') {
          this.collapsed[label_singular].detail.institutions = this.access_detail(entity, r).institutions.slice()
          this.collapsed[label_singular].detail.conflicts = this.access_detail(entity, r).conflicts.slice()
        }
      }
    },
    warn_entity_detail (label_singular, detail) {
      let warnings = []
      let sub_labels = []
      if (label_singular === 'team') {
        sub_labels = ['speakers', 'institutions']
      } else if (label_singular === 'adjudicator') {
        sub_labels = ['conflicts', 'institutions']
      }
      for (let sub_label of sub_labels) {
        if (detail[sub_label].some(id => math.count(detail[sub_label], id) > 1)) {
          warnings.push('Dup'+math.capitalize(sub_label))
        }
      }

      return warnings
    },
    on_allocation_round (selected) {
      this.$router.push({
        path: '/admin'+this.round_href(selected).path+'/allocation'
      })
    },
    on_raw_result (selected) {
      this.$router.push({
        path: 'result/raw/'+selected.r
      })
    },
    on_create_round () {
      this.dialog.round.loading = true
      let tournament = this.target_tournament
      let model = this.dialog.round.form.model
      let round = Object.assign({}, model)
      if (model.name === '') {
        round.name = 'Round '+round.r
      }
      let payload = { tournament, round }
      this.send_create_round(payload)
      this.dialog.round.loading = false
      this.dialog.round.visible = false
    },
    async on_send_delete_round (selected) {
      const ans = await this.$confirm('Are you sure? All the results and the allocation in '+selected.name+' will be deleted.')
      const tournament = this.target_tournament
      if (ans === 'confirm') {
        await this.send_delete_round({ tournament, round: selected })
        for (let label of ['teams', 'speakers', 'adjudicators']) {
          await this.send_delete_results({ tournament, round: selected, label, label_singular: this.labels_singular[label] })
        }
        let draw = this.draw_by_r(selected.r)
        if (draw !== undefined) {
          await this.send_delete_draw({ tournament, draw })
        }
      }
    },
    on_edit_round (selected) {
      this.transfer(this.dialog.round.edit_form.model, selected)
      this.dialog.round.edit_form.model.r = selected.r
      this.dialog.round.edit_visible = true
    },
    on_update_round () {
      this.dialog.round.edit_loading = true
      const tournament = this.target_tournament
      const round = Object.assign({}, this.dialog.round.edit_form.model)
      this.send_update_round({ tournament, round })
          .then(() => {
              this.dialog.round.edit_loading = false
              this.dialog.round.edit_visible = false
          })
    },
    on_update_round_name (round, name) {
      const tournament = this.target_tournament
      const dict = {
        r: round.r,
        name
      }
      this.flexible_input.loading = true
      this.send_update_round({ tournament, round: dict })
          .then(() => {
              this.flexible_input.loading = false
          })
    },
    async on_save_detail (label, label_singular) {
      this.collapsed[label_singular].loading = true
      let detail = this.collapsed[label_singular].detail
      let id = this.collapsed[label_singular].id
      let entity = this.entity_by_id(id)
      let details = entity.details.filter(d => d.r !== detail.r)
      details.push(detail)
      let payload = { tournament: this.target_tournament, label_singular, label }
      payload[label_singular] = { id, details }
      await this.send_update_entity(payload)
      this.collapsed[label_singular].loading = false
    },
    on_compile () {
      let tournament = this.target_tournament
      let model = this.dialog.compile.form.model
      let _payload = {
        tournament,
        request: {
          rs: model.rs,
          options: {
            simple: model.simple,
            force: model.force
          }
        }
      }
      let payloads = []
      if (this.dialog.compile.entities.includes('adjudicators')) {
        let payload = Object.assign({}, _payload)
        payload.label = 'adjudicators'
        payload.label_singular = 'adjudicator'
        payloads.push(payload)
      }
      if (this.dialog.compile.entities.includes('speakers') && !model.simple) {
        let payload = Object.assign({}, _payload)
        payload.label = 'speakers'
        payload.label_singular = 'speaker'
        payloads.push(payload)
      }
      if (this.dialog.compile.entities.includes('teams')) {
        let payload = Object.assign({}, _payload)
        payload.label = 'teams'
        payload.label_singular = 'team'
        payloads.push(payload)
      }

      Promise.all(payloads.map(this.request_compiled_results))
        .then(() => {
          this.dialog.compile.visible = false
          this.$router.push({
            path: 'result/compiled'
          })
      })
    },
    async on_create (label) {
      this.dialog[label].loading = true

      const tournament = this.target_tournament
      let model = this.dialog[label].form.model
      let entity = Object.assign({}, model)
      this.convert_with_details(entity, label)
      let payload = {
        tournament,
        label,
        force: this.dialog[label].force
      }
      payload[label] = [entity]
      await this.send_create_entities(payload)
      this.dialog = dialog_generator()
      this.dialog[label].loading = false
      this.dialog[label].visible = false
    },
    async on_update (label, label_singular, entity, name) {
      const tournament = this.target_tournament
      let dict = { id: entity.id, name }
      let payload = {
        tournament,
        label,
        label_singular
      }
      payload[label_singular] = dict
      this.flexible_input.loading = true
      await this.send_update_entity(payload)
      this.flexible_input.loading = false
    },
    async on_delete (label, label_singular, selected) {
      let warnings = {
        teams: ' Selected team will also be removed from adjudicator conflicts.',
        speakers: ' Selected speaker will also be removed from teams.',
        institutions: ' Selected institution will also be removed from adjudicator/team institutions.',
        venues: '',
        adjudicators: ''
      }
      let parent_list = {
        teams: [{ label: 'adjudicators', label_singular: 'adjudicator', child_label: 'conflicts' }],
        speakers: [{ label: 'teams', label_singular: 'team', child_label: 'speakers' }],
        institutions: [{ label: 'adjudicators', label_singular: 'adjudicator', child_label: 'institutions' }, { label: 'teams', label_singular: 'team', child_label: 'institutions' }],
        venues: [],
        adjudicators: []
      }
      const ans = await this.$confirm('Are you sure? You can NOT undo this operation. '+warnings[label]+'\nWarning: Removal after draw creation may cause a severe crash.')
      if (ans === 'confirm') {
        const tournament = this.target_tournament
        let payload = {
          tournament,
          label,
          label_singular
        }
        payload[label_singular] = {
          id: selected.id
        }
        this.send_delete_entity(payload)
        for (let parent of parent_list[label]) {
          for (let entity of tournament[parent.label]) {
            let changed = false
            let details = []
            for (let detail of entity.details) {
              if (detail[parent.child_label].includes(selected.id)) {
                changed = true
              }
              let new_detail = Object.assign({}, detail)
              new_detail[parent.child_label] = new_detail[parent.child_label].filter(id => id !== selected.id)
              details.push(new_detail)
            }
            if (changed) {
              payload = { tournament, label: parent.label, label_singular: parent.label_singular }
              payload[parent.label_singular] = { id: entity.id, details }
              this.send_update_entity(payload)
            }
          }
        }
      }
    },
    transfer (to, from) {
      for (let key in to) {
        if (from.hasOwnProperty(key)) {
          to[key] = from[key]
        }
      }
    },
    convert_with_details (entity, label) {
        let tournament = this.target_tournament
        if (label === 'teams') {
          entity.details = this.range(this.view_config.max_rounds).map(num => {
            return {
              r: num+1,
              speakers: entity.speakers,
              institutions: entity.institutions,
              available: entity.available
            }
          })
          delete entity.speakers
          delete entity.institutions
          delete entity.available
        } else if (label === 'adjudicators') {
          entity.details = this.range(this.view_config.max_rounds).map(num => {
            return {
              r: num+1,
              conflicts: entity.conflicts,
              institutions: entity.institutions,
              available: entity.available
            }
          })
          delete entity.conflicts
          delete entity.institutions
          delete entity.available
        } else if (label === 'venues') {
          entity.details = this.range(this.view_config.max_rounds).map(num => {
            return {
              r: num+1,
              available: entity.available
            }
          })
          delete entity.available
        }
    },
    initialize_qr () {
      let qr = new qrious({
        element: document.getElementById('qr'),
        value: this.view_config.base_url + '/' + this.target_tournament.name,
        backgroundAlpha: 0,
        level: 'L',
        size: 90
      })
    }
  },
  async mounted () {
    await this.init_one({ tournament: this.target_tournament })
    this.initialize_qr()
  }
}
</script>

<style lang="stylus">
  @import "../../common"

  span.tab-label
    color rgb(80, 80, 80)

  .round-operations
    display flex
    justify-content flex-end
    align-items center
    margin-right 0.4rem

  .round-unopened
    color rgb(160, 160, 160)
    //text-decoration line-through

  .no-detail-entity
    i.el-collapse-item__header__arrow.el-icon-arrow-right
      display none
    div.el-collapse-item__wrap
      border-bottom 0

  .el-badge__content
    font-size 0.7rem
    background-color gray
    padding 0 4px
    height 0.85rem
    line-height 0.9rem

  .inner-table
    border none

  .inner-collapse
    border none
    background #dfe6ec

  .outer-collapse-item
    div.el-collapse-item__content
      padding 0

  .collapse-row-warned
    color red

  .inner-collapse-item
    margin-left 1rem
    border-left solid 1px #dfe6ec
    div.el-collapse-item__wrap
      border none
    div.el-collapse-item__content
      padding 0

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

  .compiled
    margin-right 0.5rem

  .operations
    width 100%
    display flex
    flex-wrap wrap
    align-content space-between
    justify-content flex-end

  legend
    color rgba(0,0,0,.54)
    font-size 90%

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>
