<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section.page-header
      h1 {{ target_tournament.name }}
    loading-container(:loading="loading")
    p(v-if="target_tournament.compiled_team_results.length === 0 && target_tournament.compiled_speaker_results.length === 0 && target_tournament.compiled_adjudicator_results.length === 0") No results are collected or Please recompile results.
    el-tabs.results-tabs(v-if="target_tournament.compiled_team_results.length > 0 || target_tournament.compiled_speaker_results.length > 0")
      el-tab-pane(label="Team Results")
        el-tabs.result-tabs(type="border-card")
          el-tab-pane(label="Table")
            el-table(:data="target_tournament.compiled_team_results.slice().sort((r1, r2) => r1.ranking > r2.ranking ? 1 : -1)")
              el-table-column(prop="ranking", label="Ranking", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.ranking }}
              el-table-column(prop="id", label="Name", align="center", sortable)
                template(slot-scope="scope")
                  span {{ entity_name_by_id(scope.row.id) }}
              el-table-column(prop="win", label="Win", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.win }}
              el-table-column(prop="sum", label="Sum", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.sum }}
              el-table-column(prop="margin", label="Margin", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.margin }}
              el-table-column(prop="vote", label="Vote", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.vote }}
              el-table-column(prop="sd", label="StDev", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.sd }}
            .operations
              el-button(@click="on_download_team_results") Download Team Results
              el-button(type="primary", @click="on_configure_slide('team')") #[el-icon(name="picture")] &nbsp;Slide Show
          el-tab-pane(label="Score Graph")
            mstat-series(id="team", :results="target_tournament.compiled_team_results", :tournament="target_tournament", :marker="{ key: 'win', value: 1 }", score="sum")
          el-tab-pane(label="Score Range")
            mstat-score-range(id="team", :results="target_tournament.compiled_team_results", :tournament="target_tournament", score="sum")
          el-tab-pane(label="Score Histogram")
            mstat-histogram(:results="target_tournament.compiled_team_results", :tournament="target_tournament", score="sum", v-for="round in target_tournament.rounds", :round="round", :key="round.r", :id="'team-'+round.r.toString()")
          el-tab-pane(label="Team Performance Graph")
            mstat-bar-negative(:results="target_tournament.compiled_team_results", :tournament="target_tournament")

      el-tab-pane(label="Speaker Results")
        el-tabs.result-tabs(type="border-card")
          el-tab-pane(label="Table")
            el-table(:data="target_tournament.compiled_speaker_results.slice().sort((r1, r2) => r1.ranking > r2.ranking ? 1 : -1)")
              el-table-column(prop="ranking", label="Ranking", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.ranking }}
              el-table-column(prop="id", label="Name", align="center", sortable)
                template(slot-scope="scope")
                  span {{ entity_name_by_id(scope.row.id) }}
              el-table-column(label="Team", align="center", sortable)
                template(slot-scope="scope")
                  span {{ teams_by_speaker_id(scope.row.id).map(t => t.name).join(', ') }}
              el-table-column(prop="average", label="Average", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.average }}
              el-table-column(prop="sum", label="Sum", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.sum }}
              el-table-column(prop="sd", label="StDev", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.sd }}
            .operations
              el-button(@click="on_download_speaker_results") Download Speaker Results
              el-button(type="primary", @click="on_configure_slide('speaker')") #[el-icon(name="picture")] &nbsp;Slide Show
          el-tab-pane(label="Score Graph")
            mstat-series(id="speaker", :results="target_tournament.compiled_speaker_results", :tournament="target_tournament", :marker="{ key: '', value: undefined }", score="average")
          el-tab-pane(label="Score Range")
            mstat-score-range(id="speaker", :results="target_tournament.compiled_speaker_results", :tournament="target_tournament", score="average")
          el-tab-pane(label="Score Histogram")
            mstat-histogram(:results="target_tournament.compiled_speaker_results", :tournament="target_tournament", score="average", v-for="round in target_tournament.rounds", :round="round", :key="round.r", :id="'speaker-'+round.r.toString()")

      el-tab-pane(label="Adjudicator Results")
        el-tabs.result-tabs(type="border-card")
          el-tab-pane(label="Table")
            el-table(:data="target_tournament.compiled_adjudicator_results.slice().sort((r1, r2) => r1.ranking > r2.ranking ? 1 : -1)")
              el-table-column(prop="ranking", label="Ranking", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.ranking }}
              el-table-column(prop="id", label="Name", align="center", sortable)
                template(slot-scope="scope")
                  span {{ entity_name_by_id(scope.row.id) }}
              el-table-column(prop="average", label="Average", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.average }}
              el-table-column(prop="sd", label="StDev", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.sd }}
              el-table-column(prop="num_experienced", label="Judged", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.num_experienced }}
              el-table-column(prop="num_experienced_chair", label="As Chair", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.num_experienced_chair }}
              el-table-column(prop="comments", label="Comments", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.comments.join(', ') }}
            .operations
              el-button(@click="on_download_adjudicator_results") Download Adjudicator Results
              el-button(type="primary", @click="on_configure_slide('adjudicator')") #[el-icon(name="picture")] &nbsp;Slide Show
          el-tab-pane(label="Score Graph")
            mstat-series(id="adjudicator", :results="target_tournament.compiled_adjudicator_results", :tournament="target_tournament", :marker="{ key: '', value: undefined }", score="score")
          el-tab-pane(label="Score Range")
            mstat-score-range(id="adjudicator", :results="target_tournament.compiled_adjudicator_results", :tournament="target_tournament", score="score")
          el-tab-pane(label="Score Histogram")
            mstat-histogram(:results="target_tournament.compiled_adjudicator_results", :tournament="target_tournament", score="score", v-for="round in target_tournament.rounds", :round="round", :key="round.r", :id="'adjudicator-'+round.r.toString()")

      el-tab-pane(v-for="sub_prize in ['best', 'poi']", :label="{best: 'Best Debater Results', poi: 'POI Results'}[sub_prize]", :key="sub_prize", v-if="sub_prize[sub_prize]")
        el-table(:data="compiled_sub_prize_results(sub_prize)")
          el-table-column(prop="ranking", label="Ranking", align="center", sortable)
            template(slot-scope="scope")
              span {{ scope.row.ranking }}
          el-table-column(label="Name", align="center", sortable)
            template(slot-scope="scope")
              span {{ entity_name_by_id(scope.row.id) }}
          el-table-column(label="Team", align="center", sortable)
            template(slot-scope="scope")
              span {{ teams_by_speaker_id(scope.row.id).map(t => t.name).join(', ') }}
          el-table-column(label="Total", align="center", sortable, prop="sub_prize")
            template(slot-scope="scope")
              span {{ scope.row[sub_prize] }}
        .operations
          el-button(@click="on_download_sub_prize_results(sub_prize, {best: 'Total Best Speaker', poi: 'Total POI'}[sub_prize])") Download {{ {best: 'Best Debater', poi: 'POI'}[sub_prize] }} Results
          el-button(type="primary", @click="on_configure_slide(sub_prize)") #[el-icon(name="picture")] &nbsp;Slide Show

      el-tab-pane(label="Fairness")
        el-tabs.result-tabs(type="border-card")
          el-tab-pane(label="Scores by Side")
            mstat-side-fairness(:results="target_tournament.compiled_team_results", :tournament="target_tournament")
          el-tab-pane(label="Win per Side")
            mstat-side-heatmap(:results="target_tournament.compiled_team_results", :tournament="target_tournament", v-for="round in target_tournament.rounds", :round="round", :key="round.r", :id="round.r.toString()")

      el-dialog(v-for="label_singular in ['team', 'adjudicator', 'speaker', 'poi', 'best']", :key="label_singular", title="Slide Show", :visible.sync="dialog[label_singular+'_slide'].visible", v-if="!loading")
        .dialog-body
          el-form(:model="dialog[label_singular+'_slide'].form.model")
            el-form-item(label="Max Ranking Rewarded")
              el-input-number(:min="1", v-model="dialog[label_singular+'_slide'].form.model.max_ranking_rewarded")
            el-form-item(label="Credit")
              el-input(v-model="dialog[label_singular+'_slide'].form.model.credit")
            el-form-item(label="Type")
              el-select(v-model="dialog[label_singular+'_slide'].form.model.type")
                el-option(value="pretty")
                el-option(value="listed")
        .dialog-footer(slot="footer")
          el-button(@click="dialog[label_singular+'_slide'].visible = false") Cancel
          el-button(type="primary", @click="on_start_slide({team: 'teams', adjudicator: 'adjudicators', speaker: 'speakers', poi: 'poi', best: 'best'}[label_singular], label_singular)") Start
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'
import loading_container from 'components/loading-container'
import math from 'assets/js/math'
import mstat_series from 'components/mstat-series'
import mstat_bar_negative from 'components/mstat-bar-negative'
import mstat_histogram from 'components/mstat-histogram'
import mstat_score_range from 'components/mstat-score-range'
import mstat_side_fairness from 'components/mstat-side-fairness'
import mstat_side_heatmap from 'components/mstat-side-heatmap'

