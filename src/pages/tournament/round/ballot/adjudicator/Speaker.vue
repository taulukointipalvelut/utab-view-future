<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading")
      el-card.gov
        div(slot="header").card-header-container
          span.card-title {{ team_by_id(score_sheet.teams.gov).name }}
          span.card-subtitle Gov
        el-form
          el-form-item(label="PM", required, error="Select PM's Name")
            el-select(:value="result.gov.speakers.leader", @input="on_gov_pos_name('leader', $event)", placeholder="Select PM")
              el-option(v-for="id in details_1(team_by_id(score_sheet.teams.gov)).speakers", :key="id", :label="speaker_by_id(id).name", :value="id")
          el-form-item(label="MG1", required, error="Select DPM's Name")
            el-select(:value="result.gov.speakers.deputy", @input="on_gov_pos_name('deputy', $event)", placeholder="Select DPM")
              el-option(v-for="id in details_1(team_by_id(score_sheet.teams.gov)).speakers", :key="id", :label="speaker_by_id(id).name", :value="id")
          el-form-item(label="MG2", required, error="Select MG's Name")
            el-select(:value="result.gov.speakers.member", @input="on_gov_pos_name('member', $event)", placeholder="Select MG")
              el-option(v-for="id in details_1(team_by_id(score_sheet.teams.gov)).speakers", :key="id", :label="speaker_by_id(id).name", :value="id")
          el-form-item(label="GR", required, error="Select GR's Name")
            el-select(:value="result.gov.speakers.reply", @input="on_gov_pos_name('reply', $event)", placeholder="Select GR")
              el-option(v-for="id in details_1(team_by_id(score_sheet.teams.gov)).speakers", :key="id", :label="speaker_by_id(id).name", :value="id")
      el-card.opp
        div(slot="header").card-header-container
          span.card-title {{ team_by_id(score_sheet.teams.opp).name }}
          span.card-subtitle Opp
        el-form
          el-form-item(label="LO", required, error="Select LO's Name")
            el-select(:value="result.opp.speakers.leader", @input="on_opp_pos_name('leader', $event)", placeholder="Select LO")
              el-option(v-for="id in details_1(team_by_id(score_sheet.teams.opp)).speakers", :key="id", :label="speaker_by_id(id).name", :value="id")
          el-form-item(label="MO1", required, error="Select DLO's Name")
            el-select(:value="result.opp.speakers.deputy", @input="on_opp_pos_name('deputy', $event)", placeholder="Select DLO")
              el-option(v-for="id in details_1(team_by_id(score_sheet.teams.opp)).speakers", :key="id", :label="speaker_by_id(id).name", :value="id")
          el-form-item(label="MO2", required, error="Select MO's Name")
            el-select(:value="result.opp.speakers.member", @input="on_opp_pos_name('member', $event)", placeholder="Select MO")
              el-option(v-for="id in details_1(team_by_id(score_sheet.teams.opp)).speakers", :key="id", :label="speaker_by_id(id).name", :value="id")
          el-form-item(label="OR", required, error="Select OR's Name")
            el-select(:value="result.opp.speakers.reply", @input="on_opp_pos_name('reply', $event)", placeholder="Select OR")
              el-option(v-for="id in details_1(team_by_id(score_sheet.teams.opp)).speakers", :key="id", :label="speaker_by_id(id).name", :value="id")
    section.buttons(v-if="!loading")
      el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
      el-button(type="primary" @click="on_next", :disabled="loading || !proceedable") Next #[el-icon(name="arrow-right")]
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { smartphone } from 'assets/js/media-query'
import loading_container from 'components/loading-container'

export default {
  components: {
    'loading-container': loading_container
  },
  props: ['score_sheet'],
  computed: {
    proceedable () {
      return Object.values(this.result.gov.speakers).every(id => id !== null) && Object.values(this.result.opp.speakers).every(id => id !== null)
    },
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'isAuth',
      'team_by_id',
      'speaker_by_id',
      'details_1'
    ]),
    ...mapState('ballot', [
      'result'
    ])
  },
  methods: {
    ...mapMutations('ballot', [
      'path_confirmed'
    ]),
    on_prev () {
      this.$router.push('../home')
    },
    on_next () {
      this.path_confirmed()
      this.$router.push('score/gov-leader')
    },
    on_gov_pos_name (pos_name, value) {
      this.$store.commit('ballot/gov_pos_name', { pos_name, value })
    },
    on_opp_pos_name (pos_name, value) {
      this.$store.commit('ballot/opp_pos_name', { pos_name, value })
    }
  }
}
</script>

<style lang="stylus">
  @import "./ballot"
</style>
