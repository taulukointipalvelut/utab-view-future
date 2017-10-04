<!--
TODO: Edit dialog needs validation
-->
<template lang="pug">
  .router-view-content
    h1(v-if="!loading") {{ target_tournament.name }}
    loading-container(:loading="loading")
      legend(v-if="!loading") Rounds
        loading-container(:loading="loading")
          el-table(:data="target_tournament.rounds.slice().sort((r1, r2) => r1.r > r2.r ? 1 : -1)", @row-click="on_select_round")
            el-table-column(prop="r", label="No.", width="60", align="center")
            el-table-column(prop="name", label="Name", show-overflow-tooltip)
            el-table-column
              template(scope="scope")
                el-button(size="small", @click="on_edit_round(scope.row)", disabled) #[el-icon(name="edit")] Edit
                el-button(size="small", type="danger", @click="on_send_delete_round(scope.row)", disabled) #[el-icon(name="close")] Delete
                el-button(size="small", @click="on_raw_result(scope.row)") #[el-icon(name="information")] Result
                el-button(size="small", @click="on_allocation_round(scope.row)") #[el-icon(name="menu")] Allocation
          .operations

            el-button.compiled(:disabled="target_tournament.rounds.length === 0", @click='dialog.compile.visible=true') Compile Results
            el-button(type="primary", @click="dialog.rounds.visible = true") #[el-icon(name="plus")] &nbsp;Add New Round

      el-tabs(type="card", v-if="!loading")
        el-tab-pane(v-for="index in range(5)", :label="capitalize(entity.labels[index])", :key="index")
          loading-container(:loading="loading")
            el-table(:data="target_tournament[entity.labels[index]].slice().sort((t1, t2) => Math.abs(t1.id) > Math.abs(t2.id) ? 1 : -1)", @row-click="on_select")
              el-table-column(prop="id", label="ID", show-overflow-tooltip, align="center", sortable)
              el-table-column(v-for="prop in entity.display_props[entity.labels[index]]", :label="capitalize(prop)", align="center", :key="prop", sortable)
                template(scope="scope")
                  span {{ show(scope.row, prop) }}
              el-table-column(align="right")
                template(scope="scope")
                  el-button(size="small", @click="on_edit(entity.labels[index], scope.row)", disabled) #[el-icon(name="edit")] Edit
                  el-button(size="small", type="danger", @click="on_delete(entity.labels[index], entity.labels_singular[index], scope.row)") #[el-icon(name="close")] Delete
            .operations
              el-button(type="primary", @click="dialog[entity.labels[index]].visible = true") #[el-icon(name="plus")] &nbsp;Add New {{ capitalize(entity.labels_singular[index]) }}

      el-dialog(title="Compile Results", :visible.sync="dialog.compile.visible", v-if="!loading")
        .dialog-body
          el-form(:model="dialog.rounds.form.model", :rules="dialog.compile.form.rules")
            el-form-item(label="Rounds")
              el-checkbox(v-for="round in target_tournament.rounds", :key="round.r", v-model="dialog.compile.form.model.rs[round.r]", :disabled="round.r > target_tournament.current_round_num") {{ round.name }}
            el-form-item(label="Force")
              el-switch(on-text="", off-text="", v-model="dialog.compile.form.model.force")
            el-form-item(label="Simple")
              el-switch(on-text="", off-text="", v-model="dialog.compile.form.model.simple")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.compile.visible = false") Cancel
          el-button(type="primary", @click="on_compile") Request

      el-dialog(title="Add New Round", :visible.sync="dialog.rounds.visible", v-if="!loading")
        .dialog-body
          el-form(ref="dialog_round", :model="dialog.rounds.form.model", :rules="dialog.rounds.form.rules")
            h3(align="center") Round {{ target_tournament.rounds.length + 1 }}
            el-form-item(label="Name", prop="name")
              el-input(v-model="dialog.rounds.form.model.name")
            el-form-item(label="Draw Opened", prop="team_allocation_opened")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog.teams.form.model.team_allocation_opened")
            el-form-item(label="Allocation Opened", prop="adjudicator_allocation_opened")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog.teams.form.model.adjudicator_allocation_opened")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.rounds.visible = false") Cancel
          el-button(type="primary", :loading="dialog.rounds.loading", @click="on_create_round()") #[el-icon(name="plus", v-if="!dialog.rounds.loading")] Create

      //el-dialog(title="Edit Round", :visible.sync="dialog.round_edit.visible")
        .dialog-body
          el-form(ref="dialog_round_edit", :model="dialog.round_edit.form.model")
            el-form-item(label="Round No.", prop="r")
              el-input(type="number", v-model="dialog.round_edit.form.model.r", readonly)
            el-form-item(label="Name", prop="name")
              el-input(v-model="dialog.round_edit.form.model.name")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.round_edit.visible = false") Cancel
          el-button(type="primary", :loading="dialog.round_edit.loading", @click="on_update_round()") OK

      el-dialog(v-for="index in range(5)", :title="'Add New '+capitalize(entity.labels_singular[index])", :visible.sync="dialog[entity.labels[index]].visible", :key="index", v-if="!loading")
        .dialog-body
          el-form(:model="dialog[entity.labels[index]].form.model", :rules="dialog[entity.labels[index]].form.rules")
            el-form-item(v-for="prop_data in entity.dialog_props_editable.input[entity.labels[index]]", :label="capitalize(prop_data.prop)", :prop="prop_data.prop", :key="prop_data.prop")
              el-input(type="number", v-model.number="dialog[entity.labels[index]].form.model[prop_data.prop]", v-if="prop_data.type === Number")
              el-input(v-model="dialog[entity.labels[index]].form.model[prop_data.prop]", v-if="prop_data.type !== Number")
            el-form-item(v-for="prop_data in entity.dialog_props_editable.boolean[entity.labels[index]]", :label="capitalize(prop_data.prop)", :prop="prop_data.prop", :key="prop_data.prop")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog[entity.labels[index]].form.model[prop_data.prop]")
            el-form-item(v-for="prop_data in entity.dialog_props_editable.selection[entity.labels[index]]", :label="capitalize(prop_data.label ? prop_data.label : prop_data.prop)", :prop="prop_data.prop", :key="prop_data.prop")
              el-select(v-for="sub_index in range(prop_data.default_length)", v-model="dialog[entity.labels[index]].form.model[prop_data.prop][sub_index]", :key="sub_index")
                el-option(v-for="sub_entity in data_to_select(prop_data.prop).slice().sort((e1, e2) => e1.name.localeCompare(e2.name))", :key="sub_entity.id", :value="sub_entity.id", :label="sub_entity.name")
              el-button(size="mini", @click="prop_data.default_length++", v-if="prop_data.extendable") #[el-icon(name="plus")]
        .dialog-footer(slot="footer")
          el-button(@click="dialog[entity.labels[index]].visible = false") Cancel
          el-button(type="primary", :loading="dialog[entity.labels[index]].loading", @click="on_create(entity.labels[index])") #[el-icon(name="plus", v-if="!dialog[entity.labels[index]].loading")] Create

      el-dialog(v-for="index in range(5)", :title="'Edit '+capitalize(entity.labels_singular[index])", :visible.sync="dialog[entity.labels[index]].edit_visible", :key="index", v-if="!loading")
        .dialog-body
          el-form(:model="dialog[entity.labels[index]].edit_form.model", :rules="dialog[entity.labels[index]].form.rules")
            h3(align="center", v-for="prop_data in entity.dialog_props_unchangeable.input[entity.labels[index]]", :key="prop_data.prop") {{ prop_data.prop }}: {{ dialog[entity.labels[index]].editing ? dialog[entity.labels[index]].editing[prop_data.prop] : '' }}
            el-form-item(v-for="prop_data in entity.dialog_props_changeable.input[entity.labels[index]]", :label="capitalize(prop_data.prop)", :prop="prop_data.prop", :key="prop_data.prop")
              el-input(type="number", v-model.number="dialog[entity.labels[index]].edit_form.model[prop_data.prop]", v-if="prop_data.type === Number")
              el-input(v-model="dialog[entity.labels[index]].edit_form.model[prop_data.prop]", v-if="prop_data.type !== Number")
            el-form-item(v-for="prop_data in entity.dialog_props_changeable.boolean[entity.labels[index]]", :label="capitalize(prop_data.prop)", :prop="prop_data.prop", :key="prop_data.prop")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog[entity.labels[index]].edit_form.model[prop_data.prop]")
            el-form-item(v-for="prop_data in entity.dialog_props_changeable.selection[entity.labels[index]]", :label="capitalize(prop_data.prop)", :prop="prop_data.prop", :key="prop_data.prop")
              el-select(v-for="sub_index in range(prop_data.default_length)", v-model="dialog[entity.labels[index]].edit_form.model[prop_data.prop][sub_index]", :key="sub_index")
                el-option(v-for="sub_entity in data_to_select(prop_data.prop).slice().sort((e1, e2) => e1.name.localeCompare(e2.name))", :key="sub_entity.id", :value="sub_entity.id", :label="sub_entity.name")
              el-button(size="mini", @click="prop_data.default_length++", v-if="prop_data.extendable") #[el-icon(name="plus")]
        .dialog-footer(slot="footer")
          el-button(@click="dialog[entity.labels[index]].edit_visible = false") Cancel
          el-button(type="primary", :loading="dialog[entity.labels[index]].edit_loading", @click="on_update(entity.labels[index], entity.labels_singular[index])")  OK
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import loading_container from 'components/loading-container'
import entity_list from 'components/entity-list'
import Lazy from 'assets/js/lazy'
import math from 'assets/js/math'
import { validators, not, is_integer, is_nonzero, is_positive, exists } from 'assets/js/form-validator'