export default {
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item,
    'loading-container': loading_container,
    'mstat-series': mstat_series,
    'mstat-bar-negative': mstat_bar_negative,
    'mstat-histogram': mstat_histogram,
    'mstat-score-range': mstat_score_range,
    'mstat-side-fairness': mstat_side_fairness,
    'mstat-side-heatmap': mstat_side_heatmap,
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
              credit: '',
              type: 'listed',
            }
          }
        },
        speaker_slide: {
          visible: false,
          form: {
            model: {
              max_ranking_rewarded: 3,
              credit: '',
              type: 'listed',
            }
          }
        },
        adjudicator_slide: {
          visible: false,
          form: {
            model: {
              max_ranking_rewarded: 3,
              credit: '',
              type: 'listed',
            }
          }
        },
        best_slide: {
          visible: false,
          form: {
            model: {
              max_ranking_rewarded: 3,
              credit: '',
              type: 'listed',
            }
          }
        },
        poi_slide: {
          visible: false,
          form: {
            model: {
              max_ranking_rewarded: 3,
              credit: '',
              type: 'listed',
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
      'target_tournament',
      'entity_name_by_id',
      'teams_by_speaker_id',
      'compiled_sub_prize_results'
    ]),
    sub_prize () {
      let rounds = this.target_tournament.rounds
      return {
        poi: rounds.some(round => round.user_defined_data.poi),
        best: rounds.some(round => round.user_defined_data.best)
      }
    }
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
      let organized_results = results.map(result => Object.assign({}, result))
      for (let result of organized_results) {
        result.name = this.entity_name_by_id(result.id)
        result.place = math.ordinal(result.ranking)
      }
      this.download_results_as_csv('team_results.csv', organized_results, ['ranking', 'place', 'name', 'win', 'sum', 'margin', 'vote', 'sd'], ['Ranking', 'Place', 'Name', 'Win', 'Sum', 'Margin', 'Vote', 'StDev'])
    },
    on_download_speaker_results () {
      let results = this.target_tournament.compiled_speaker_results
      let organized_results = results.map(result => Object.assign({}, result))
      for (let result of organized_results) {
        result.name = this.entity_name_by_id(result.id)
        result.team_name = this.teams_by_speaker_id(result.id).map(t => t.name)
        result.place = math.ordinal(result.ranking)
      }
      this.download_results_as_csv('speaker_results.csv', organized_results, ['ranking', 'place', 'name', 'team_name', 'average', 'sum', 'sd'], ['Ranking', 'Place', 'Name', 'Team', 'Average', 'Sum', 'StDev'])
    },
    on_download_adjudicator_results () {
      let results = this.target_tournament.compiled_adjudicator_results
      let organized_results = results.map(result => Object.assign({}, result))
      for (let result of organized_results) {
        result.name = this.entity_name_by_id(result.id)
        result.place = math.ordinal(result.ranking)
        //result.team_name = this.teams_by_speaker_id(result.id).map(t => t.name)
      }
      this.download_results_as_csv('adjudicator_results.csv', organized_results, ['ranking', 'place', 'name', 'average', 'sd'], ['Ranking', 'Place', 'Name', 'Average', 'StDev'])
    },
    on_download_sub_prize_results (sub_prize, head) {
      let results = this.compiled_sub_prize_results(sub_prize)
      let organized_results = results.map(result => Object.assign({}, result))
      for (let result of organized_results) {
        result.name = this.entity_name_by_id(result.id)
        result.team_name = this.teams_by_speaker_id(result.id).map(t => t.name)
        result.place = math.ordinal(result.ranking)
      }
      this.download_results_as_csv({poi: "poi", best: "best_speaker"}[sub_prize]+'_results.csv', organized_results, ['ranking', 'place', 'name', 'team_name', sub_prize], ['Ranking', 'Place', 'Name', 'Team', head])
    },
    download_results_as_csv (filename, results, labels, headers) {
      let link = document.createElement('a')
      let csv = headers.join(',') + '\n'
      for (let result of results.slice().sort((r1, r2) => r1.ranking > r2.ranking ? 1 : -1)) {
        csv += labels.map(label => result[label]).join(',') + '\n'
      }
      link.href = URL.createObjectURL(new Blob([csv], {type: 'text/plain'}))
      link.download = filename
      link.click()
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

  .results-tabs
    .el-tabs__header
      margin-bottom 0

  .result-tabs
    border-top 0
    .el-tabs__content
      padding 0
      .el-table
        border 0

  .operations
    display flex
    justify-content flex-end
    margin-top 1rem

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>
