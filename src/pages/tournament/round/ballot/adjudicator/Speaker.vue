<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading && score_sheet")
      el-card(v-for="side in ['gov', 'opp']", :class="side", :key="side")
        div(slot="header").card-header-container
          span.card-title {{ team_by_id(score_sheet.teams[side]).name }}
          span.card-subtitle {{ style.side_labels_short[side] }}
        el-form
          el-form-item(v-for="role in style.roles[side].slice().sort((r1, r2) => r1.order > r2.order ? 1 : -1)", :key="role.abbr", :label="role.abbr", required, error="'Select PM's Name'")
            el-select(:value="ballot[side].speakers[role.abbr]", @input="on_speaker_name(side, role.abbr, $event)", :placeholder="'Select '+role.abbr")
              el-option(v-for="id in details_1(team_by_id(score_sheet.teams.gov)).speakers", :key="id", :label="speaker_by_id(id).name", :value="id")
    section.buttons(v-if="!loading")
      el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
      el-button(type="primary" @click="on_next", :disabled="loading || !proceedable") Next #[el-icon(name="arrow-right")]
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { smartphone } from 'assets/js/media-query'
import loading_container from 'components/loading-container'
import math from 'assets/js/math.js'

export default {
  components: {
    'loading-container': loading_container
  },
  props: ['score_sheet'],
  computed: {
    proceedable () {
      return true//Object.values(this.result.gov.speakers).every(id => id !== null) && Object.values(this.result.opp.speakers).every(id => id !== null)
    },
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapState('ballot', [
      'ballot'
    ]),
    ...mapGetters([
      'isAuth',
      'team_by_id',
      'speaker_by_id',
      'details_1',
      'style'
    ])
  },
  methods: {
    ...mapMutations('ballot', [
      'input_result',
      'path_confirmed'
    ]),
    on_prev () {
      this.$router.push('../home')
    },
    on_next () {
      this.path_confirmed()
      this.$router.push('score/'+this.style.speaker_sequence[0])
    },
    on_speaker_name (side, role, value) {
      this.input_result({ side, key: 'speakers', role, value })
    }
  }
}
</script>

<style lang="stylus">
  @import "./ballot"
</style>
