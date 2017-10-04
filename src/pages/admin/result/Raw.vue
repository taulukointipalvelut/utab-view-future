<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section(v-if="!loading").page-header
      h1 {{ target_tournament.name }}
    loading-container(:loading="loading")
      p(v-if="!loading && adjudicators_unsubmitted.length > 0") These adjudicators have not sent the ballots: #[font(size="4", color="red") {{ adjudicators_unsubmitted.map(id => adjudicator_by_id(id)).map(a => a.name).join(", ") }}]
      p(v-if="!loading && adjudicators_unsubmitted.length === adjudicators_watching.length && adjudicators_watching.length !== 0") Ballots are not collected yet.
      el-tabs(type="card")
        el-tab-pane(label="Collected raw Team results")
          section(v-if="!loading")
            el-table(:data="raw_team_results_by_r(r_str)")
              el-table-column(prop="id", label="Name", align="center", sortable)
                template(scope="scope")
                  span {{ team_by_id(scope.row.id).name }}
              el-table-column(prop="win", label="Win", align="center", sortable)
                template(scope="scope")
                  span {{ scope.row.win }}
              el-table-column(prop="from_id", label="From Adjudicator", align="center", sortable)
                template(scope="scope")
                  span {{ adjudicator_by_id(scope.row.from_id).name }}
              el-table-column(align="right")
                template(scope="scope")
                  el-button.edit(size="small", @click="on_edit('team', scope.row)") #[el-icon(name="edit")]
                  el-button.delete(size="small", type="danger", @click="on_delete('teams', 'team', scope.row)") #[el-icon(name="close")]
        el-tab-pane(label="Collected raw Speaker results")
          section(v-if="!loading")
            el-table(:data="raw_speaker_results_by_r(r_str)")
              el-table-column(prop="id", label="Name", align="center", sortable)
                template(scope="scope")
                  span {{ speaker_by_id(scope.row.id).name }}
              el-table-column(label="scores", align="center")
                el-table-column(v-for="index in [0, 1, 2, 3]", prop="scores", :key="index", :label="['1st', '2nd', '3rd', '4th'][index]", align="center", sortable)
                  template(scope="scope")
                    span {{ scope.row.scores[index] === 0 ? '' : scope.row.scores[index] }}
              el-table-column(prop="from_id", label="From Adjudicator", align="center", sortable)
                template(scope="scope")
                  span {{ adjudicator_by_id(scope.row.from_id).name }}
              el-table-column(align="right")
                template(scope="scope")
                  el-button.edit(size="small", @click="on_edit('speaker', scope.row)") #[el-icon(name="edit")]
                  el-button.delete(size="small", type="danger", @click="on_delete('speakers', 'speaker', scope.row)") #[el-icon(name="close")]

      el-dialog(title="Edit Result", :visible.sync="dialog.team_result.visible", v-if="!loading")
        .dialog-body
          el-form(:model="dialog.team_result.form.model")
            h3(align="center", v-if="dialog.team_result.form.model.id !== null") Team: {{ team_by_id(dialog.team_result.form.model.id).name }}
            h3(align="center", v-if="dialog.team_result.form.model.from_id !== null") Adjudicator: {{ adjudicator_by_id(dialog.team_result.form.model.from_id).name }}
            el-form-item(label="Win", prop="win")
              el-input(v-model="dialog.team_result.form.model.win")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.team_result.visible = false") Cancel
          el-button(type="primary", :loading="dialog.team_result.loading", @click="on_update('teams', 'team')") #[el-icon(name="plus", v-if="!dialog.team_result.loading")] OK

      el-dialog(title="Edit Result", :visible.sync="dialog.speaker_result.visible", v-if="!loading")
        .dialog-body
          el-form(:model="dialog.speaker_result.form.model")
            h3(align="center", v-if="dialog.speaker_result.form.model.id !== null") Speaker: {{ speaker_by_id(dialog.speaker_result.form.model.id).name }}
            h3(align="center", v-if="dialog.speaker_result.form.model.from_id !== null") Adjudicator: {{ adjudicator_by_id(dialog.speaker_result.form.model.from_id).name }}
            el-form-item(label="Scores", prop="scores")
              el-input(v-for="index in range(dialog.speaker_result.form.model.scores.length)", :key="index", v-model="dialog.speaker_result.form.model.scores[index]", style="width: 3rem")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.speaker_result.visible = false") Cancel
          el-button(type="primary", :loading="dialog.speaker_result.loading", @click="on_update('speakers', 'speaker')") #[el-icon(name="plus", v-if="!dialog.speaker_result.loading")] OK
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'
import loading_container from 'components/loading-container'
import math from 'assets/js/math.js'

export default {
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item,
    'loading-container': loading_container
  },
  props: ['r_str'],
  data () {
    return {
      dialog: {
        team_result: {
          form: {
            model: {
              r: null,
              id: null,
              weight: null,
              side: null,
              opponents: [],
              win: null,
              from_id: null
            }
          },
          loading: false,
          visible: false
        },
        speaker_result: {
          form: {
            model: {
              r: null,
              id: null,
              scores: [],
              weight: null,
              from_id: null
            }
          },
          loading: false,
          visible: false
        }
      }
    }
  },
  computed: {
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament',
      'team_by_id',
      'speaker_by_id',
      'adjudicator_by_id',
      'target_score_sheets',
      'raw_speaker_results_by_r',
      'raw_team_results_by_r'
    ]),
    adjudicators_watching () {
      return Array.from(new Set(this.target_score_sheets.map(ss => ss.from_id)))
    },
    adjudicators_submitted () {
      return Array.from(new Set(this.raw_team_results_by_r(this.r_str).map(tr => tr.from_id)))
    },
    adjudicators_unsubmitted () {
      return this.adjudicators_watching.filter(id => !this.adjudicators_submitted.includes(id))
    }
  },
  methods: {
    ...mapActions([
      'send_update_result',
      'send_delete_result',
      'init_raw_results'
    ]),
    on_edit (label_singular, raw_result) {
      this.transfer(this.dialog[label_singular+'_result'].form.model, raw_result)
      this.dialog[label_singular+'_result'].visible = true
    },
    on_delete (label, label_singular, raw_result) {
      let payload = {
        label,
        label_singular,
        tournament: this.target_tournament,
        raw_result
      }
      this.send_delete_result(payload)
    },
    on_update (label, label_singular) {
      let payload = {
        label,
        label_singular,
        tournament: this.target_tournament,
        raw_result: this.dialog[label_singular+'_result'].form.model
      }
      this.dialog[label_singular+'_result'].loading = true
      this.send_update_result(payload).then(() => {
        this.dialog[label_singular+'_result'].visible = false
        this.dialog[label_singular+'_result'].loading = false
      })
    },
    transfer (to, from) {
      for (let key in to) {
        if (from.hasOwnProperty(key)) {
          to[key] = from[key]
        }
      }
    },
    range: math.range
  },
  mounted () {
    this.init_raw_results()
  }
}
</script>

<style lang="stylus">
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

  .edit
    margin-right .4rem

  .delete
    margin-right 1rem

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>
