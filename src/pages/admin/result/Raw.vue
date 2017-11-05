<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section(v-if="!loading").page-header.result-header
      h1 {{ target_tournament.name }}
    loading-container(:loading="loading")
      p(v-if="!loading && adjudicators_ss_unsubmitted.length > 0") These adjudicators have not sent the score sheets: #[font(size="4", color="red") {{ adjudicators_ss_unsubmitted.map(entity_name_by_id).join(", ") }}]
      p(v-if="!loading && entities_es_unsubmitted.length > 0") These adjudicators/teams have not sent the evaluation sheets: #[font(size="4", color="red") {{ entities_es_unsubmitted.map(entity_name_by_id).join(", ") }}]
      el-radio-group.sort-wrapper(v-model="sort_by")
        el-radio-button.sort-option(label="sender") Sort by sender
        el-radio-button.sort-option(label="target") Sort by target
      el-tabs
        el-tab-pane(label="Collected raw Team results")
          section(v-if="!loading")
            span(v-if="raw_team_results_by_r(r_str).length === 0") No team results are collected.
            el-collapse(v-else, accordion, @change="collapse_value = $event")
              el-collapse-item.collapse-item(v-for="results in divided_results('team')", :key="sort_by === 'sender' ? results[0].from_id : results[0].id", :name="sort_by === 'sender' ? results[0].from_id : results[0].id")
                template(slot="title")
                  div(style="width: 90%; display: inline-flex; justify-content: space-between; align-items: center;")
                    span {{ entity_name_by_id(sort_by === 'sender' ? results[0].from_id : results[0].id) }}
                    div
                      el-button.delete(size="small", type="danger", @click="on_delete('teams', 'team', results)") #[el-icon(name="close")]
                el-table.inner-table(:data="results", v-if="collapse_value === (sort_by === 'sender' ? results[0].from_id : results[0].id)", border)
                  el-table-column(prop="id", label="Name", align="center", sortable)
                    template(slot-scope="scope")
                      span {{ entity_name_by_id(scope.row.id) }}
                  el-table-column(prop="win", label="Win", align="center", sortable)
                    template(slot-scope="scope")
                      span {{ scope.row.win }}
                  el-table-column(prop="side", label="Side", align="center", sortable)
                    template(slot-scope="scope")
                      span {{ scope.row.side }}
                  el-table-column(prop="from_id", label="From", align="center", sortable)
                    template(slot-scope="scope")
                      span {{ entity_name_by_id(scope.row.from_id) }}
                  el-table-column(align="right", :min-width="100")
                    template(slot-scope="scope")
                      el-button.edit(size="small", @click="on_edit('team', scope.row)") #[el-icon(name="edit")]
                      el-button.delete(size="small", type="danger", @click="on_delete('teams', 'team', [scope.row])") #[el-icon(name="close")]
          .operations
            el-button(@click="on_download_raw_team_results") Download Raw Team Results

        el-tab-pane(label="Collected raw Speaker results")
          section(v-if="!loading")
            span(v-if="raw_speaker_results_by_r(r_str).length === 0") No speaker results are collected.
            el-collapse(v-else, accordion, @change="collapse_value = $event")
              el-collapse-item.collapse-item(v-for="results in divided_results('speaker')", :key="sort_by === 'sender' ? results[0].from_id : results[0].id", :name="sort_by === 'sender' ? results[0].from_id : results[0].id")
                template(slot="title")
                  div(style="width: 90%; display: inline-flex; justify-content: space-between; align-items: center;")
                    span {{ entity_name_by_id(sort_by === 'sender' ? results[0].from_id : results[0].id) }}
                    div
                      el-button.delete(size="small", type="danger", @click="on_delete('speakers', 'speaker', results)") #[el-icon(name="close")]
                el-table.inner-table(:data="results", v-if="collapse_value === (sort_by === 'sender' ? results[0].from_id : results[0].id) ", border)
                  el-table-column(prop="id", label="Name", align="center", sortable)
                    template(slot-scope="scope")
                      span {{ entity_name_by_id(scope.row.id) }}
                  el-table-column(label="scores", align="center")
                    el-table-column(v-for="index in range(style.score_weights.length)", :key="index", :label="ordinal(index+1)", align="center", sortable)
                      template(slot-scope="scope")
                        span {{ score(scope.row.scores, index+1) === 0 ? '' : score(scope.row.scores, index+1) }}
                  el-table-column(label="Best", align="center")
                    el-table-column(v-for="index in range(style.score_weights.length)", :key="index", :label="ordinal(index+1)", align="center", sortable)
                      template(slot-scope="scope")
                        span {{ scope.row.user_defined_data.best.find(b => b.order === index+1).value ? '1' : '' }}
                  el-table-column(label="POI", align="center")
                    el-table-column(v-for="index in range(style.score_weights.length)", :key="index", :label="ordinal(index+1)", align="center", sortable)
                      template(slot-scope="scope")
                        span {{ scope.row.user_defined_data.poi.find(b => b.order === index+1).value ? '1' : '' }}
                  el-table-column(prop="from_id", label="From", align="center", sortable)
                    template(slot-scope="scope")
                      span {{ entity_name_by_id(scope.row.from_id) }}
                  el-table-column(align="right", :min-width="100")
                    template(slot-scope="scope")
                      el-button.edit(size="small", @click="on_edit('speaker', scope.row)") #[el-icon(name="edit")]
                      el-button.delete(size="small", type="danger", @click="on_delete('speakers', 'speaker', [scope.row])") #[el-icon(name="close")]
          .operations
            el-button(@click="on_download_raw_speaker_results") Download Raw Speaker Results

        el-tab-pane(label="Collected raw Adjudicator results")
          section(v-if="!loading")
            span(v-if="raw_adjudicator_results_by_r(r_str).length === 0") No adjudicator results are collected.
            el-collapse(v-else, accordion, @change="collapse_value = $event")
              el-collapse-item.collapse-item(v-for="results in divided_results('adjudicator')", :key="sort_by === 'sender' ? results[0].from_id : results[0].id", :name="sort_by === 'sender' ? results[0].from_id : results[0].id")
                template(slot="title")
                  div(style="width: 90%; display: inline-flex; justify-content: space-between; align-items: center;")
                    span {{ entity_name_by_id(sort_by === 'sender' ? results[0].from_id : results[0].id) }}
                    div
                      el-button.delete(size="small", type="danger", @click="on_delete('adjudicators', 'adjudicator', results)") #[el-icon(name="close")]
                el-table.inner-table(:data="results", v-if="collapse_value === (sort_by === 'sender' ? results[0].from_id : results[0].id) ", border)
                  el-table-column(prop="id", label="Name", align="center", sortable)
                    template(slot-scope="scope")
                      span {{ entity_name_by_id(scope.row.id) }}
                  el-table-column(label="Score", align="center", sortable)
                    template(slot-scope="scope")
                      span {{ scope.row.score }}
                  el-table-column(prop="from_id", label="From", align="center", sortable)
                    template(slot-scope="scope")
                      span {{ adjudicator_result_sender(scope.row.from_id) }}
                  el-table-column(align="right", :min-width="100")
                    template(slot-scope="scope")
                      el-button.edit(size="small", @click="on_edit('adjudicator', scope.row)") #[el-icon(name="edit")]
                      el-button.delete(size="small", type="danger", @click="on_delete('adjudicators', 'adjudicator', [scope.row])") #[el-icon(name="close")]
          .operations
            el-button(@click="on_download_raw_adjudicator_results") Download Raw Adjudicator Results

      el-dialog(title="Edit Result", :visible.sync="dialog.team_result.visible", v-if="!loading")
        .dialog-body
          el-form(:model="dialog.team_result.form.model")
            h3(align="center", v-if="dialog.team_result.form.model.id !== null") Team: {{ entity_name_by_id(dialog.team_result.form.model.id) }}
            h3(align="center", v-if="dialog.team_result.form.model.from_id !== null") Adjudicator: {{ entity_name_by_id(dialog.team_result.form.model.from_id) }}
            el-form-item(label="Win", prop="win")
              el-input-number(:min="0", :max="1", v-model="dialog.team_result.form.model.win")
            el-form-item(label="Side", prop="side")
              el-select(v-model="dialog.team_result.form.model.side")
                el-option(v-for="side in ['gov', 'opp']", :value="side", :label="capitalize(side)", :key="side")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.team_result.visible = false") Cancel
          el-button(type="primary", :loading="dialog.team_result.loading", @click="on_update('teams', 'team')") #[el-icon(name="plus", v-if="!dialog.team_result.loading")] OK

      el-dialog(title="Edit Result", :visible.sync="dialog.speaker_result.visible", v-if="!loading")
        .dialog-body
          el-form(:model="dialog.speaker_result.form.model")
            h3(align="center", v-if="dialog.speaker_result.form.model.id !== null") Speaker: {{ entity_name_by_id(dialog.speaker_result.form.model.id) }}
            h3(align="center", v-if="dialog.speaker_result.form.model.from_id !== null") Adjudicator: {{ entity_name_by_id(dialog.speaker_result.form.model.from_id) }}
            el-form-item(v-for="score in dialog.speaker_result.form.model.scores", :key="score.order", :label="ordinal(score.order)")
              el-input-number(:value="score.value", @change="input_score(dialog.speaker_result.form.model.scores, score.order, $event)")
            el-form-item(v-for="poi in dialog.speaker_result.form.model.user_defined_data.poi", :key="poi.order", :label="'POI '+ordinal(poi.order)")
              el-switch(:value="poi.value", @change="input_score(dialog.speaker_result.form.model.user_defined_data.poi, poi.order, $event)", on-text="", off-text="")
            el-form-item(v-for="best in dialog.speaker_result.form.model.user_defined_data.best", :key="best.order", :label="'Best '+ordinal(best.order)")
              el-switch(:value="best.value", @change="input_score(dialog.speaker_result.form.model.user_defined_data.best, best.order, $event)", on-text="", off-text="")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.speaker_result.visible = false") Cancel
          el-button(type="primary", :loading="dialog.speaker_result.loading", @click="on_update('speakers', 'speaker')") #[el-icon(name="plus", v-if="!dialog.speaker_result.loading")] OK


      el-dialog(title="Edit Result", :visible.sync="dialog.adjudicator_result.visible", v-if="!loading")
        .dialog-body
          el-form(:model="dialog.adjudicator_result.form.model")
            h3(align="center", v-if="dialog.adjudicator_result.form.model.id !== null") Team: {{ entity_name_by_id(dialog.adjudicator_result.form.model.id) }}
            h3(align="center", v-if="dialog.adjudicator_result.form.model.from_id !== null") Adjudicator: {{ entity_name_by_id(dialog.adjudicator_result.form.model.from_id) }}
            el-form-item(label="Score", prop="score")
              el-input-number(v-model="dialog.adjudicator_result.form.model.score")
        .dialog-footer(slot="footer")
          el-button(@click="dialog.adjudicator_result.visible = false") Cancel
          el-button(type="primary", :loading="dialog.adjudicator_result.loading", @click="on_update('adjudicators', 'adjudicator')") #[el-icon(name="plus", v-if="!dialog.adjudicator_result.loading")] OK
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
      collapse_value: null,
      sort_by: 'sender',
      dialog: {
        team_result: {
          form: {
            model: {
              r: null,
              id: null,
              side: '',
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
              from_id: null,
              user_defined_data: {
                poi: false,
                best: false
              }
            }
          },
          loading: false,
          visible: false
        },
        adjudicator_result: {
          form: {
            model: {
              r: null,
              id: null,
              score: null,
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
    divided_results () {
      return label_singular => {
        let key = this.sort_by === 'sender' ? 'from_id' : 'id'
        let results = this['raw_'+label_singular+'_results_by_r'](this.r_str)
        let groups = Array.from(new Set(results.map(r => r[key])))
        let divided_results = []
        for (let group of groups) {
          let divided = results.filter(r => r[key] === group).sort((r1, r2) => this.entity_name_by_id(r1[key]).localeCompare(this.entity_name_by_id(r2[key])))
          divided_results.push(divided)
        }
        return divided_results
      }
    },
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'style',
      'target_tournament',
      'target_score_sheets',
      'target_evaluation_sheets',
      'target_round',
      'entity_by_id',
      'entity_name_by_id',
      'teams_by_speaker_id',
      'raw_speaker_results_by_r',
      'raw_team_results_by_r',
      'raw_adjudicator_results_by_r'
    ]),
    adjudicators_ss_watching () {
      return Array.from(new Set(this.target_score_sheets.map(ss => ss.from_id)))
    },
    entities_es_watching () {
      return Array.from(new Set(this.target_evaluation_sheets.map(es => es.from_id)))
    },
    adjudicators_ss_submitted () {
      return Array.from(new Set(this.raw_team_results_by_r(this.r_str).map(tr => tr.from_id)))
    },
    adjudicators_ss_unsubmitted () {
      return this.adjudicators_ss_watching.filter(id => !this.adjudicators_ss_submitted.includes(id))
    },
    entities_es_submitted () {
      return Array.from(new Set(this.raw_adjudicator_results_by_r(this.r_str).map(ar => ar.from_id)))
    },
    entities_es_unsubmitted () {
      return this.entities_es_watching.filter(id => !this.entities_es_submitted.includes(id))
    }
  },
  methods: {
    ...mapActions([
      'send_update_result',
      'send_delete_result',
      'init_one'
    ]),
    capitalize: math.capitalize,
    input_score(scores, order, value) {
      let index = scores.findIndex(s => s.order === order)
      let score = Object.assign({}, scores[index])
      score.value = value
      this.$set(scores, index, score)
    },
    adjudicator_result_sender (from_id) {
      return this.entity_name_by_id(from_id)
    },
    ordinal: math.ordinal,
    score (scores, order) {
      return scores.find(sc => sc.order === order).value
    },
    on_edit (label_singular, raw_result) {
      this.transfer(this.dialog[label_singular+'_result'].form.model, raw_result)
      this.dialog[label_singular+'_result'].visible = true
    },
    async on_delete (label, label_singular, raw_results) {
      const ans = await this.$confirm('Are you sure?')
      if (ans === 'confirm') {
        for (let raw_result of raw_results) {
          let payload = {
            label,
            label_singular,
            tournament: this.target_tournament,
            raw_result
          }
          this.send_delete_result(payload)
        }
      }
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
    on_download_raw_team_results () {
      let results = this.raw_team_results_by_r(this.r_str)
      let organized_results = results.map(result => Object.assign({}, result))
      for (let result of organized_results) {
        result.name = this.entity_name_by_id(result.id)
        result.from_name = this.entity_name_by_id(result.from_id)
        result.opponents_name = result.opponents.map(this.entity_name_by_id).join(' ')
      }
      this.download_results_as_csv('raw_team_results_in_round_'+this.r_str+'.csv', organized_results, ['name', 'win', 'side', 'opponents_name', 'from_name'], ['Name', 'Win', 'Side', 'Opponents', 'From'])
    },
    on_download_raw_adjudicator_results () {
      let results = this.raw_adjudicator_results_by_r(this.r_str)
      let organized_results = results.map(result => Object.assign({}, result))
      for (let result of organized_results) {
        result.name = this.entity_name_by_id(result.id)
        result.from_name = this.entity_name_by_id(result.from_id)
        result.teams = result.judged_teams.map(this.entity_name_by_id).join(' ')
        result.score = result.score
        result.matter = result.user_defined_data.matter
        result.manner = result.user_defined_data.manner
        result.comment = result.comment
      }
      this.download_results_as_csv('raw_adjudicator_results_in_round_'+this.r_str+'.csv', organized_results, ['name', 'teams', 'score', 'matter', 'manner', 'comment', 'from_name'], ['Name', 'Judged Teams', 'Score', 'Matter', 'Manner', 'Comment', 'From'])
    },
    on_download_raw_speaker_results () {
      let results = this.raw_speaker_results_by_r(this.r_str)
      let organized_results = results.map(result => Object.assign({}, result))
      let speakers_per_team = this.style.score_weights.length
      for (let result of organized_results) {
        result.name = this.entity_name_by_id(result.id)
        result.team_name = this.teams_by_speaker_id(result.id).map(t => t.name)
        result.from_name = this.entity_name_by_id(result.from_id)

        for (let index of math.range(speakers_per_team)) {
          [result.scores, result.user_defined_data.matters, result.user_defined_data.manners].map(r => r.sort((r1, r2) => r1.order > r2.order ? 1 : -1))
          result['score'+(index+1)] = result.scores[index].value
          result['matter'+(index+1)] = result.user_defined_data.matters[index].value
          result['manner'+(index+1)] = result.user_defined_data.manners[index].value
          //result.poi = result.user_defined_data.hasOwnProperty('poi') ? math.sum_bool(Object.values(result.user_defined_data.poi)) : false
          //result.user_defined_data.hasOwnProperty('best') ? math.sum_bool(Object.values(result.user_defined_data.best)) : false
        }
      }
      //this.download_results_as_csv('raw_speaker_results_in_round_'+this.r_str+'.csv', organized_results, ['name', 'score1', 'score2', 'score3', 'score4', 'matter1', 'matter2', 'matter3', 'matter4', 'manner1', 'manner2', 'manner3', 'manner4', 'from_name', 'poi', 'best'], ['Name', 'Score(1st)', 'Score(2nd)', 'Score(3rd)', 'Score(4th)', 'Matter(1st)', 'Matter(2nd)', 'Matter(3rd)', 'Matter(4th)', 'Manner(1st)', 'Manner(2nd)', 'Manner(3rd)', 'Manner(4th)', 'From', 'POI', 'Best Speaker'])
      let header = ['name', 'from_name']
      let labels = ['Name', 'From']
      header = header.concat(...math.range(speakers_per_team).map(index => ['score'+(index+1), 'matter'+(index+1), 'manner'+(index+1)]))
      labels = labels.concat(...math.range(speakers_per_team).map(index => ['Score('+this.ordinal(index+1)+')', 'Matter('+this.ordinal(index+1)+')', 'Manner('+this.ordinal(index+1)+')']))
      this.download_results_as_csv('raw_speaker_results_in_round_'+this.r_str+'.csv', organized_results, header, labels)
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
    },
    transfer (to, from) {
      for (let key in to) {
        if (from.hasOwnProperty(key)) {
          if (Array.isArray(from[key])) {
            to[key] = from[key].slice()
          } else {
            to[key] = from[key]
          }
        }
      }
    },
    range: math.range
  },
  mounted () {
    this.init_one({ tournament: this.target_tournament })
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

  section.page-header.result-header
    margin-bottom 0

  .sort-wrapper
    margin 0
    display flex
    justify-content flex-end

  .el-radio-button.sort-option
    height 2rem

  .inner-table
    border none

  .collapse-item
    div.el-collapse-item__content
      padding 0
    div.el-collapse-item__wrap
      border 0

  .operations
    display flex
    justify-content flex-end
    margin-top 1rem

  .edit
    margin-right .4rem

  .delete
    margin-right 1rem

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>
