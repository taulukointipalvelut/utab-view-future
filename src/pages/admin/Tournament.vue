<!--
TODO: Edit dialog needs validation
-->
<template lang="pug">
  .router-view-content
    h1 {{ tournament_name }}
    loading-container(:loading="loading")
      el-tabs(type="card")
        el-tab-pane(label="Rounds")
          loading-container(:loading="!init_flag.rounds")
            el-table(:data="target_tournament.rounds.slice().sort((r1, r2) => r1.r > r2.r ? 1 : -1)", @row-click="on_select_round")
              el-table-column(prop="r", label="No.", width="60", align="center")
              el-table-column(prop="round_name", label="Name", show-overflow-tooltip)
              el-table-column
                template(scope="scope")
                  el-button(size="small", @click="on_edit_round(scope.row)", disabled) #[el-icon(name="edit")] Edit
                  el-button(size="small", type="danger", @click="on_delete_round(scope.row)", disabled) #[el-icon(name="close")] Delete
                  el-button(size="small", @click="on_result_round(scope.row)") #[el-icon(name="information")] Result
                  el-button(size="small", @click="on_allocation_round(scope.row)") #[el-icon(name="menu")] Allocation
            .operations
              el-dropdown(@command="handle_compiled_command")
                el-button.compiled Compiled Results #[el-icon(name="caret-bottom")]
                el-dropdown-menu(slot="dropdown")
                  el-dropdown-item(v-for="round in target_tournament.rounds", :key="round.r", :command="String(round.r)") {{ round.round_name }}
              el-button(type="primary", @click="dialog.rounds.visible = true") #[el-icon(name="plus")] &nbsp;Add New Round

        el-tab-pane(v-for="index in range(5)", :label="capitalize(entity.labels[index])", :key="index")
          loading-container(:loading="!init_flag[entity.labels[index]]")
            el-table(:data="target_tournament[entity.labels[index]].slice().sort((t1, t2) => t1.id > t2.id ? 1 : -1)", @row-click="on_select_team")
              el-table-column(prop="id", label="ID", show-overflow-tooltip, align="center", sortable)
              el-table-column(v-for="prop in entity.display_props[entity.labels[index]]", :label="capitalize(prop)", align="center", :key="prop", sortable)
                template(scope="scope")
                  span {{ show(scope.row[prop]) }}
              el-table-column
                template(scope="scope")
                  el-button(size="small", @click="on_edit('team', scope.row)") #[el-icon(name="edit")] Edit
                  el-button(size="small", type="danger", @click="on_delete('team', scope.row)") #[el-icon(name="close")] Delete
            .operations
              el-button(type="primary", @click="dialog[entity.labels[index]].visible = true") #[el-icon(name="plus")] &nbsp;Add New {{ capitalize(entity.labels_singular[index]) }}

      el-dialog(title="Add New Round", :visible.sync="dialog.rounds.visible")
        .dialog-body
          el-form(ref="dialog_round", :model="dialog.rounds.form.model", :rules="dialog.rounds.form.rules")
            h3(align="center") Round {{ target_tournament.rounds.length + 1 }}
            el-form-item(label="Name", prop="name")
              el-input(v-model="dialog.rounds.form.model.round_name")
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
              el-input(v-model="dialog.round_edit.form.model.round_name")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.round_edit.visible = false") Cancel
          el-button(type="primary", :loading="dialog.round_edit.loading", @click="on_update_round()") OK

      el-dialog(v-for="index in range(5)", :title="'Add New '+capitalize(entity.labels_singular[index])", :visible.sync="dialog[entity.labels[index]].visible", :key="index")
        .dialog-body
          el-form(:model="dialog[entity.labels[index]].form.model", :rules="dialog[entity.labels[index]].form.rules")
            el-form-item(v-for="prop_data in entity.dialog_props_editable.string[entity.labels[index]]", :label="capitalize(prop_data.prop)", :prop="prop_data.prop", :key="prop_data.prop")
              el-input(v-model="dialog[entity.labels[index]].form.model[prop_data.prop]")
            el-form-item(v-for="prop_data in entity.dialog_props_editable.boolean[entity.labels[index]]", :label="capitalize(prop_data.prop)", :prop="prop_data.prop", :key="prop_data.prop")
              el-switch(:default="true", on-text="", off-text="", v-model="dialog[entity.labels[index]].form.model[prop_data.prop]")
            el-form-item(v-for="prop_data in entity.dialog_props_editable.selection[entity.labels[index]]", :label="capitalize(prop_data.prop)", :prop="prop_data.prop", :key="prop_data.prop")
              el-select(v-for="sub_index in range(prop_data.hasOwnProperty('maximum') ? prop_data.maximum : 1)", v-model="dialog[entity.labels[index]].form.model[prop_data.prop][sub_index]", :key="sub_index")
                el-option(v-for="sub_entity in data_to_select(prop_data.prop)", :key="sub_entity.id", :value="sub_entity.id", :label="sub_entity.name")
        .dialog-footer(slot="footer")
          el-button(@click="dialog[entity.labels[index]].visible = false") Cancel
          el-button(type="primary", :loading="dialog[entity.labels[index]].loading", @click="on_create(entity.labels[index])") #[el-icon(name="plus", v-if="!dialog[entity.labels[index]].loading")] Create
      //el-dialog(title="Edit Team", :visible.sync="dialog.team_edit.visible")
        .dialog-body
          el-form(ref="dialog_team_edit", :model="dialog.team_edit.form.model")
            el-form-item(label="Name", prop="name")
              el-input(v-model="dialog.team_edit.form.model.name")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.team_edit.visible = false") Cancel
          el-button(type="primary", :loading="dialog.team_edit.loading", @click="on_update_team()") OK
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import loading_container from 'components/loading-container'
import entity_list from 'components/entity-list'
import Lazy from 'assets/js/lazy'
import { validators, not, is_integer, is_nonzero, is_positive, exists } from 'assets/js/form-validator'

