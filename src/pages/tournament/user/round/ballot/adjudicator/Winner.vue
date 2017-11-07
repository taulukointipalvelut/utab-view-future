<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading")
      el-card
        el-form
          .sideinfo-header
              .team-label-wrapper(v-for="side in ['gov', 'opp']", :key="side")
                span {{ style.side_labels_short[side] }}
                span(v-if="!target_round.user_defined_data.no_speaker_score") {{ total(side) }} pts
          el-radio-group.winner-selector(:value="result.winner", @input="on_select_winner", size="large")
            el-radio-button.winner-selector__item(:label="score_sheet.teams.gov") {{ entity_name_by_id(score_sheet.teams.gov) }}
            el-radio-button.winner-selector__item(:label="score_sheet.teams.opp") {{ entity_name_by_id(score_sheet.teams.opp) }}

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
      return this.result.winner && this.result.winner !== ''
    },
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'entity_name_by_id',
      'style',
      'target_round'
    ]),
    ...mapState('ballot', [
      'result'
    ])
  },
  methods: {
    ...mapMutations('ballot', [
      'winner',
      'path_confirmed'
    ]),
    on_select_winner (winner) {
      this.winner({ winner })
    },
    on_prev () {
      if (this.target_round.user_defined_data.no_speaker_score) {
        this.$router.push('../home')
      } else {
        let speaker_sequence = this.style.speaker_sequence.slice().sort((s1, s2) => s1.order > s2.order ? 1 : -1)
        this.$router.push('score/'+speaker_sequence[this.style.speaker_sequence.length - 1].value)
      }
    },
    on_next () {
      if (this.target_round.user_defined_data.no_speaker_score) { this.path_confirmed() }
      this.$router.push('check')
    },
    total (side) {
      return this.result[side].matters.reduce((a, b) => a + b.value, 0) + this.result[side].manners.reduce((a, b) => a + b.value, 0)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-card
    width 100%
    margin-bottom 2rem
</style>
<style lang="stylus">
  @import "./ballot"

  .winner-selector,
  .sideinfo-header
    display flex
    width 100%
    font-size 14px

  .winner-selector
    justify-content center

    & .winner-selector__item
      width 50%

      & .el-radio-button__inner
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        width 100%

  .sideinfo-header
    justify-content space-around

    & .sideinfo-header__item
      flex 1
      margin auto .5rem

      &:last-child
        text-align right
</style>
