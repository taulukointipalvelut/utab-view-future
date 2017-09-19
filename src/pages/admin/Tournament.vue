<!--
TODO: In edit dialog, need validation
-->
<template lang="pug">
  .router-view-content
    h1 {{ tournament_name }}

    section
      legend Rounds
      loading-container(:loading="loading && !init_flag.rounds")
        el-table(:data="rounds", @row-click="on_select_round")
          el-table-column(prop="round_num", label="No.", width="60", align="right")
          el-table-column(prop="name", label="Name", show-overflow-tooltip)
          el-table-column
            template(scope="scope")
              el-button(size="small", @click="on_edit_round(scope.row)") #[el-icon(name="edit")] Edit
              el-button(size="small", type="danger", @click="on_delete_round(scope.row)") #[el-icon(name="close")] Delete
        .operations
          el-button(type="primary", @click="dialog.round.visible = true") #[el-icon(name="plus")] &nbsp;Add New Round

    section
      legend Teams
      loading-container(:loading="loading && !init_flag.teams")
        el-table(:data="teams", @row-click="on_select_team")
          el-table-column(prop="id", label="ID", width="60", align="right")
          el-table-column(prop="name", label="Name", show-overflow-tooltip)
          el-table-column
            template(scope="scope")
              el-button(size="small", @click="on_edit_team(scope.row)") #[el-icon(name="edit")] Edit
              el-button(size="small", type="danger", @click="on_delete_team(scope.row)") #[el-icon(name="close")] Delete
        .operations
          el-button(type="primary", @click="dialog.team.visible = true") #[el-icon(name="plus")] &nbsp;Add New Team

    el-dialog(title="Add New Round", :visible.sync="dialog.round.visible")
      .dialog-body
        el-form(ref="dialog_round", :model="dialog.round.form.model", :rules="dialog.round.form.rules")
          el-form-item(label="Round No.", prop="round_num")
            el-input(type="number", v-model="dialog.round.form.model.round_num")
          el-form-item(label="Name", prop="name")
            el-input(v-model="dialog.round.form.model.name")
      .dialog-footer(slot="footer")
        el-button(@click="dialog.round.visible = false") Cancel
        el-button(type="primary", :loading="dialog.round.loading", @click="on_create_round()") #[el-icon(name="plus", v-if="!dialog.round.loading")] Create

    el-dialog(title="Edit Round", :visible.sync="dialog.round_edit.visible")
      .dialog-body
        el-form(ref="dialog_round_edit", :model="dialog.round_edit.form.model")
          el-form-item(label="Round No.", prop="round_num")
            el-input(type="number", v-model="dialog.round_edit.form.model.round_num", readonly)
          el-form-item(label="Name", prop="name")
            el-input(v-model="dialog.round_edit.form.model.name")
      .dialog-footer(slot="footer")
        el-button(@click="dialog.round_edit.visible = false") Cancel
        el-button(type="primary", :loading="dialog.round_edit.loading", @click="on_update_round()") OK

    el-dialog(title="Add New Team", :visible.sync="dialog.team.visible")
      .dialog-body
        el-form(ref="dialog_team", :model="dialog.team.form.model", :rules="dialog.team.form.rules")
          el-form-item(label="ID", prop="id")
            el-input(type="number", v-model="dialog.team.form.model.id")
          el-form-item(label="Name", prop="name")
            el-input(v-model="dialog.team.form.model.name")
      .dialog-footer(slot="footer")
        el-button(@click="dialog.team.visible = false") Cancel
        el-button(type="primary", :loading="dialog.team.loading", @click="on_create_team()") #[el-icon(name="plus", v-if="!dialog.team.loading")] Create

    el-dialog(title="Edit Team", :visible.sync="dialog.team_edit.visible")
      .dialog-body
        el-form(ref="dialog_team_edit", :model="dialog.team_edit.form.model")
          el-form-item(label="ID", prop="id")
            el-input(type="number", v-model="dialog.team_edit.form.model.id", readonly)
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
import Lazy from 'assets/js/lazy'
import { validators, not, is_integer, is_nonzero, is_positive, is_exists } from 'assets/js/form-validator'

let p = (...xs) => {
  console.log(...xs)
  return xs.slice(-1)[0]
}

