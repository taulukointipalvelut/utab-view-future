<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading")
      el-card
        el-form
          .winner-selector
            .winner-selector__item.sideinfo-header
              div(v-for="side in ['gov', 'opp']", :key="side").sideinfo-header__item {{ style.side_labels_short[side] }}
              //.sideinfo-header__item {{ total(side) }} pts
          el-radio-group.winner-selector(:value="result.winner", @input="on_select_winner", size="large")
            el-radio-button.winner-selector__item(:label="score_sheet.teams.gov") {{ team_by_id(score_sheet.teams.gov).name }}
            el-radio-button.winner-selector__item(:label="score_sheet.teams.opp") {{ team_by_id(score_sheet.teams.opp).name }}

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
      'isAuth',
      'team_by_id',
      'style'
    ]),
    ...mapState('ballot', [
      'result'
    ])
  },
  methods: {
    ...mapMutations('ballot', [
      'winner'
    ]),
    on_select_winner (winner) {
      this.winner({ winner })
    },
    on_prev () {
      this.$router.push('score/'+this.style.speaker_sequence[this.style.speaker_sequence.length - 1])
    },
    on_next () {
      this.$router.push('check')
    },
    total (side) {
      return Object.values(this.score_sheet.input_result[side].matters).reduce((a, b) => a + b, 0) + Object.values(this.score_sheet.input_result[side].manners).reduce((a, b) => a + b, 0)
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
    justify-content space-between

    & .sideinfo-header__item
      flex 1
      margin auto .5rem

      &:last-child
        text-align right
</style>
