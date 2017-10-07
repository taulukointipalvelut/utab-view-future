<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading && path_valid")
      el-card.gov
        div(slot="header").card-header-container
          span.card-title {{ team_by_id(score_sheet.teams.gov).name }}
          span.card-subtitle Gov
        .outer-table
          .outer-table-tr(v-for="role in roles", :key="role")
            .outer-table-td.role
              .inner-table
                .inner-table-tr
                  .inner-table-td {{ style.roles.gov[role].abbr }}
                .inner-table-tr
                  .inner-table-td
                    i.fa.fa-star.small(style="border: 1px solid #333333", v-if="result.gov.best[role]") BEST
                    br
                    i.fa.fa-hand-paper-o.small(style="border: 1px solid #333333", v-if="result.gov.poi[role]") POI
            .outer-table-td.flex
              .inner-table.result
                .inner-table-tr.speaker
                  .inner-table-td {{ speaker_by_id(result.gov.speakers[role]).name | defaults('Not specified yet') }}
                  .inner-table-td.right
                    router-link(:to="{ path: `score/gov-${ role }`, query: { prev: '../check' } }") #[el-icon(name="edit")]
                .inner-table-tr
                  .inner-table-td Matter
                  .inner-table-td.right {{ result.gov.matters[role] }}
                .inner-table-tr
                  .inner-table-td Manner
                  .inner-table-td.right {{ result.gov.manners[role] }}
                .inner-table-tr.total
                  .inner-table-td Total
                  .inner-table-td.right {{ Number(result.gov.matters[role]) + Number(result.gov.manners[role]) }}
          //.outer-table-tr
            .outer-table-td.role Total
            .outer-table-td.flex.right {{ total('gov') }}

      el-card.opp
        div(slot="header").card-header-container
          span.card-title {{ team_by_id(score_sheet.teams.opp).name }}
          span.card-subtitle Opp
        .outer-table
          .outer-table-tr(v-for="role in roles")
            .outer-table-td.role
              .inner-table
                .inner-table-tr
                  .inner-table-td {{ style.roles.opp[role].abbr }}
                .inner-table-tr
                  .inner-table-td
                    i.fa.fa-star.small(style="border: 1px solid #333333", v-if="result.opp.best[role]") BEST
                    br
                    i.fa.fa-hand-paper-o.small(style="border: 1px solid #333333", v-if="result.opp.poi[role]") POI
            .outer-table-td.flex
              .inner-table.result
                .inner-table-tr.speaker
                  .inner-table-td {{ speaker_by_id(result.opp.speakers[role]).name | defaults('Not specified yet') }}
                  .inner-table-td.right
                    router-link(:to="{ path: `score/opp-${ role }`, query: { prev: '../check' } }") #[el-icon(name="edit")]
                .inner-table-tr
                  .inner-table-td Matter
                  .inner-table-td.right {{ result.opp.matters[role] }}
                .inner-table-tr
                  .inner-table-td Manner
                  .inner-table-td.right {{ result.opp.manners[role] }}
                .inner-table-tr.total
                  .inner-table-td Total
                  .inner-table-td.right {{ Number(result.opp.matters[role]) + Number(result.opp.manners[role]) }}
          //.outer-table-tr
            .outer-table-td.role Total
            .outer-table-td.flex.right {{ total('opp') }}

    .card-container(v-if="!loading && path_valid")
      el-card.flat
        .outer-table.no-border
          .outer-table-tr
            .outer-table-td.label Winner
            .outer-table-td.winner {{ team_by_id(result.winner).name | defaults('Not specified yet') }}
            .outer-table-td
              router-link(:to="{ path: `winner`, query: { prev: 'check' } }"): el-icon(name="edit")
          .outer-table-tr.check__label
            .outer-table-td.label I declare the result above is correct
            .outer-table-td
              el-checkbox(v-model="confirmed") Yes

    section.buttons(v-if="!loading && path_valid")
      el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
      el-button(type="primary" @click="on_next", :loading="sending", :disabled="loading || !confirmed") {{ sending ? 'Sending...' : 'Send' }} #[i.fa.fa-paper-plane]

    p(v-if="!loading && !path_valid", style="text-align: center;") Sorry, you seem to have reloaded this page. Please try again.
    section.buttons(v-if="!loading")
      el-button(@click="on_home") #[i.fa.fa-home] Home
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { smartphone } from 'assets/js/media-query'
import loading_container from 'components/loading-container'
import input_label from 'components/input-label'

export default {
  components: {
    'loading-container': loading_container,
    'input-label': input_label
  },
  props: ['score_sheet'],
  data () {
    return {
      sending: false,
      confirmed: false
    }
  },
  computed: {
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'isAuth',
      'team_by_id',
      'speaker_by_id',
      'target_tournament'
    ]),
    ...mapState('ballot', [
      'result',
      'roles',
      'style',
      'path_valid'
    ])
  },
  methods: {
    ...mapMutations('ballot', [
      'reset_state'
    ]),
    ...mapActions('ballot', [
      'send_ballot'
    ]),
    ...mapActions([
      'init_all'
    ]),
    on_home () {
      this.$router.push('/home')
    },
    on_prev () {
      this.$router.push('score/gov-reply')
    },
    on_next () {
      this.sending = true
      this.send_ballot({ score_sheet: this.score_sheet, tournament: this.target_tournament })
        .then(this.init_all)
        .then(() => {
          this.reset_state()
          this.sending = false
          this.$router.push('done')
        })
    },
    total (side) {
      return Object.values(this.result[side].matters).reduce((a, b) => a + b, 0) + Object.values(this.result[side].manners).reduce((a, b) => a + b, 0)
    }
  },
  filters: {
    defaults (value, d_value) {
      return value && value !== '' ? value : d_value
    }
  }
}
</script>

<style lang="stylus">
  @import "./ballot"
</style>
<style lang="stylus" scoped>
  .outer-table,
    display block

    & .outer-table-tr
      display flex
      justify-content space-between
      padding-bottom 1rem
      margin-bottom 1rem

      &:last-child
        padding-bottom 0
        margin-bottom 0

      & .outer-table-td
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        display inline-block
        margin-right 1rem

        &:last-child
          margin-right 0

        &.flex
          width 75%

    &:not(.no-border) .outer-table-tr
        border-bottom 1px solid #dadada

        &:last-child
          border-bottom 0 none transparent

  .inner-table,
  .inner-table-td
    display inline-block

  .outer-table,
  .inner-table
    width 100%

  .inner-table-tr
    display flex
    justify-content space-between

  .result .inner-table-tr:not(.speaker)
      color rgba(0,0,0,.54)

  .right
    text-align right

  .total
    border-top 1px dotted #dadada

  .speaker .inner-table-td
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
    font-weight bold
    margin-bottom 1rem

  .role .inner-table-tr
    margin-bottom 1rem

  i.fa.small
    font-size .75em

  .el-card.flat
    width 100%
    margin-bottom 2rem

  .winner
    border-bottom solid 3px #ff0f0f
    font-size 150%
    width 50%
    font-weight bold

  .outer-table .outer-table-tr.check__label
    margin-bottom 0
    padding-bottom 0

  .sign .outer-table-td
    width 100%

  input.sign__input
    width 100%
    border: 0 none transparent
    border-bottom: 1px solid #20a0ff
    outline:none;
    text-align right
    font-size: 1.3em;
    font-family: 'Rochester', cursive;

  .notice
    width 100%
    text-align right
    font-size .8em
    margin-top 3px
    margin-bottom 0
    line-height .9
    word-wrap break-word
    white-space normal
</style>
