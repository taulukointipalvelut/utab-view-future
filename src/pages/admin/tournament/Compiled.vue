<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section.page-header
      h1 {{ target_tournament.name }}
    p(v-if="target_tournament.compiled_team_results.length === 0 && target_tournament.compiled_speaker_results.length === 0 && target_tournament.compiled_adjudicator_results.length === 0") No results are collected or Please recompile results.
    el-tabs.results-tabs(v-if="target_tournament.compiled_team_results.length > 0 || target_tournament.compiled_speaker_results.length > 0")
      el-tab-pane(v-for="label in ['teams', 'speakers', 'adjudicators']", :key="label", :label="capitalize(labels_singular[label])+' Results'", v-if="label === 'teams' || (label === 'speakers' && !without_speakers) || (label === 'adjudicators' && !without_adjudicators)")
        el-tabs.result-tabs(type="border-card")
          el-tab-pane(label="Table")
            el-table(:data="target_tournament['compiled_'+labels_singular[label]+'_results'].slice().sort((r1, r2) => r1.ranking > r2.ranking ? 1 : -1)")
              el-table-column(prop="ranking", label="Ranking", align="center", sortable)
                template(slot-scope="scope")
                  span {{ scope.row.ranking }}
              el-table-column(prop="id", label="Name", align="center", sortable)
                template(slot-scope="scope")
                  span {{ entity_name_by_id(scope.row.id) }}
              el-table-column(label="Team", align="center", sortable, v-if="label === 'speaker'")
                template(slot-scope="scope")
                  span {{ teams_by_speaker_id(scope.row.id).map(t => t.name).join(', ') }}
              el-table-column(prop="win", label="Win", align="center", sortable, v-if="label === 'teams'")
                template(slot-scope="scope")
                  span {{ scope.row.win }}
              el-table-column(prop="average", label="Average", align="center", sortable, v-if="(label === 'speakers' && !without_speakers) || (label === 'adjudicators' && !without_adjudicators)")
                template(slot-scope="scope")
                  span {{ round(scope.row.average) }}
              el-table-column(prop="sum", label="Sum", align="center", sortable, v-if="['speakers', 'teams'].includes(label) && !without_speakers")
                template(slot-scope="scope")
                  span {{ round(scope.row.sum) }}
              el-table-column(prop="margin", label="Margin", align="center", sortable, v-if="label === 'teams' && !without_speakers")
                template(slot-scope="scope")
                  span {{ round(scope.row.margin) }}
              el-table-column(prop="vote", label="Vote", align="center", sortable, v-if="label === 'teams' && !without_speakers")
                template(slot-scope="scope")
                  span {{ scope.row.vote }}
              el-table-column(prop="sd", label="StDev", align="center", sortable, v-if="(label === 'adjudicators' && !without_adjudicators) || !without_speakers")
                template(slot-scope="scope")
                  span {{ round(scope.row.sd) }}
              el-table-column(prop="num_experienced", label="Judged", align="center", sortable, v-if="label === 'adjudicators' && !without_adjudicators")
                template(slot-scope="scope")
                  span {{ scope.row.num_experienced }}
              el-table-column(prop="num_experienced_chair", label="As Chair", align="center", sortable, v-if="label === 'adjudicators' && !without_adjudicators")
                template(slot-scope="scope")
                  span {{ scope.row.num_experienced_chair }}
              el-table-column(prop="comments", label="Comments", align="center", sortable, v-if="label === 'adjudicators' && !without_adjudicators")
                template(slot-scope="scope")
                  span {{ scope.row.comments.join(', ') }}
            .operation-button-container
              el-button.operation-button(@click="on_download_results(label)") Download {{ capitalize(labels_singular[label]) }} Results
          el-tab-pane(label="Slides")
            slides(:label="label", v-if="slides[label].configured", :tournament="target_tournament", :max_ranking_rewarded="slides[label].max_ranking_rewarded", :credit="slides[label].credit", :type="slides[label].type", @close="slides[label].configured=false")
            el-card(v-if="!slides[label].configured").slide-config-card
              el-form
                el-form-item(:label="'Max '+capitalize(label)+' Rewarded'")
                  el-input-number(v-model="slides[label].max_ranking_rewarded", :min="1")
                el-form-item(label="Credit")
                  el-input(v-model="slides[label].credit")
                el-form-item(label="Type")
                  el-select(v-model="slides[label].type")
                    el-option(label="Listed", value="listed")
                    el-option(label="Pretty", value="pretty")
            .operation-button-container(v-if="!slides[label].configured")
              el-button.operation-button(size="small", type="primary", @click="slides[label].configured=true") #[el-icon(name="picture")] Start
          el-tab-pane(label="Score Graph", v-if="label === 'adjudicators' || !without_speakers")
            lazy-item
              score-change(:id="label", :results="target_tournament['compiled_'+labels_singular[label]+'_results']", :tournament="target_tournament", :marker="label === 'teams' ? { key: 'win', value: 1 } : { key: '', value: undefined }", :score="detail_score[label]")
          el-tab-pane(label="Score Range", v-if="label === 'adjudicators' || !without_speakers")
            lazy-item
              score-range(:id="label", :results="target_tournament['compiled_'+labels_singular[label]+'_results']", :tournament="target_tournament", :score="detail_score[label]")
          el-tab-pane(label="Score Histogram", v-if="label === 'adjudicators' || !without_speakers")
            lazy-item
              score-histogram(:results="target_tournament['compiled_'+labels_singular[label]+'_results']", :tournament="target_tournament", :score="detail_score[label]", v-for="round in target_tournament.rounds", :round="round", :key="round.r", :id="label+'-'+round.r.toString()")
          el-tab-pane(label="Team Performance Graph", v-if="label === 'teams' && !without_speakers")
            lazy-item
              team-performance(:results="target_tournament.compiled_team_results", :tournament="target_tournament")

      el-tab-pane(v-for="sub_prize in ['best', 'poi']", :label="{best: 'Best Debater Results', poi: 'POI Results'}[sub_prize]", :key="sub_prize", v-if="sub_prize_enabled[sub_prize] && !without_speakers")
        el-tabs.result-tabs(type="border-card")
          el-tab-pane(label="Table")
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
                  span {{ round(scope.row[sub_prize]) }}
            .operation-button-container
              el-button.operation-button(@click="on_download_sub_prize_results(sub_prize, {best: 'Total Best Speaker', poi: 'Total POI'}[sub_prize])") Download {{ {best: 'Best Debater', poi: 'POI'}[sub_prize] }} Results
          el-tab-pane(label="Slides")
            slides(v-if="slides[sub_prize].configured", :label="sub_prize", :tournament="target_tournament", :max_ranking_rewarded="slides[sub_prize].max_ranking_rewarded", :credit="slides[sub_prize].credit", :type="slides[sub_prize].type", @close="slides[sub_prize].configured=false")
            el-card(v-if="!slides[sub_prize].configured").slide-config-card
              el-form
                el-form-item(label="Max Speakers Rewarded")
                  el-input-number(v-model="slides[sub_prize].max_ranking_rewarded", :min="1")
                el-form-item(label="Credit")
                  el-input(v-model="slides[sub_prize].credit")
                el-form-item(label="Type")
                  el-select(v-model="slides[sub_prize].type")
                    el-option(label="Listed", value="listed")
                    el-option(label="Pretty", value="pretty")
            .operation-button-container(v-if="!slides[sub_prize].configured")
              el-button.operation-button(size="small", type="primary", @click="slides[sub_prize].configured=true") #[el-icon(name="picture")] {{ !slides[sub_prize].configured ? 'Start' : 'Cancel' }}

      el-tab-pane(label="Fairness")
        el-tabs.result-tabs(type="border-card")
          el-tab-pane(label="Scores by Side", v-if="!without_speakers")
            lazy-item
              side-scatter(:results="target_tournament.compiled_team_results", :tournament="target_tournament")
          el-tab-pane(label="Gov Win")
            lazy-item
              side-heatmap(:results="target_tournament.compiled_team_results", :tournament="target_tournament", v-for="round in target_tournament.rounds", :round="round", :key="round.r", :id="round.r.toString()")
          el-tab-pane(label="Gov Margin", v-if="!without_speakers")
            lazy-item
              side-margin-heatmap(:results="target_tournament.compiled_team_results", :tournament="target_tournament", v-for="round in target_tournament.rounds", :round="round", :key="round.r", :id="round.r.toString()")
          el-tab-pane(label="Winers")
            lazy-item
              side-pie-chart(:results="target_tournament.compiled_team_results", :tournament="target_tournament", v-for="round in target_tournament.rounds", :round="round", :key="round.r", :id="round.r.toString()")

      el-dialog(v-for="label_singular in ['team', 'adjudicator', 'speaker', 'poi', 'best']", :key="label_singular", title="Slide Show", :visible.sync="dialog[label_singular+'_slide'].visible")
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
import math from 'assets/js/math'
import score_change from 'components/mstat/score-change'
import team_performance from 'components/mstat/team-performance'
import score_histogram from 'components/mstat/score-histogram'
import score_range from 'components/mstat/score-range'
import side_scatter from 'components/mstat/side-scatter'
import side_heatmap from 'components/mstat/side-heatmap'
import side_margin_heatmap from 'components/mstat/side-margin-heatmap'
import side_pie_chart from 'components/mstat/side-pie-chart'
import slides from 'components/slides/slides'
import lazy_item from 'components/lazy-item'

