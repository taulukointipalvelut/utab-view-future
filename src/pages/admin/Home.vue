<template lang="pug">
  .router-view-content
    h1 Welcome!

    loading-container(:loading="loading")
      section
        legend Tournaments
        el-table(:data="tournaments", @row-click="on_select_tournament", :row-class-name="row_class_name", v-if="!loading && has_tournaments")
          el-table-column(prop="id", label="ID", align="center")
          el-table-column(prop="name", label="Name", show-overflow-tooltip, align="center")
          el-table-column(prop="style.name", label="Style", align="center")
          //el-table-column(label="Rounds", width="100", align="right")
            template(slot-scope="scope")
              span {{ num_of_rounds(scope.row.current_round_num, scope.row.total_round_num) }}
          el-table-column(align="right")
            template(slot-scope="scope")
              //el-button(size="small", @click="on_edit(scope.row)", :disabled="auth.usertype !== 'superuser' && !auth.tournaments.includes(scope.row.id)") #[el-icon(name="edit")] Edit
              el-button(size="small", type="danger", @click="on_delete(scope.row)", :disabled="auth.usertype !== 'superuser' && !auth.tournaments.includes(scope.row.id)") #[el-icon(name="close")]
        span(v-if="!loading && !has_tournaments") No Tournaments Available
      .operations(v-if="!loading")
        el-button(type="primary", @click="on_new_tournament") #[el-icon(name="plus")] &nbsp;Create New Tournament

    el-dialog(title="Create New Tournament", :visible.sync="dialog.create.visible")
      .dialog-body
        el-form(ref="dialog_create_form", :model="dialog.create.form.model", :rules="dialog.create.form.rules")
          el-form-item(label="Name", prop="name")
            el-input(v-model="dialog.create.form.model.name")
          el-form-item(label="Style", prop="style_id")
            el-select(placeholder="Select style", v-model="dialog.create.form.model.style_id")
              el-option(v-for="style in styles", :key="style.id", :value="style.id", :label="style.name")
      .dialog-footer(slot="footer")
        el-button(@click="dialog.create.visible = false") Cancel
        el-button(type="primary", :loading="dialog.create.loading", @click="on_create") #[el-icon(name="plus", v-if="!dialog.create.loading")] Create
    //el-dialog(title="Edit Tournament", :visible.sync="dialog.edit.visible")
      .dialog-body
        el-form(ref="dialog_edit_form", :model="dialog.edit.form.model", :rules="dialog.edit.form.rules")
          h3 Warning: Changing tournament name can make users unable to access the tournament.
          el-form-item(label="Name", prop="name")
            el-input(v-model="dialog.edit.form.model.name")
          el-form-item(label="Style", prop="style_id")
            el-select(placeholder="Select style", v-model="dialog.edit.form.model.style_id")
              el-option(v-for="style in styles", :key="style.id", :value="style.id", :label="style.name")
      .dialog-footer(slot="footer")
        el-button(@click="dialog.edit.visible = false") Cancel
        el-button(type="primary", :loading="dialog.edit.loading", @click="on_update") #[el-icon(name="plus", v-if="!dialog.edit.loading")] OK
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  components: {
    'loading-container': loading_container
  },
  data () {
    return {
      dialog: {
        create: {
          loading: false,
          visible: false,
          form: {
            model: {
              name: '',
              style_id: null
            },
            rules: {
              name: [
                { required: true, message: 'Please input Tournamrnt Name' }
              ],
              style_id: [
                { required: true, message: 'Please select Tournamrnt\'s Style' }
              ]
            }
          }
        },
        edit: {
          loading: false,
          visible: false,
          id: null,
          form: {
            model: {
              name: '',
              style_id: null
            },
            rules: {
              name: [
                { required: true, message: 'Please input Tournamrnt Name' }
              ],
              style_id: [
                { required: true, message: 'Please select Tournamrnt\'s Style' }
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
      'auth',
      'loading',
      'tournaments',
      'styles'
    ]),
    ...mapGetters([
      'target_tournament',
      'is_organizer',
      'tournament_href'
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
    /*num_of_rounds (current, total) {
      if (!total) {
        return ''
      } else if (!current) {
        return total
      } else {
        return `${ current } / ${ total }`
      }
    },*/
    on_new_tournament () {
      this.dialog.create.loading = false
      this.dialog.create.visible = true
    },
    on_create () {
      this.dialog.create.loading = true
      this.$refs.dialog_create_form.validate((valid) => {
        if (valid) {
          const tournament = Object.assign({}, this.dialog.create.form.model)
          tournament.style = this.styles.find(s => s.id === tournament.style_id)
          delete tournament.style_id
          this.send_create_tournament({ tournament })
              .then(t => {
                  this.init_one({ tournament: t })
                      .then(() => {
                          this.dialog.create.loading = false
                          this.dialog.create.visible = false
                      })
              })
        } else {
          this.dialog.create.loading = false
          return false
        }
      })
    },
    on_update () {
      this.dialog.edit.loading = true
      const tournament = {
        id: this.dialog.edit.id,
        name: this.dialog.edit.form.model.name
      }
      tournament.style = this.styles.find(s => s.id === tournament.style_id)
      this.send_update_tournament({ tournament })
          .then(() => {
              this.dialog.edit.loading = false
              this.dialog.edit.visible = false
          })
    },
    async on_delete (selected) {
      const ans = await this.$confirm('Are you sure?')
      if (ans === 'confirm') {
        await this.send_delete_tournament({ tournament: selected })
          //.then(this.init_tournaments)
          .then(() => {
            this.$router.push('/admin')
          })
      }
    },
    on_select_tournament (selected) {
      if (this.is_organizer(selected)) {
        this.$router.push({ path: `/admin${ this.tournament_href(selected).path }` })
      }
    },
    on_edit (selected) {
      this.dialog.edit.id = selected.id
      this.dialog.edit.form.model.name = selected.name
      this.dialog.edit.form.model.style_id = selected.style.id
      this.dialog.edit.loading = false
      this.dialog.edit.visible = true
    },
    ...mapMutations([
    ]),
    ...mapActions([
      'send_create_tournament',
      'send_delete_tournament',
      'send_update_tournament',
      'init_tournaments',
      'init_one'
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
  button.el-button
    margin-right 1rem
    margin-left 0

  legend
    color rgba(0,0,0,.54)
    font-size 90%
</style>