export default {
  components: {
    'loading-container': loading_container,
    'entity-list': entity_list
  },
  data () {
    let output = {
      entity: {
        labels: ['teams', 'adjudicators', 'speakers', 'institutions', 'venues'],
        labels_singular: ['team', 'adjudicator', 'speaker', 'institution', 'venue'],
        display_props: {
          teams: ['name', 'available'],
          adjudicators: ['name', 'available'],
          speakers: ['name'],
          institutions: ['name'],
          venues: ['name']
        },
        dialog_props_editable: {
          input: {
            teams: [{
              prop: 'id',
              type: Number
            }, {
              prop: 'name'
            }],
            adjudicators: [{
              prop: 'id',
              type: Number
            }, {
              prop: 'name'
            }],
            speakers: [{
              prop: 'id',
              type: Number
            }, {
              prop: 'name'
            }],
            institutions: [{
              prop: 'id',
              type: Number
            }, {
              prop: 'name'
            }],
            venues: [{
              prop: 'id',
              type: Number
            }, {
              prop: 'name'
            }]
          },
          boolean: {
            teams: [{
              prop: 'available'
            }],
            adjudicators: [{
              prop: 'available'
            }],
            speakers: [],
            institutions: [],
            venues: []
          },
          selection: {
            teams: [{
              prop: 'speakers',
              default_length: 2,
              extendable: true
            }, {
              prop: 'institutions',
              default_length: 1,
              extendable: true
            }],
            adjudicators: [{
              prop: 'institutions',
              default_length: 1,
              extendable: true
            }, {
              label: 'conflicts',
              prop: 'teams',
              default_length: 1,
              extendable: true
            }],
            speakers: [],
            institutions: [],
            venues: []
          }
        },
        dialog_props_unchangeable: {
          input: {
            teams: [{
              prop: 'id'
            }],
            adjudicators: [{
              prop: 'id'
            }],
            speakers: [{
              prop: 'id'
            }],
            institutions: [{
              prop: 'id'
            }],
            venues: [{
              prop: 'id'
            }]
          }
        },
        dialog_props_changeable: {
          input: {
            teams: [{
              prop: 'name'
            }],
            adjudicators: [{
              prop: 'name'
            }],
            speakers: [{
              prop: 'name'
            }],
            institutions: [{
              prop: 'name'
            }],
            venues: [{
              prop: 'name'
            }]
          },
          boolean: {
            teams: [{
              prop: 'available'
            }],
            adjudicators: [{
              prop: 'available'
            }],
            speakers: [],
            institutions: [],
            venues: []
          },
          selection: {
            teams: [{
              prop: 'speakers',
              default_length: 4,
              extendable: true
            }, {
              prop: 'institutions',
              default_length: 2,
              extendable: true
            }],
            adjudicators: [{
              prop: 'institutions',
              default_length: 2,
              extendable: true
            }],
            speakers: [],
            institutions: [],
            venues: []
          }
        }
      },
      team_selected: undefined,
      adjudicator_selected: undefined
    }

    output.dialog = {
      rounds: {
        loading: false,
        edit_loading: false,
        visible: false,
        edit_visible: false,
        form: {
          model: {
            name: '',
            r: '',
            team_allocation_opened: true,
            adjudicator_allocation_opened: true
          }
        },
        edit_form: {
          model: {
            name: '',
            r: '',
            team_allocation_opened: true,
            adjudicator_allocation_opened: true
          }
        }
      },
      compile: {
        visible: false,
        form: {
          model: {
            rs: Array(100).fill(false),
            force: false,
            simple: false
          }
        }
      }
    }
    for (let label of output.entity.labels) {
      let form = {
        model: {},
        rules: {}
      }

      let edit_form = {
        model: {},
        rules: {}
      }

      for (let prop_data of output.entity.dialog_props_editable.input[label]) {
        form.model[prop_data.prop] = ''
      }
      for (let prop_data of output.entity.dialog_props_editable.boolean[label]) {
        form.model[prop_data.prop] = true
      }
      for (let prop_data of output.entity.dialog_props_editable.selection[label]) {
        form.model[prop_data.prop] = Array(100).fill(null)
      }

      for (let prop_data of output.entity.dialog_props_changeable.input[label]) {
        edit_form.model[prop_data.prop] = ''
      }
      for (let prop_data of output.entity.dialog_props_changeable.boolean[label]) {
        edit_form.model[prop_data.prop] = true
      }
      for (let prop_data of output.entity.dialog_props_changeable.selection[label]) {
        edit_form.model[prop_data.prop] = Array(100).fill(null)
      }

      output.dialog[label] = {
        loading: false,
        edit_loading: false,
        visible: false,
        edit_visible: false,
        form,
        edit_form,
        original_form: Object.assign({}, form),
        original_edit_form: Object.assign({}, edit_form),
        editing: null
      }
    }

    return output
  },
  computed: {
    data_to_select () {
      return prop => {
        if (prop === 'speakers') {
          return this.unallocated_speakers
        } else if (prop === 'institutions') {
          return this.target_tournament.institutions
        } else if (prop === 'teams') {
          return this.target_tournament.teams
        } else {
        return []
        }
      }
    },
    ...mapState([
      'auth',
      'loading',
      'adjudicators'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament',
      'unallocated_speakers'
    ])
  },
  methods: {
    range: math.range,
    capitalize (p) {
      return p.charAt(0).toUpperCase() + p.slice(1)
    },
    show (entity, prop) {
      if (entity.hasOwnProperty(prop)) {
        return entity[prop]
      } else {
        return entity.details[0][prop]
      }
    },
    on_allocation_round (selected) {
      this.$router.push({
        path: 'rounds/'+selected.r+'/allocation'
      })
    },
    on_raw_result (selected) {
      this.$router.push({
        path: 'result/raw/'+selected.r
      })
    },
    on_select_round (selected, ev, col) {
      this.$router.push(selected.href)
    },
    on_create_round () {
      this.dialog.rounds.loading = true
      this.$refs.dialog_round.validate((valid) => {
        if (valid) {
          let tournament = this.target_tournament
          let payload = { tournament }
          payload.round = Object.assign({}, this.dialog.rounds.form.model)
          payload.round.r = tournament.rounds.length + 1
          payload.round.href = { path: `/${ tournament.name }/rounds/${ payload.round.r }` }
          this.send_create_round(payload)
          this.dialog.rounds.loading = false
          this.dialog.rounds.visible = false
          //this.$refs.dialog_round.resetFields()
        } else {
          this.dialog.rounds.loading = false
          return false
        }
      })
    },
    async on_send_delete_round (selected) {
      const ans = await this.$confirm('Are you sure?')
      const tournament = this.target_tournament
      if (ans === 'confirm') {
        this.send_delete_round({ tournament, round: selected })
      }
    },
    on_edit_round (selected) {
      console.log('preparing')
      this.dialog.rounds.edit_form.model = Object.assign({}, selected)
      this.dialog.rounds.edit_visible = true
    },
    on_update_round () {
      this.dialog[rounds].edit_loading = true
      const tournament = this.target_tournament
      const round = Object.assign({}, this.dialog.rounds.edit_form.model)
      round.href = { path: `/${ tournament.name }/rounds/${ round.r }` }
      this.send_delete_round({ tournament, round })
      this.send_create_round({ tournament, rounds: [round] })
      this.dialog[rounds].edit_loading = false
      this.dialog[rounds].edit_visible = false
      console.log("preparing")
      //this.$refs.dialog[rounds].edit.resetFields()
    },
    on_compile () {
      let tournament = this.target_tournament
      let model = this.dialog.compile.form.model
      let payload = {
        tournament,
        request: {
          rs: Object.keys(model.rs).filter(r => model.rs[r]).map(parseInt),
          options: {
            simple: model.simple,
            force: model.force
          }
        }
      }
      let ps = model.simple ? this.request_compiled_team_results(payload)
                        : Promise.all([this.request_compiled_team_results(payload), this.request_compiled_speaker_results(payload)])
      ps.then(() => {
          this.dialog.compile.visible = false
          this.$router.push({
            path: 'result/compiled'
          })
      })
    },
    on_select (selected, ev, col) {
      console.log("preparing")
      //this.$router.push(selected.href)
    },
    on_create (label) {
      this.dialog[label].loading = true

      const tournament = this.target_tournament
      let model = this.dialog[label].form.model
      let entity = Object.assign({}, model)
      this.convert_temp_details(entity, label)
      let payload = {
        tournament,
        label
      }
      payload[label] = [entity]
      //team.href = { path: `/${ tournament.name }/${ team.name }` }
      this.send_create_entities(payload)
      this.dialog[label].loading = false
      this.dialog[label].visible = false
      this.dialog[label].form = this.dialog[label].original_form
    },
    on_edit (label, selected) {
      this.dialog[label].editing = selected
      this.transfer(this.dialog[label].edit_form.model, selected)
      this.dialog[label].edit_visible = true
    },
    on_update (label, label_singular) {
      this.dialog[label].edit_loading = true
      let tournament = this.target_tournament
      let model = this.dialog[label].edit_form.model
      let entity = Object.assign(this.dialog[label].editing, model)
      this.convert_temp_details(entity, label)
      let payload = {
        tournament,
        label,
        label_singular
      }
      payload[label_singular] = entity
      this.send_update_entity(payload)
      this.dialog[label].edit_loading = false
      this.dialog[label].edit_visible = false
      this.dialog[label].edit_form = this.dialog[label].original_edit_form
    },
    async on_delete (label, label_singular, selected) {
      const ans = await this.$confirm('Are you sure?')
      const tournament = this.target_tournament
      if (ans === 'confirm') {
        let payload = {
          tournament,
          label,
          label_singular
        }
        payload[label_singular] = {
          id: selected.id
        }
        this.send_delete_entity(payload)
      }
    },
    ...mapActions([
      'send_create_round',
      'send_delete_round',
      'send_create_entities',
      'send_delete_entity',
      'send_update_entity',
      'request_compiled_team_results',
      'request_compiled_speaker_results',
      'init_all'
    ]),
    transfer (to, from) {
      if (from.hasOwnProperty('details')) {
        this.transfer(to, from.details[0])
      }
      for (let key in to) {
        if (from.hasOwnProperty(key)) {
          to[key] = from[key]
        }
      }
    },
    convert_temp_details (entity, label) {
        let tournament = this.target_tournament
        if (label === 'teams') {
          entity.details = this.range(tournament.total_round_num).map(num => {
            return {
              r: num+1,
              speakers: entity.speakers.filter(id => id !== null),
              institutions: entity.institutions.filter(id => id !== null),
              available: entity.available
            }
          })
          delete entity.speakers
          delete entity.institutions
          delete entity.available
        } else if (label === 'adjudicators') {
          entity.details = this.range(tournament.total_round_num).map(num => {
            return {
              r: num+1,
              conflicts: entity.conflicts.filter(id => id !== null),
              institutions: entity.institutions.filter(id => id !== null),
              available: entity.available
            }
          })
          delete entity.conflicts
          delete entity.institutions
          delete entity.available
        } else if (label === 'venues') {
          entity.details = this.range(tournament.total_round_num).map(num => {
            return {
              r: num+1,
              available: model.available
            }
          })
          delete entity.available
        }
    }
  }
}
</script>

<style lang="stylus">
  @import "../../common"

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

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>

<style lang="stylus" scoped>
  .operations
    display flex
    justify-content flex-end
    margin-top 1rem
  legend
    color rgba(0,0,0,.54)
    font-size 90%
</style>