export default {
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item,
    'score-change': score_change,
    'team-performance': team_performance,
    'score-histogram': score_histogram,
    'score-range': score_range,
    'side-scatter': side_scatter,
    'side-heatmap': side_heatmap,
    'side-margin-heatmap': side_margin_heatmap,
    'side-pie-chart': side_pie_chart,
    'slides': slides,
    'lazy-item': lazy_item
  },
  props: ['r_str'],
  data () {
    return {
      labels_singular: {
        teams: 'team',
        speakers: 'speaker',
        adjudicators: 'adjudicator'
      },
      detail_score: { teams: 'sum', speakers: 'average', adjudicators: 'score' },
      slides: {
        teams: {
          configured: false,
          max_ranking_rewarded: 3,
          type: 'listed',
          credit: ''
        },
        adjudicators: {
          configured: false,
          max_ranking_rewarded: 3,
          type: 'listed',
          credit: ''
        },
        speakers: {
          configured: false,
          max_ranking_rewarded: 3,
          type: 'listed',
          credit: ''
        },
        poi: {
          configured: false,
          max_ranking_rewarded: 3,
          type: 'listed',
          credit: ''
        },
        best: {
          configured: false,
          max_ranking_rewarded: 3,
          type: 'listed',
          credit: ''
        }
      },
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
      'auth'
    ]),
    ...mapGetters([
      'target_tournament',
      'entity_name_by_id',
      'teams_by_speaker_id',
      'compiled_sub_prize_results'
    ]),
    sub_prize_enabled () {
      let rounds = this.target_tournament.rounds
      return {
        poi: rounds.some(round => round.user_defined_data.poi),
        best: rounds.some(round => round.user_defined_data.best)
      }
    },
    without_speakers () {
      return this.target_tournament.rounds.every(round => round.user_defined_data.no_speaker_score)
    },
    without_adjudicators () {
      return this.target_tournament.rounds.every(round => !round.user_defined_data.evaluate_from_teams && !round.user_defined_data.evaluate_from_adjudicators)
    }
  },
  methods: {
    round: math.round,
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
    on_download_results (label) {
      let label_singular = this.labels_singular[label]
      let header_labels = []
      let header_contents = []
      if (label === 'teams') {
        header_labels = ['Ranking', 'Place', 'Name', 'Win', 'Sum', 'Margin', 'Vote', 'StDev']
        header_contents = ['ranking', 'place', 'name', 'win', 'sum', 'margin', 'vote', 'sd']
      } else if (label === 'speakers') {
        header_labels = ['Ranking', 'Place', 'Name', 'Team', 'Average', 'Sum', 'StDev']
        header_contents = ['ranking', 'place', 'name', 'team_name', 'average', 'sum', 'sd']
      } else if (label === 'adjudicators') {
        header_labels = ['Ranking', 'Place', 'Name', 'Average', 'StDev']
        header_contents = ['ranking', 'place', 'name', 'average', 'sd']
      }
      let results = this.target_tournament['compiled_'+label_singular+'_results']
      let organized_results = results.map(result => Object.assign({}, result))
      for (let result of organized_results) {
        result.name = this.entity_name_by_id(result.id)
        result.place = math.ordinal(result.ranking)
        if (label === 'speakers') {
          result.team_name = this.teams_by_speaker_id(result.id).map(t => t.name)
        }
      }
      this.download_results_as_csv(label_singular+'_results.csv', organized_results, header_contents, header_labels)
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

  .slide-config-card
    width 90%
    margin auto
    margin-top 2rem

  .operation-button-container
    display flex
    justify-content space-around
    .operation-button
      width 90%
      margin 1rem
      margin-top 1.5rem

  .results-tabs
    .el-tabs__header
      margin-bottom 0

  .result-tabs
    border-top 0
    margin-top 1px
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
