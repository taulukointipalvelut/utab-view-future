<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading && score_sheet")
      el-card(v-for="side in ['gov', 'opp']", :class="side", :key="side")
        div(slot="header").card-header-container
          span.card-title {{ entity_by_id(score_sheet.teams[side]).name }}
          span.card-subtitle {{ style.side_labels_short[side] }}
        el-form
          el-form-item(v-for="role in style.roles[side].slice().sort((r1, r2) => r1.order > r2.order ? 1 : -1)", :key="role.abbr", :label="role.abbr", required, :error='"Select "+role.abbr+"\'s Name"')
            el-select(:value="value(side, 'speakers', role.order)", @input="on_speaker_name(side, role.order, $event)", :placeholder="'Select '+role.abbr")
              el-option(v-for="id in details_1(entity_by_id(score_sheet.teams[side])).speakers", :key="id", :label="entity_by_id(id).name", :value="id")
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
      'result'
    ]),
    ...mapGetters([
      'entity_by_id',
      'details_1',
      'style'
    ]),
    ...mapGetters('ballot', [
      'value'
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
      let speaker_sequence = this.style.speaker_sequence.slice().sort((s1, s2) => s1.order > s2.order ? 1 : -1)
      this.$router.push('score/'+speaker_sequence[0].value)
    },
    on_speaker_name (side, role_order, value) {
      this.input_result({ side, key: 'speakers', role_order, value })
    }
  }
}
</script>

<style lang="stylus">
  @import "./ballot"
</style>