let p = (...xs) => {
  console.log(...xs)
  return xs.slice(-1)[0]
}

export default {
  components: {
    'loading-container': loading_container,
    'entity-list': entity_list
  },
  props: ['tournaments', 'loading', 'tournament_name'],
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
          string: {
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
              maximum: 4
            }, {
              prop: 'institutions',
              maximum: 4
            }],
            adjudicators: [{
              prop: 'institutions',
              maximum: 4
            }],
            speakers: [],
            institutions: [],
            venues: []
          }
        },
        dialog_props_unchangeable: {},
        dialog_props_changeable: {}
      },
      team_selected: undefined,
      adjudicator_selected: undefined,
      init_flag: {
        rounds: false,
        teams: false,
        adjudicators: false,
        institutions: false,
        venues: false,
        speakers: false
      }
    }

    output.dialog = {
      rounds: {
        loading: false,
        visible: false,
        form: {
          model: {
            round_name: '',
            team_allocation_opened: true,
            adjudicator_allocation_opened: true
          }
        }
      }
    }
    for (let label of output.entity.labels) {
      let form = {
        model: {},
        rules: {}
      }

      for (let prop_data of output.entity.dialog_props_editable.string[label]) {
        form.model[prop_data.prop] = ''
      }
      for (let prop_data of output.entity.dialog_props_editable.boolean[label]) {
        form.model[prop_data.prop] = true
      }
      for (let prop_data of output.entity.dialog_props_editable.selection[label]) {
        form.model[prop_data.prop] = Array(prop_data.hasOwnProperty('maximum') ? prop_data.maximum : 1).fill(null)
      }

      output.dialog[label] = {
        loading: false,
        visible: false,
        form
      }
    }

    return output
  },
  computed: {
    data_to_select () {
      return label => {
        if (label === 'speakers') {
          return this.unallocated_speakers
        } else if (label === 'institutions') {
          return this.target_tournament.institutions
        } else {
        return []
        }
      }
    },
    has_rounds () {
      return this.target_tournament.rounds && this.target_tournament.rounds.length > 0
    },
    ...mapState([
      'auth',
      'adjudicators'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament',
      'unallocated_speakers'
    ])
  },
  methods: {
    range (len) {
      return [...Array(len).keys()]
    },
    capitalize (p) {
      return p.charAt(0).toUpperCase() + p.slice(1)
    },
    show (p) {
      if (p === true) {
        return 'Yes'
      } else if (p === false) {
        return 'No'
      } else {
        return p
      }
    },
    handle_compiled_command (r_str) {
      this.$router.push({
        path: 'rounds/'+r_str+'/result/compiled'
      })
    },
    on_allocation_round (selected) {
      this.$router.push({
        path: 'rounds/'+selected.r+'/allocation'
      })
    },
    on_result_round (selected) {
      this.$router.push({
        path: 'rounds/'+selected.r+'/result'
      })
    },
    on_select_round (selected, ev, col) {
      this.$router.push(selected.href)
    },
    on_create_round () {
      this.dialog.rounds.loading = true
      this.$refs.dialog_round.validate((valid) => {
        if (valid) {
          const tournament = this.target_tournament
          const round = Object.assign({}, this.dialog.rounds.form.model)
          round.r = tournament.rounds.length + 1
          round.href = { path: `/${ tournament.tournament_name }/rounds/${ round.r }` }
          this.add_rounds({ tournament, rounds: [round] })
          this.dialog.rounds.loading = false
          this.dialog.rounds.visible = false
          this.$refs.dialog_round.resetFields()
        } else {
          this.dialog.rounds.loading = false
          return false
        }
      })
    },
    async on_delete_round (selected) {
      const ans = await this.$confirm('Are you sure?')
      const tournament = this.target_tournament
      if (ans === 'confirm') {
        this.delete_round({ tournament, round: selected })
      }
    },
    on_edit_round (selected) {
      this.dialog.round_edit.form.model = Object.assign({}, selected)
      this.dialog.round_edit.visible = true
    },
    on_update_round () {
      this.dialog.round_edit.loading = true
      const tournament = this.target_tournament
      const round = Object.assign({}, this.dialog.round_edit.form.model)
      round.href = { path: `/${ tournament.tournament_name }/rounds/${ round.r }` }
      this.delete_round({ tournament, round })
      this.add_rounds({ tournament, rounds: [round] })
      this.dialog.round_edit.loading = false
      this.dialog.round_edit.visible = false
      this.$refs.dialog_round_edit.resetFields()
    },
    on_select_team (selected, ev, col) {
      this.team_selected = selected
      //this.$router.push(selected.href)
    },
    on_create () {
      this.dialog.teams.loading = true
      this.$refs.dialog_team.validate((valid) => {
        if (valid) {
          const tournament = this.target_tournament
          let team = {
            name: this.dialog.teams.form.model.name,
            id: this.dialog.teams.form.model.id,
            details: [...Array(this.target_tournament.total_round_num).keys()].map(num => {
              return {
                r: num+1,
                speakers: this.dialog.teams.form.model.speakers.filter(id => id !== null),
                institutions: this.dialog.teams.form.model.institutions.filter(id => id !== null),
                available: this.dialog.teams.form.model.available
              }
            })
          }
          //team.href = { path: `/${ tournament.tournament_name }/${ team.name }` }
          this.add_teams({ tournament, teams: [team] })
          this.dialog.teams.loading = false
          this.dialog.teams.visible = false
          this.$refs.dialog_team.resetFields()
        } else {
          this.dialog.teams.loading = false
          return false
        }
      })
    },
    on_create_team () {
      this.dialog.teams.loading = true
      this.$refs.dialog_team.validate((valid) => {
        if (valid) {
          const tournament = this.target_tournament
          let team = {
            name: this.dialog.teams.form.model.name,
            id: this.dialog.teams.form.model.id,
            details: [...Array(this.target_tournament.total_round_num).keys()].map(num => {
              return {
                r: num+1,
                speakers: this.dialog.teams.form.model.speakers.filter(id => id !== null),
                institutions: this.dialog.teams.form.model.institutions.filter(id => id !== null),
                available: this.dialog.teams.form.model.available
              }
            })
          }
          //team.href = { path: `/${ tournament.tournament_name }/${ team.name }` }
          this.add_teams({ tournament, teams: [team] })
          this.dialog.teams.loading = false
          this.dialog.teams.visible = false
          this.$refs.dialog_team.resetFields()
        } else {
          this.dialog.teams.loading = false
          return false
        }
      })
    },
    async on_delete_team (selected) {
      const ans = await this.$confirm('Are you sure?')
      const tournament = this.target_tournament
      if (ans === 'confirm') {
        this.delete_team({ tournament, team: this.team_selected })
      }
    },
    on_edit_team (selected) {
      this.dialog.team_edit.form.model = Object.assign({}, selected)
      this.dialog.team_edit.visible = true
    },
    on_update_team () {
      this.dialog.team_edit.loading = true
      const tournament = this.target_tournament
      const team = Object.assign({}, this.dialog.team_edit.form.model)
      //team.href = { path: `/${ tournament.tournament_name }/${ team.name }` }
      this.delete_team({ tournament, team })
      this.add_team({ tournament, team })
      this.dialog.team_edit.loading = false
      this.dialog.team_edit.visible = false
      this.$refs.dialog_team_edit.resetFields()
    },
    on_select_adjudicator (selected, ev, col) {
      this.adjudicator_selected = selected
    },
    on_create_adjudicator () {
      this.dialog.adjudicators.loading = true
      this.$refs.dialog_adjudicator.validate((valid) => {
        if (valid) {
          const tournament = this.target_tournament
          const adjudicator = Object.assign({}, this.dialog.adjudicators.form.model)
          //adjudicator.href = { path: `/${ tournament.tournament_name }/${ adjudicator.name }` }
          this.add_adjudicators({ tournament, adjudicators: [adjudicator] })
          this.dialog.adjudicators.loading = false
          this.dialog.adjudicators.visible = false
          this.$refs.dialog_adjudicator.resetFields()
        } else {
          this.dialog.adjudicators.loading = false
          return false
        }
      })
    },
    async on_delete_adjudicator (selected) {
      const ans = await this.$confirm('Are you sure?')
      const tournament = this.target_tournament
      if (ans === 'confirm') {
        this.delete_adjudicator({ tournament, adjudicator: this.adjudicator_selected })
      }
    },
    ...mapActions([
      'add_rounds',
      'delete_round',
      'add_teams',
      'delete_team',
      'add_adjudicators',
      'delete_adjudicator',
      'init_rounds',
      'init_adjudicators',
      'init_teams'
    ])
  },
  mounted () {
    const tournament = this.target_tournament
    this.init_rounds({ tournament }).then(() => {
      this.init_flag.rounds = true
    })
    this.init_adjudicators({ tournament }).then(() => {
      this.init_flag.adjudicators = true
    })
    this.init_teams({ tournament }).then(() => {
      this.init_flag.teams = true
    })
    setTimeout(() => {
      this.init_flag.institutions = true
      this.init_flag.venues = true
      this.init_flag.speakers = true
    }, 1000)
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
