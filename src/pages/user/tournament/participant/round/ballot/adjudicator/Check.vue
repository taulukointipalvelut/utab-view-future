<template lang="pug">
  #ballot-speaker
    .card-container(v-if="path_valid")
      el-card(v-for="side in ['gov', 'opp']", :class="side", :key="side", v-if="!target_round.user_defined_data.no_speaker_score")
        div(slot="header").card-header-container
          span.card-title {{ entity_name_by_id(score_sheet.teams[side]) }}
          span.card-subtitle {{ style.side_labels_short[side] }}
        .outer-table
          .outer-table-tr(v-for="role in style.roles[side].slice().sort((r1, r2) => r1.order > r2.order ? 1 : -1)", :key="role.abbr")
            .outer-table-td.role
              .inner-table
                .inner-table-tr
                  .inner-table-td {{ role.abbr }}
                .inner-table-tr
                  .inner-table-td
                    i.fa.fa-star.small(style="border: 1px solid #333333", v-if="value(side, 'best', role.order)") BEST
                    br
                    i.fa.fa-hand-paper-o.small(style="border: 1px solid #333333", v-if="value(side, 'poi', role.order)") POI
            .outer-table-td.flex
              .inner-table.result
                .inner-table-tr.speaker
                  .inner-table-td {{ entity_name_by_id(value(side, 'speakers', role.order)) | defaults('Not specified yet') }}
                  .inner-table-td.right
                    router-link(:to="{ path: `score/${ side }-${ role.order }`, query: { prev: '../check' } }") #[el-icon(name="edit")]
                .inner-table-tr(v-if="target_round.user_defined_data.score_by_matter_manner")
                  .inner-table-td Matter
                  .inner-table-td.right {{ value(side, 'matters', role.order) }}
                .inner-table-tr(v-if="target_round.user_defined_data.score_by_matter_manner")
                  .inner-table-td Manner
                  .inner-table-td.right {{ value(side, 'manners', role.order) }}
                .inner-table-tr.total(v-if="target_round.user_defined_data.score_by_matter_manner")
                  .inner-table-td Total
                  .inner-table-td.right {{ value(side, 'matters', role.order) + value(side, 'manners', role.order) }}
                .inner-table-tr(v-if="!target_round.user_defined_data.score_by_matter_manner")
                  .inner-table-td Score
                  .inner-table-td.right {{ value(side, 'matters', role.order) + value(side, 'manners', role.order) }}
          .outer-table-tr
            .outer-table-td.role Total
            .outer-table-td.flex.right {{ total(side) }}

    .card-container(v-if="path_valid")
      el-card.flat
        .outer-table.no-border
          .outer-table-tr
            .outer-table-td.label Winner
            .outer-table-td.winner {{ entity_name_by_id(result.winner) | defaults('Not specified yet') }}
            .outer-table-td
              router-link(:to="{ path: `winner`, query: { prev: 'check' } }"): el-icon(name="edit")

    section.buttons(v-if="path_valid")
      el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
      el-button(type="primary" @click="dialog.check.visible = true", :disabled="!proceedable") {{ proceedable ? 'OK' : 'Low-Win/Tie-Win' }}

    p(v-if="!path_valid", style="text-align: center;") Sorry, you seem to have reloaded this page. Please try again.
    section.buttons(v-if="!path_valid")
      el-button(@click="on_home") #[i.fa.fa-home] Home

    el-dialog(title="Confirmation", :visible.sync="dialog.check.visible")
      .dialog-body
        .outer-table-tr.check__label
          p.declaration If this is correct, press Send button.
      .dialog-footer(slot="footer")
        el-button(@click="dialog.check.visible = false") Cancel
        el-button(type="primary", :loading="dialog.check.sending", @click="on_send") #[i.fa.fa-paper-plane] Send
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { smartphone } from 'assets/js/media-query'
import input_label from 'components/input-label'

export default {
  components: {
    'input-label': input_label
  },
  props: ['score_sheet'],
  data () {
    return {
      confirmed: false,
      dialog: {
        check: {
          sending: false,
          visible: false
        }
      }
    }
  },
  computed: {
    is_low_tie_win () {
      let win_side = this.score_sheet.teams.gov === this.result.winner ? 'gov' : 'opp'
      let lose_side = win_side === 'gov' ? 'opp' : 'gov'
      return this.total(win_side) - this.total(lose_side) <= 0
    },
    proceedable () {
      return this.target_round.user_defined_data.allow_low_tie_win || !this.is_low_tie_win
    },
    ...mapGetters([
      'entity_name_by_id',
      'target_tournament',
      'target_round',
      'style'
    ]),
    ...mapGetters('ballot', [
      'value'
    ]),
    ...mapState('ballot', [
      'result',
      'path_valid'
    ])
  },
  methods: {
    /*...mapMutations('ballot', [
      'reset_state'
    ]),*/
    ...mapActions('ballot', [
      'send_result'
    ]),
    on_home () {
      this.$router.push('/home')
    },
    on_prev () {
      //let speaker_sequence = this.style.speaker_sequence.slice().sort((s1, s2) => s1.order > s2.order ? 1 : -1)
      this.$router.push('winner')
    },
    on_send () {
      this.dialog.check.sending = true
      let winner = this.result.winner
      let side = this.score_sheet.teams.gov === winner ? 'gov' : 'opp'
      this.send_result({ score_sheet: this.score_sheet, tournament: this.target_tournament })
        .then(() => {
          this.$router.push({ query: { winner, side } })
        })
        .then(() => {
          this.dialog.check.visible = false
          this.dialog.check.sending = false
        })
    },
    total (side) {
      return this.result[side].matters.reduce((a, b) => a + b.value, 0) + this.result[side].manners.reduce((a, b) => a + b.value, 0)
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

  p.declaration
    font-size 1.3rem
    text-align center

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
