<template lang="pug">
  .router-view-content
    h1 Welcome!

    loading-container(:loading="loading")
      section
        legend Your Tournaments
        el-table(:data="available_tournaments", @row-click="on_select_tournament", v-if="!loading", empty-text="No Tournaments Available")
          el-table-column(prop="id", label="ID", align="center", :min-width="150")
          el-table-column(prop="name", label="Name", show-overflow-tooltip, align="center")
          el-table-column(prop="style.name", label="Style", align="center", :min-width="100")
          el-table-column(align="right", :min-width="150")
            template(slot-scope="scope")
              el-button(size="small", @click="on_edit(scope.row)") #[el-icon(name="edit")]
              el-button(size="small", type="danger", @click="on_delete(scope.row)") #[el-icon(name="close")]
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
          el-form-item(label="Hidden")
            el-switch(v-model="dialog.create.form.model.user_defined_data.hidden", on-text="", off-text="", :default="false")
      .dialog-footer(slot="footer")
        el-button(@click="dialog.create.visible = false") Cancel
        el-button(type="primary", :loading="dialog.create.loading", @click="on_create") #[el-icon(name="plus", v-if="!dialog.create.loading")] Create
    el-dialog(title="Edit Tournament", :visible.sync="dialog.edit.visible")
      .dialog-body
        el-form(ref="dialog_edit_form", :model="dialog.edit.form.model", :rules="dialog.edit.form.rules")
          el-form-item(label="Name", prop="name")
            el-input(v-model="dialog.edit.form.model.name")
          el-form-item(label="Style", prop="style_id")
            el-select(placeholder="Select style", v-model="dialog.edit.form.model.style_id")
              el-option(v-for="style in styles", :key="style.id", :value="style.id", :label="style.name")
          el-form-item(label="Hidden")
            el-switch(v-model="dialog.edit.form.model.user_defined_data.hidden", on-text="", off-text="", :default="false")
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
              user_defined_data: { hidden: false },
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
          form: {
            model: {
              id: null,
              user_defined_data: { hidden: false },
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
    available_tournaments () {
      return this.tournaments.filter(t => this.auth.tournaments.includes(t.id))
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
      const tournament = Object.assign({}, this.dialog.edit.form.model)
      tournament.style = this.styles.find(s => s.id === tournament.style_id)
      this.dialog.edit.loading = true
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
    on_select_tournament (selected, _, column) {
      if (column.label !== undefined && this.is_organizer(selected)) {
        this.$router.push({ path: `/admin${ this.tournament_href(selected).path }` })
      }
    },
    on_edit (selected) {
      Object.assign(this.dialog.edit.form.model, selected)
      this.dialog.edit.form.model.style_id = selected.style.id
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