export default {
  components: {
    'loading-container': loading_container
  },
  props: ['tournaments', 'loading', 'tournament_name'],
  data () {
    const this_rounds = new Lazy(() => this.rounds, false)
    const this_teams = new Lazy(() => this.teams, false)
    return {
      init_flag: {
        rounds: false,
        teams: false,
        adjudicators: false
      },
      formData: {
        tournament_name: this.tournament_name
      },
      dialog: {
        round: {
          loading: false,
          visible: false,
          form: {
            model: {
              name: '',
              round_num: ''
            },
            rules: {
              name: [
                { required: true, message: 'Please input Name' },
                { validator: validators(not(is_exists(this_rounds, 'name'))), message: 'This Round Name already exists' }
              ],
              round_num: [
                { required: true, message: 'Please input Round Number' },
                { min: 0, message: 'Round Number must be a positive integer' },
                { validator: validators(is_integer, is_nonzero, is_positive), message: 'Round Number must be a positive integer' },
                { validator: validators(not(is_exists(this_rounds, 'round_num', Number))), message: 'This Round Number already exists' }
              ]
            }
          }
        },
        round_edit: {
          loading: false,
          visible: false,
          form: {
            model: {
              name: '',
              round_num: ''
            }
          }
        },
        team: {
          loading: false,
          visible: false,
          form: {
            model: {
              id: '',
              name: ''
            },
            rules: {
              id: [
                { required: true, message: 'Please input ID' },
                { validator: validators(is_integer, is_nonzero, is_positive), min: 0, message: 'ID must be a positive integer' },
                { validator: validators(not(is_exists(this_teams, 'id', Number))), message: 'This ID already exists' }
              ],
              name: [
                { required: true, message: 'Please input Name' },
                { validator: validators(not(is_exists(this_teams, 'name'))), message: 'This Name already exists' }
              ]
            }
          }
        },
        team_edit: {
          loading: false,
          visible: false,
          form: {
            model: {
              id: '',
              name: ''
            }
          }
        }
      }
    }
  },
  computed: {
    has_rounds () {
      return this.rounds && this.rounds.length > 0
    },
    has_teams () {
      return this.teams && this.teams.length > 0
    },
    ...mapState([
      'auth',
      'rounds',
      'teams',
      'adjudicators'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament'/*,
      'target_round'*/
    ])
  },
  methods: {
    on_select_round (selected, ev, col) {
      this.$router.push(selected.href)
    },
    on_create_round () {
      this.dialog.round.loading = true
      this.$refs.dialog_round.validate((valid) => {
        if (valid) {
          const tournament = this.target_tournament
          const round = Object.assign({}, this.dialog.round.form.model)
          round.href = { path: `/${ tournament.tournament_name }/${ round.round_num }` }
          this.add_round({ tournament, round })
          this.dialog.round.loading = false
          this.dialog.round.visible = false
          this.$refs.dialog_round.resetFields()
        } else {
          this.dialog.round.loading = false
          return false
        }
      })
    },
    async on_delete_round (selected) {
      const ans = await this.$confirm('Are you sure?')
      const tournament = this.target_tournament
      if (ans) {
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
      round.href = { path: `/${ tournament.tournament_name }/${ round.round_num }` }
      this.delete_round({ tournament, round })
      this.add_round({ tournament, round })
      this.dialog.round_edit.loading = false
      this.dialog.round_edit.visible = false
      this.$refs.dialog_round_edit.resetFields()
    },
    on_select_team (selected, ev, col) {
      console.log(selected)
      this.$router.push(selected.href)
    },
    on_create_team () {
      this.dialog.team.loading = true
      this.$refs.dialog_team.validate((valid) => {
        if (valid) {
          const tournament = this.target_tournament
          const team = Object.assign({}, this.dialog.team.form.model)
          team.href = { path: `/${ tournament.tournament_name }/${ team.name }` }
          this.add_team({ tournament, team })
          this.dialog.team.loading = false
          this.dialog.team.visible = false
          this.$refs.dialog_team.resetFields()
        } else {
          this.dialog.team.loading = false
          return false
        }
      })
    },
    async on_delete_team (selected) {
      const ans = await this.$confirm('Are you sure?')
      const tournament = this.target_tournament
      if (ans) {
        this.delete_team({ tournament, team: selected })
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
      team.href = { path: `/${ tournament.tournament_name }/${ team.name }` }
      this.delete_team({ tournament, team })
      this.add_team({ tournament, team })
      this.dialog.team_edit.loading = false
      this.dialog.team_edit.visible = false
      this.$refs.dialog_team_edit.resetFields()
    },
    ...mapMutations([
      'add_round',
      'delete_round',
      'add_adjudicator',
      'delete_adjudicator',
      'add_team',
      'delete_team'
    ]),
    ...mapActions([
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
