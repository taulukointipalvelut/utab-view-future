<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading && has_teams")
      el-card.gov
        div(slot="header").card-header-container
          span.card-title {{ gov.team.name }}
          span.card-subtitle Gov
        el-form
          el-form-item(label="PM", required, error="Select PM's Name")
            el-select(:value="gov.result.leader.id", @input="on_gov_pos_name('leader', $event)", placeholder="Select PM")
              el-option(v-for="speaker in gov.team.speakers", :key="speaker", :label="option_label(speaker.name, gov.team.name)", :value="speaker.id")
          el-form-item(label="DPM", required, error="Select DPM's Name")
            el-select(:value="gov.result.deputy.id", @input="on_gov_pos_name('deputy', $event)", placeholder="Select DPM")
              el-option(v-for="speaker in gov.team.speakers", :key="speaker", :label="option_label(speaker.name, gov.team.name)", :value="speaker.id")
          el-form-item(label="MG", required, error="Select MG's Name")
            el-select(:value="gov.result.member.id", @input="on_gov_pos_name('member', $event)", placeholder="Select MG")
              el-option(v-for="speaker in gov.team.speakers", :key="speaker", :label="option_label(speaker.name, gov.team.name)", :value="speaker.id")
          el-form-item(label="GR", required, error="Select GR's Name")
            el-select(:value="gov.result.reply.id", @input="on_gov_pos_name('reply', $event)", placeholder="Select GR")
              el-option(v-for="speaker in gov.team.speakers", :key="speaker", :label="option_label(speaker.name, gov.team.name)", :value="speaker.id")
      el-card.opp
        div(slot="header").card-header-container
          span.card-title {{ opp.team.name }}
          span.card-subtitle Opp
        el-form
          el-form-item(label="LO", required, error="Select LO's Name")
            el-select(:value="opp.result.leader.id", @input="on_opp_pos_name('leader', $event)", placeholder="Select LO")
              el-option(v-for="speaker in opp.team.speakers", :key="speaker", :label="option_label(speaker.name, opp.team.name)", :value="speaker.id")
          el-form-item(label="DLO", required, error="Select DLO's Name")
            el-select(:value="opp.result.deputy.id", @input="on_opp_pos_name('deputy', $event)", placeholder="Select DLO")
              el-option(v-for="speaker in opp.team.speakers", :key="speaker", :label="option_label(speaker.name, opp.team.name)", :value="speaker.id")
          el-form-item(label="MO", required, error="Select MO's Name")
            el-select(:value="opp.result.member.id", @input="on_opp_pos_name('member', $event)", placeholder="Select MO")
              el-option(v-for="speaker in opp.team.speakers", :key="speaker", :label="option_label(speaker.name, opp.team.name)", :value="speaker.id")
          el-form-item(label="OR", required, error="Select OR's Name")
            el-select(:value="opp.result.reply.id", @input="on_opp_pos_name('reply', $event)", placeholder="Select OR")
              el-option(v-for="speaker in opp.team.speakers", :key="speaker", :label="option_label(speaker.name, opp.team.name)", :value="speaker.id")
    section.buttons(v-if="!loading")
      el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
      el-button(type="primary" @click="on_next", :disabled="loading || !sendable") Next #[el-icon(name="arrow-right")]
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { smartphone } from 'assets/js/media-query'
import loading_container from 'components/loading-container'

export default {
  props: ['tournament', 'round', 'adjudicator', 'loading'],
  components: {
    'loading-container': loading_container
  },
  computed: {
    sendable () {
      return Object.values(this.gov.result).every(role => role.id) && Object.values(this.opp.result).every(role => role.id)
    },
    has_teams () {
      return this.tournament.teams && this.tournament.teams.length > 0
    },
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'isAuth'
    ]),
    ...mapState('ballot', [
      'gov',
      'opp'
    ])
  },
  methods: {
    on_prev () {
      this.$router.push('../home')
    },
    on_next () {
      this.$router.push('score/gov-leader')
    },
    option_label (speaker_name, team_name) {
      return smartphone() ? speaker_name : `${ speaker_name } (${ team_name })`
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
