<template lang="pug">
  #ballot-speaker
    .card-container(v-if="score_sheet")
      el-card(v-for="side in ['gov', 'opp']", :class="side", :key="side")
        div(slot="header").card-header-container
          span.card-title {{ entity_name_by_id(score_sheet.teams[side]) }}
          span.card-subtitle {{ style.side_labels_short[side] }}
        el-form
          el-form-item(v-for="role in style.roles[side].slice().sort((r1, r2) => r1.order > r2.order ? 1 : -1)", :key="role.abbr", :label="role.abbr", required, :error='"Select "+role.abbr+"\'s Name"')
            el-select(:value="value(side, 'speakers', role.order)", @input="on_speaker_name(side, role.order, $event)", :placeholder="'Select '+role.abbr")
              el-option(v-for="id in access_detail(entity_by_id[score_sheet.teams[side]], r_str).speakers", :key="id", :label="entity_name_by_id(id)", :value="id")
    section.buttons
      el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
      el-button(type="primary" @click="on_next", :disabled="!proceedable") Next #[el-icon(name="arrow-right")]
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { smartphone } from 'assets/js/media-query'
import math from 'assets/js/math.js'

export default {
  props: ['score_sheet', 'r_str'],
  computed: {
    proceedable () {
      return this.result.gov.speakers.every(s => s.value !== null) && this.result.opp.speakers.every(s => s.value !== null)
    },
    ...mapState([
      'auth'
    ]),
    ...mapState('ballot', [
      'result'
    ]),
    ...mapGetters([
      'entity_by_id',
      'entity_name_by_id',
      'access_detail',
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
