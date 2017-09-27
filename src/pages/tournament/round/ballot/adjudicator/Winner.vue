<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading && has_teams")
      el-card
        el-form
          .winner-selector
            .winner-selector__item.sideinfo-header
              .sideinfo-header__item Gov
              .sideinfo-header__item {{ total(gov) }}
            .winner-selector__item.sideinfo-header
              .sideinfo-header__item Opp
              .sideinfo-header__item {{ total(opp) }}
          el-radio-group.winner-selector(:value="winner", @input="on_selected($event)", size="large")
            el-radio-button.winner-selector__item(:label="gov.team.name")
            el-radio-button.winner-selector__item(:label="opp.team.name")

    section.buttons(v-if="!loading")
      el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
      el-button(type="primary" @click="on_next", :disabled="loading || !proceedable") Next #[el-icon(name="arrow-right")]
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
    proceedable () {
      return this.winner && this.winner !== ''
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
      'opp',
      'winner'
    ])
  },
  methods: {
    on_prev () {
      this.$router.push('score/gov-reply')
    },
    on_next () {
      this.$router.push('check')
    },
    option_label (speaker_name, team_name) {
      return smartphone() ? speaker_name : `${ speaker_name } (${ team_name })`
    },
    on_selected (winner) {
      this.$store.commit('ballot/winner', { winner })
    },
    total (side) {
      return Object.values(side.result).map(x => x.matter + x.manner).reduce((a, b) => a + b, 0)
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
