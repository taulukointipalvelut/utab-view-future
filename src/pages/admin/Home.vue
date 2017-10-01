<template lang="pug">
  .router-view-content
    h1 Welcome!

    loading-container(:loading="loading")
      section
        legend Tournaments
        el-table(:data="tournaments", @current-change="on_select_tournament", :row-class-name="row_class_name", v-if="!loading && has_tournaments")
          el-table-column(prop="id", label="ID", width="60", align="center")
          el-table-column(prop="name", label="Name", show-overflow-tooltip)
          el-table-column(prop="style.name", label="Style")
          el-table-column(label="Rounds", width="100", align="right")
            template(scope="scope")
              span {{ num_of_rounds(scope.row.current_round_num, scope.row.total_round_num) }}
          el-table-column
            template(scope="scope")
              el-button(size="small", @click="on_edit(scope.row)") #[el-icon(name="edit")] Edit
              el-button(disabled, size="small", type="danger", @click="on_delete(scope.row)") #[el-icon(name="close")] Delete
        span(v-if="!loading && !has_tournaments") No Tournaments Available
      .operations(v-if="!loading")
        el-button(type="primary", @click="on_new_tournament") #[el-icon(name="plus")] &nbsp;Create New Tournament

      section
        legend Styles
        span(v-if="!loading") No Styles Available
      .operations(v-if="!loading")
        el-button(disabled, type="primary") #[el-icon(name="plus")] &nbsp;Define New Style

    el-dialog(title="Create New Tournament", :visible.sync="dialog.create.visible")
      .dialog-body
        el-form(ref="dialog_create_form", :model="dialog.create.form.model", :rules="dialog.create.form.rules")
          el-form-item(label="ID", prop="id")
            el-input(type="number", :value="dialog.create.form.model.id", @input="value => dialog.create.form.model.id = parseInt(value)")
          el-form-item(label="Name", prop="name")
            el-input(v-model="dialog.create.form.model.name")
          el-form-item(label="Style", prop="style_name")
            el-select(placeholder="Select style", v-model="dialog.create.form.model.style_name", disabled)
              el-option(label="PDA", value="PDA")
          el-form-item(label="Number of Rounds", prop="total_round_num")
            el-input(type="number", :value="dialog.create.form.model.total_round_num", @input="value => dialog.create.form.model.total_round_num = parseInt(value)")
      .dialog-footer(slot="footer")
        el-button(@click="dialog.create.visible = false") Cancel
        el-button(type="primary", :loading="dialog.create.loading", @click="on_create") #[el-icon(name="plus", v-if="!dialog.create.loading")] Create
    el-dialog(title="Edit Tournament", :visible.sync="dialog.edit.visible")
      .dialog-body
        el-form(ref="dialog_edit_form", :model="dialog.edit.form.model", :rules="dialog.edit.form.rules")
          el-form-item(label="ID", prop="id")
            el-input(type="number", v-model="dialog.edit.form.model.id")
          el-form-item(label="Name", prop="name")
            el-input(v-model="dialog.edit.form.model.name")
          el-form-item(label="Style", prop="style_name")
            el-select(placeholder="Select style", v-model="dialog.edit.form.model.style_name", disabled)
              el-option(label="PDA", value="PDA")
          el-form-item(label="Number of Rounds", prop="total_round_num")
            el-input(type="number", v-model="dialog.edit.form.model.total_round_num")
      .dialog-footer(slot="footer")
        el-button(@click="dialog.edit.visible = false") Cancel
        el-button(type="primary", :loading="dialog.edit.loading", @click="on_create") #[el-icon(name="plus", v-if="!dialog.edit.loading")] OK
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  components: {
    'loading-container': loading_container
  },
  props: ['tournaments', 'loading'],
  data () {
    return {
      dialog: {
        create: {
          loading: false,
          visible: false,
          form: {
            model: {
              id: '',
              name: '',
              style_name: '',
              total_round_num: ''
            },
            rules: {
              id: [
                { required: true, message: 'Please input Tournament ID' },
                { type: 'integer', min: 0, message: 'Tournament ID must be a positive integer' }
              ],
              name: [
                { required: true, message: 'Please input Tournamrnt Name' }
              ],
              style_name: [
                { required: false, message: 'Please select Tournamrnt\'s Style' }
              ],
              total_round_num: [
                { required: true, message: 'Please input Number of Rounds' },
                { type: 'integer', min: 0, message: 'Number of Rounds must be a positive integer' }
              ]
            }
          }
        },
        edit: {
          loading: false,
          visible: false,
          form: {
            model: {
              id: '',
              name: '',
              style_name: '',
              total_round_num: ''
            },
            rules: {
              id: [
                { required: true, message: 'Please input Tournament ID' },
                { type: 'integer', min: 0, message: 'Tournament ID must be a positive integer' }
              ],
              name: [
                { required: true, message: 'Please input Tournamrnt Name' }
              ],
              style_name: [
                { required: true, message: 'Please select Tournamrnt\'s Style' }
              ],
              total_round_num: [
                { required: true, message: 'Please input Number of Rounds' },
                { type: 'integer', min: 0, message: 'Number of Rounds must be a positive integer' }
              ]
            }
          }
        }
      }
    }
  },
  computed: {
    has_tournaments () {
      return this.tournaments && this.tournaments.length > 0
    },
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'isAuth'
    ])
  },
  methods: {
    row_class_name (row, index): string {
      let class_name = 'row'
      if (row.done) {
        class_name += ' done'
      }
      return class_name
    },
    num_of_rounds (current, total) {
      if (!total) {
        return ''
      } else if (!current) {
        return total
      } else {
        return `${ current } / ${ total }`
      }
    },
    on_new_tournament () {
      this.dialog.create.loading = false
      this.dialog.create.visible = true
    },
    on_create () {
      this.dialog.create.loading = true
      this.$refs.dialog_create_form.validate((valid) => {
        if (valid) {
          const tournament = Object.assign({}, this.dialog.create.form.model)
          tournament.style = {
            id: "PDA3",
            name: "PDA3",
            team_num: 2,
            score_weights: [1, 0.5, 0.5, 1]
          }//{ name: this.dialog.create.form.model.style_name }
          tournament.href = { path: `/${ tournament.name }` }
          tournament.name = tournament.name
          this.send_tournament({ tournament: tournament })
          this.dialog.create.loading = false
          this.dialog.create.visible = false
        } else {
          this.dialog.create.loading = false
          return false
        }
      })
    },
    async on_delete (selected) {
      const ans = await this.$confirm('Are you sure?')
      if (ans === 'confirm') {
        this.delete_tournament({ tournament: selected })
      }
    },
    on_select_tournament (selected) {
      const path = selected.href.path
      let href = Object.assign({}, selected.href)
      href.path = path.includes('/adimn') ? path : `/admin${ path }`
      this.$router.push(href)
    },
    on_edit (selected) {
      this.dialog.edit.loading = false
      this.dialog.edit.visible = true
    },
    ...mapMutations([
    ]),
    ...mapActions([
      'send_tournament',
      'delete_tournament'
    ])
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
