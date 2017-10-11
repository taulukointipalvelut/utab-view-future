<template lang="pug">
  .router-view-content
    section.page-header
      h1 {{ from.name }}
      h3 {{ round_by_r(r_str).name }}
    loading-container(:loading="loading")
      section(v-if="!loading")
        h3 Select Judges to evaluate
          el-checkbox-group.judge-selection(v-model="adjudicators_to_evaluate")
            el-checkbox-button(v-for="result in results", :label="result.id", :key="result.id") {{ adjudicator_by_id(result.id).name }}
        .card-container(v-if="!loading")
          el-card.card(v-for="result in results", :key="result.id", v-if="result_visible(result)")
            div(slot="header").card-header-container
              span.card-title {{ adjudicator_by_id(result.id).name }}
              //span.card-subtitle subtitle
            el-form
              el-form-item(label="Matter", required)
                number-box(v-model="result.matter", :min="1", :max="10", :step="1")
              el-form-item(label="Manner", required)
                number-box(v-model="result.manner", :min="1", :max="10", :step="1")
              el-form-item(label="Total Score")
                input-label(:value="result.matter+result.manner")
              el-input(type="textarea", :rows="3", v-model="result.comment", :placeholder="'Write your comment on '+adjudicator_by_id(result.id).name+', if any'")
        section.buttons
          el-button(@click="on_prev") #[el-icon(name="arrow-left")] Select Again
          el-button(type="primary" @click="on_send", :disabled="loading || adjudicators_to_evaluate.length === 0") Send #[i.fa.fa-paper-plane]
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapActions } from 'vuex'
import { smartphone } from 'assets/js/media-query.js'
import loading_container from 'components/loading-container'
import number_box from 'components/number-box'
import input_label from 'components/input-label'

export default {
  components: {
    'loading-container': loading_container,
    'number-box': number_box,
    'input-label': input_label
  },
  props: ['r_str', 'from_id_str'],
  data () {
    return {
      adjudicators_to_evaluate: [],
      results: [],
      active_a_id: ''
    }
  },
  computed: {
    from () {
      let from_id = parseInt(this.from_id_str, 10)
      if (from_id < 0) {
        return this.adjudicator_by_id(from_id)
      } else {
        return this.team_by_id(from_id)
      }
    },
    ...mapState([
      'loading'
    ]),
    ...mapGetters([
      'target_tournament',
      'round_by_r',
      'adjudicator_by_id',
      'team_by_id',
      'venue_by_id',
      'details_1',
      'evaluation_sheet_by_id'
    ]),
    smartphone: smartphone,
    evaluation_sheet () {
      return this.evaluation_sheet_by_id(this.from_id_str)
    }
  },
  methods: {
    on_prev () {
      this.$router.push('../feedback')
    },
    on_send () {
      console.log("preparing")
    },
    result_visible(result) {
      return this.adjudicators_to_evaluate.includes(result.id)
    }
  },
  mounted () {
    for (let id of this.evaluation_sheet.adjudicators.filter(id => id !== this.evaluation_sheet.from_id)) {
      this.results.push({
        id,
        comment: '',
        matter: 5,
        manner: 5,
        evaluated: true
      })
    }
  }
}
</script>

<style lang="stylus">
  .judge-selection
    text-align center
  @import "./evaluation"
</style>
