<template lang="pug">
  loading-container.router-view-content(:loading="!round || !adjudicator", no_item_text="Fail to load round/adjudicator data")
    section.page-header(v-if="round && adjudicator")
      h1 {{ adjudicator.name }}
      h3 {{ round.name }}
    section(v-if="round && adjudicator")
      el-steps(:active="current_step", finish-status="success", center)
        el-step(title="Speaker")
        el-step(title="Score")
        el-step(title="Winner")
        el-step(title="Check")
        el-step(title="Done")
    router-view(v-if="round && adjudicator && score_sheet", :score_sheet="score_sheet")
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  props: ['r_str', 'from_id_str'],
  components: {
    'loading-container': loading_container
  },
  data () {
    return {
      steps: ['speaker', 'score', 'winner', 'check', 'done']
    }
  },
  computed: {
     current_step () {
       return this.steps.findIndex(step => step === this.$route.name)
     },
    round () {
      return this.round_by_r(this.r_str)
    },
    adjudicator () {
      return this.adjudicator_by_id(this.from_id_str)
    },
    score_sheet () {
      return this.score_sheet_by_id(this.from_id_str)
    },
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'round_by_r',
      'adjudicator_by_id',
      'score_sheet_by_id',
      'style'
    ])
  },
  methods: {
    ...mapMutations('ballot', [
      'init_result'
    ]),
    ...mapActions([
      'init_teams'
    ]),
  },
  mounted () {
    let gov_roles = this.style.roles.gov
    let opp_roles = this.style.roles.opp
    let role_names = {
      gov: gov_roles.map(r => r.abbr),
      opp: opp_roles.map(r => r.abbr),
    }
    let score_default = {
      gov: this.style.roles.gov.map(r => r.range.default),
      opp: this.style.roles.opp.map(r => r.range.default)
    }
    let sub_prize_default = {
      gov: this.style.roles.gov.map(r => false),
      opp: this.style.roles.opp.map(r => false)
    }
    let payload = {
      len: this.style.score_weights.length,
      score_default,
      sub_prize_default
    }
    this.init_result(payload)
  }
}
</script>
