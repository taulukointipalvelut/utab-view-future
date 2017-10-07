<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section.page-header
      h1 {{ target_tournament.name }}
    loading-container(:loading="loading")
    p(v-if="target_tournament.compiled_team_results.length == 0 && target_tournament.compiled_speaker_results.length == 0") No teams are registered or Please recompile results.
    el-tabs(type="card", v-if="target_tournament.compiled_team_results.length > 0 || target_tournament.compiled_speaker_results.length > 0")
      el-tab-pane(label="Team Results")
        section(v-if="!loading")
          el-table(:data="target_tournament.compiled_team_results.slice().sort((r1, r2) => r1.ranking > r2.ranking ? 1 : -1)")
            el-table-column(prop="ranking", label="Ranking", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.ranking }}
            el-table-column(prop="id", label="Name", align="center", sortable)
              template(scope="scope")
                span {{ team_by_id(scope.row.id).name }}
            el-table-column(prop="win", label="Win", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.win }}
            el-table-column(prop="sum", label="Sum", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.sum }}
            el-table-column(prop="margin", label="Margin", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.margin }}
            el-table-column(prop="vote", label="Vote", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.vote }}
            el-table-column(prop="sd", label="StDev", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.sd }}
          .operations
            el-button(@click="on_download_team_results") Download Team Results
            el-button(type="primary", @click="on_configure_slide('team')") #[el-icon(name="picture")] &nbsp;Slide Show

      el-tab-pane(label="Speaker Results")
        el-table(:data="target_tournament.compiled_speaker_results.slice().sort((r1, r2) => r1.ranking > r2.ranking ? 1 : -1)")
          el-table-column(prop="ranking", label="Ranking", align="center", sortable)
            template(scope="scope")
              span {{ scope.row.ranking }}
          el-table-column(prop="id", label="Name", align="center", sortable)
            template(scope="scope")
              span {{ speaker_by_id(scope.row.id).name }}
          el-table-column(prop="average", label="Average", align="center", sortable)
            template(scope="scope")
              span {{ scope.row.average }}
          el-table-column(prop="sum", label="Sum", align="center", sortable)
            template(scope="scope")
              span {{ scope.row.sum }}
          el-table-column(prop="sd", label="StDev", align="center", sortable)
            template(scope="scope")
              span {{ scope.row.sd }}
        .operations
          el-button(@click="on_download_speaker_results") Download Speaker Results
          el-button(type="primary", @click="on_configure_slide('speaker')") #[el-icon(name="picture")] &nbsp;Slide Show

      el-tab-pane(v-for="sub_prize in ['best', 'poi']", :label="{best: 'Best Speaker Results', poi: 'POI Results'}[sub_prize]", :key="sub_prize")
        el-table(:data="compiled_sub_prize_results(sub_prize).slice().sort((a, b) => a[sub_prize] < b[sub_prize] ? 1 : -1)")
          el-table-column(prop="ranking", label="Ranking", align="center", sortable)
            template(scope="scope")
              span {{ scope.row.ranking }}
          el-table-column(label="Name", align="center", sortable)
            template(scope="scope")
              span {{ speaker_by_id(scope.row.id).name }}
          el-table-column(label="Total", align="center", sortable, prop="sub_prize")
            template(scope="scope")
              span {{ scope.row[sub_prize] }}
        .operations
          el-button(@click="on_download_speaker_results", disabled) Download Speaker Results
          el-button(type="primary", @click="on_configure_slide(sub_prize)") #[el-icon(name="picture")] &nbsp;Slide Show

      el-dialog(title="Slide Show", :visible.sync="dialog.team_slide.visible", v-if="!loading")
        .dialog-body
          el-form(:model="dialog.team_slide.form.model")
            el-form-item(label="Max Team Ranking Rewarded")
              el-input(v-model="dialog.team_slide.form.model.max_ranking_rewarded")
            el-form-item(label="Credit")
              el-input(v-model="dialog.team_slide.form.model.credit")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.team_slide.visible = false") Cancel
          el-button(type="primary", @click="on_start_slide('teams', 'team')") Start

      el-dialog(title="Slide Show", :visible.sync="dialog.speaker_slide.visible", v-if="!loading")
        .dialog-body
          el-form(:model="dialog.speaker_slide.form.model")
            el-form-item(label="Max Speaker Ranking Rewarded")
              el-input(v-model="dialog.speaker_slide.form.model.max_ranking_rewarded")
            el-form-item(label="Credit")
              el-input(v-model="dialog.speaker_slide.form.model.credit")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.speaker_slide.visible = false") Cancel
          el-button(type="primary", @click="on_start_slide('speakers', 'speaker')") Start

      el-dialog(v-for="sub_prize in ['best', 'poi']", :key="sub_prize", title="Slide Show", :visible.sync="dialog[sub_prize+'_slide'].visible", v-if="!loading")
        .dialog-body
          el-form(:model="dialog[sub_prize+'_slide'].form.model")
            el-form-item(label="Max Speaker Ranking Rewarded")
              el-input(v-model="dialog[sub_prize+'_slide'].form.model.max_ranking_rewarded")
            el-form-item(label="Credit")
              el-input(v-model="dialog[sub_prize+'_slide'].form.model.credit")
        .dialog-footer(slot="footer")
          el-button(@click="dialog[sub_prize+'_slide'].visible = false") Cancel
          el-button(type="primary", @click="on_start_slide(sub_prize, sub_prize)") Start
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'
import loading_container from 'components/loading-container'
import math from 'assets/js/math'

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
        team_slide: {
          visible: false,
          form: {
            model: {
              max_ranking_rewarded: 3,
              credit: ''
            }
          }
        },
        speaker_slide: {
          visible: false,
          form: {
            model: {
              max_ranking_rewarded: 3,
              credit: ''
            }
          }
        },
        best_slide: {
          visible: false,
          form: {
            model: {
              max_ranking_rewarded: 3,
              credit: ''
            }
          }
        },
        poi_slide: {
          visible: false,
          form: {
            model: {
              max_ranking_rewarded: 3,
              credit: ''
            }
          }
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
      'compiled_sub_prize_results'
    ])
  },
  methods: {
    capitalize: math.capitalize,
    on_configure_slide (label_singular) {
      this.dialog[label_singular+'_slide'].visible = true
    },
    on_start_slide (label, label_singular) {
      let model = this.dialog[label_singular+'_slide'].form.model
      this.$router.push({
        path: 'slide/'+label_singular+'?'+math.query_from_obj(this.dialog[label_singular+'_slide'].form.model)
      })
    },
    on_download_team_results () {
      let results = this.target_tournament.compiled_team_results
      let blob = new Blob([this.team_results_to_csv_text(results)], {type: 'text/plain'})
      let link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'team_results.csv'
      link.click()
    },
    on_download_speaker_results () {
      let results = this.target_tournament.compiled_speaker_results
      let blob = new Blob([this.speaker_results_to_csv_text(results)], {type: 'text/plain'})
      let link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'speaker_results.csv'
      link.click()
    },
    team_results_to_csv_text (results) {
      let csv = ['name', 'ranking', 'win', 'sum', 'margin', 'vote', 'stDev'].join(',') + '\n'
      for (let result of results.slice().sort((r1, r2) => r1.ranking > r2.ranking)) {
        csv += [this.team_by_id(result.id).name, result.ranking, result.win, result.sum, result.margin, result.vote, result.sd].join(',') + '\n'
      }
      return csv
    },
    speaker_results_to_csv_text (results) {
      let csv = ['name', 'ranking', 'average', 'sum', 'stDev'].join(',') + '\n'
      for (let result of results.slice().sort((r1, r2) => r1.ranking > r2.ranking)) {
        csv += [this.speaker_by_id(result.id).name, result.ranking, result.average, result.sum, result.sd].join(',') + '\n'
      }
      return csv
    }
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

  .operations
    display flex
    justify-content flex-end
    margin-top 1rem

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>
