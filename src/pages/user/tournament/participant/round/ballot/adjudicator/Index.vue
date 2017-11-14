<template lang="pug">
  .router-view-content
    section.page-header(v-if="round && adjudicator")
      h1 {{ adjudicator.name }}
      h3 {{ round.name }}
    section(v-if="round && adjudicator && !sent")
      el-steps(:active="current_step", finish-status="success")
        el-step(title="Speaker", v-if="!target_round.user_defined_data.no_speaker_score")
        el-step(title="Score", v-if="!target_round.user_defined_data.no_speaker_score")
        el-step(title="Winner")
        el-step(title="Check")
    router-view(v-if="round && adjudicator && score_sheet && !sent", :score_sheet="score_sheet")
    section(v-if="sent")
      .card-container
        el-card
          h2 Thank you! Your ballot was successfully sent.
          h2(v-if="after_check") You voted for #[span.voted-for {{ entity_name_by_id(winner) }} ({{ side_label }})].
          h2(v-if="after_check") Please show this screen to debaters.
      section
        el-button.home-button(@click="on_home") #[i.fa.fa-home] Home
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  props: ['r_str', 'from_id_str'],
  computed: {
    after_check () {
      return this.$route.query.hasOwnProperty('winner')
    },
    winner () {
      return this.$route.query.winner
    },
    side () {
      return this.$route.query.side
    },
    side_label () {
      return this.target_tournament.style.side_labels[this.side]
    },
    sent () {
      return this.score_sheet.done
    },
    current_step () {
      let steps = this.target_round.user_defined_data.no_speaker_score ? ['winner', 'check', 'done']
                                                                       : ['speaker', 'score', 'winner', 'check', 'done']
      return steps.findIndex(step => step === this.$route.name)
    },
    round () {
      return this.target_round
    },
    adjudicator () {
      return this.entity_by_id[parseInt(this.from_id_str, 10)]
    },
    score_sheet () {
      return this.score_sheet_by_id(this.from_id_str)
    },
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'target_tournament',
      'target_round',
      'entity_by_id',
      'entity_name_by_id',
      'score_sheet_by_id',
      'style'
    ])
  },
  methods: {
    ...mapMutations('ballot', [
      'init_result'
    ]),
    on_home () {
      this.$router.push('/home')
    }
  },
  mounted () {
    let role_names = {
      gov: this.style.roles.gov.slice().sort((a, b) => a.order > b.order ? 1 : -1).map(r => r.abbr),
      opp: this.style.roles.opp.slice().sort((a, b) => a.order > b.order ? 1 : -1).map(r => r.abbr),
    }
    let score_default = {
      gov: this.style.range.slice().sort((a, b) => a.order > b.order ? 1 : -1).map(r => r.value.default),
      opp: this.style.range.slice().sort((a, b) => a.order > b.order ? 1 : -1).map(r => r.value.default)
    }
    let sub_prize_default = {
      gov: this.style.roles.gov.slice().sort((a, b) => a.order > b.order ? 1 : -1).map(r => false),
      opp: this.style.roles.opp.slice().sort((a, b) => a.order > b.order ? 1 : -1).map(r => false)
    }
    let payload = {
      len: this.style.score_weights.length,
      score_default,
      sub_prize_default
    }
    this.init_result(payload)
  },
  watch: {
    '$route': function () {
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .card-container
    .el-card
      width 100%
      margin-bottom 2rem

  .home-button
    width 100%
    margin-left 0

  span.voted-for
    color red

</style>
