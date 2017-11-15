<template lang="pug">
  .router-view-content
    h1 Welcome!

    section
      legend Your Tournaments
      el-table(:data="available_tournaments", @row-click="on_select_tournament", empty-text="No Tournaments Available")
        el-table-column(prop="id", label="ID", align="center", :min-width="150")
        el-table-column(label="Name", show-overflow-tooltip, align="center")
          template(slot-scope="scope")
            span(:class="{ 'tournament-hidden': scope.row.user_defined_data.hidden }") {{ scope.row.name }}
        el-table-column(prop="style.name", label="Style", align="center", :min-width="100")
        el-table-column(align="right", :min-width="150")
          template(slot-scope="scope")
            el-button(size="small", @click="on_edit(scope.row)") #[el-icon(name="edit")]
            el-button(size="small", type="danger", @click="on_delete(scope.row)") #[el-icon(name="close")]
    .operations
      el-button(type="primary", @click="on_new_tournament") #[el-icon(name="plus")] &nbsp;Create New Tournament

    el-dialog(v-for="type in ['create', 'edit']", :key="type", :title="capitalize(type)+' New Tournament'", :visible.sync="dialog[type].visible")
      .dialog-body
        el-form(:model="dialog[type].form.model", :rules="dialog[type].form.rules")
          el-form-item(label="Name", prop="name")
            el-input(v-model="dialog[type].form.model.name")
          el-form-item(label="Style", prop="style_id")
            el-select(placeholder="Select style", v-model="dialog[type].form.model.style_id")
              el-option(v-for="style in styles", :key="style.id", :value="style.id", :label="style.name")
          el-form-item(label="Hidden")
            el-switch(v-model="dialog[type].form.model.user_defined_data.hidden", active-text="", inactive-text="", :default="false")
          //div(v-for="label_singular in ['audience', 'speaker', 'adjudicator']", :key="label_singular")
            el-form-item(:label="capitalize(label_singular)+' Login Required'")
              el-switch(v-model="dialog[type].form.model.auth[label_singular].required", active-text="", inactive-text="", :default="false")
            el-form-item(:label="capitalize(label_singular)+' Login Key'", v-if="dialog[type].form.model.auth[label_singular].required")
              el-input(v-model="dialog[type].form.model.auth[label_singular].key", disabled)
      .dialog-footer(slot="footer")
        el-button(@click="dialog[type].visible = false") Cancel
        el-button(type="primary", :loading="dialog.create.loading", @click="on_create", v-if="type === 'create'") #[el-icon(name="plus", v-if="!dialog[type].loading")] Create
        el-button(type="primary", :loading="dialog.edit.loading", @click="on_update", v-if="type === 'edit'") #[el-icon(name="plus", v-if="!dialog.edit.loading")] OK
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import math from 'assets/js/math'

export default {
  data () {
    return {
      dialog: {
        create: {
          loading: false,
          visible: false,
          form: {
            model: {
              user_defined_data: {
                hidden: false
              },
              name: '',
              style_id: null,
              auth: {
                adjudicator: {
                  key: '',
                  required: false
                },
                speaker: {
                  key: '',
                  required: false
                },
                audience: {
                  key: '',
                  required: false
                }
              }
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
              user_defined_data: {
                hidden: false
              },
              name: '',
              style_id: null,
              auth: {
                adjudicator: {
                  key: '',
                  required: false
                },
                speaker: {
                  key: '',
                  required: false
                },
                audience: {
                  key: '',
                  required: false
                }
              }
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
      if (this.auth.usertype === 'superuser') {
        return this.tournaments
      } else {
        return this.tournaments.filter(t => this.auth.tournaments.includes(t.id))
      }
    },
    ...mapState([
      'auth',
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
    capitalize: math.capitalize,
    on_new_tournament () {
      this.dialog.create.loading = false
      this.dialog.create.visible = true
    },
    async on_create () {
      this.dialog.create.loading = true
      const tournament = Object.assign({}, this.dialog.create.form.model)
      tournament.style = this.styles.find(s => s.id === tournament.style_id)
      delete tournament.style_id
      let t = await this.send_create_tournament({ tournament })
      for (let usertype of ['speaker', 'adjudicator', 'audience']) {
        let username = t.id + usertype
        let password = this.dialog.create.form.model.auth[usertype].key
        if (this.dialog.create.form.model.auth[usertype].required) {
          this.send_create_user({ tournament: { id: t.id }, username, password, usertype })
        }
      }
      this.dialog.create.loading = false
      this.dialog.create.visible = false
    },
    async on_update () {
      this.dialog.edit.loading = true
      const tournament = Object.assign({}, this.dialog.edit.form.model)
      tournament.style = this.styles.find(s => s.id === tournament.style_id)
      await this.send_update_tournament({ tournament })
      for (let usertype of ['speaker', 'adjudicator', 'audience']) {
        let username = tournament.id + usertype
        let password = this.dialog.edit.form.model.auth[usertype].key
        if (this.dialog.edit.form.model.auth[usertype].required) {
          this.send_create_user({ tournament: { id: tournament.id }, username, password, usertype })
        }
      }
      this.dialog.edit.loading = false
      this.dialog.edit.visible = false
    },
    async on_delete (selected) {
      const ans = await this.$confirm('Are you sure? You can NOT undo this operation. All data related to '+selected.name+' will be removed from database.')
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
      'send_create_user',
      'init_tournaments'
    ])
  }
}
</script>

<style lang="stylus">
  @import "../../common"

  .tournament-hidden
    color rgb(160, 160, 160)

</style>

<style lang="stylus" scoped>
  button.el-button
    margin-right 1rem
    margin-left 0

  legend
    color rgba(0,0,0,.54)
    font-size 90%
</style>
