<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading && path_valid")
      el-card(v-for="side in ['gov', 'opp']", :class="side", :key="side")
        div(slot="header").card-header-container
          span.card-title {{ entity_by_id(score_sheet.teams[side]).name }}
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
                  .inner-table-td {{ entity_by_id(value(side, 'speakers', role.order)).name | defaults('Not specified yet') }}
                  .inner-table-td.right
                    router-link(:to="{ path: `score/${ side }-${ role.order }`, query: { prev: '../check' } }") #[el-icon(name="edit")]
                .inner-table-tr
                  .inner-table-td Matter
                  .inner-table-td.right {{ value(side, 'matters', role.order) }}
                .inner-table-tr
                  .inner-table-td Manner
                  .inner-table-td.right {{ value(side, 'manners', role.order) }}
                .inner-table-tr.total
                  .inner-table-td Total
                  .inner-table-td.right {{ value(side, 'matters', role.order) + value(side, 'manners', role.order) }}
          //.outer-table-tr
            .outer-table-td.role Total
            .outer-table-td.flex.right {{ total(side) }}

    .card-container(v-if="!loading && path_valid")
      el-card.flat
        .outer-table.no-border
          .outer-table-tr
            .outer-table-td.label Winner
            .outer-table-td.winner {{ entity_by_id(result.winner).name | defaults('Not specified yet') }}
            .outer-table-td
              router-link(:to="{ path: `winner`, query: { prev: 'check' } }"): el-icon(name="edit")

    section.buttons(v-if="!loading && path_valid")
      el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
      el-button(type="primary" @click="dialog.check.visible = true") OK

    p(v-if="!loading && !path_valid", style="text-align: center;") Sorry, you seem to have reloaded this page. Please try again.
    section.buttons(v-if="!loading && !path_valid")
      el-button(@click="on_home") #[i.fa.fa-home] Home

    el-dialog(title="Confirmation", :visible.sync="dialog.check.visible")
      .dialog-body
        .outer-table-tr.check__label
          p I declare the result is correct.
          el-checkbox(v-model="dialog.check.checked") Yes
      .dialog-footer(slot="footer")
        el-button(@click="dialog.check.visible = false") Cancel
        el-button(type="primary", :loading="dialog.check.sending", @click="on_send", :disabled="!dialog.check.checked") #[i.fa.fa-paper-plane] Send
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
      confirmed: false,
      dialog: {
        check: {
          sending: false,
          visible: false,
          checked: false
        }
      }
    }
  },
  computed: {
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'entity_by_id',
      'target_tournament',
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
    ...mapActions([
      'init_all'
    ]),
    on_home () {
      this.$router.push('/home')
    },
    on_prev () {
      let speaker_sequence = this.style.speaker_sequence.slice().sort((s1, s2) => s1.order > s2.order ? 1 : -1)
      this.$router.push('score/'+speaker_sequence[this.style.speaker_sequence.length - 1].value)
    },
    on_send () {
      this.sending = true
      this.dialog.check.checked = false
      let winner = this.result.winner
      let side = this.score_sheet.teams.gov === winner ? 'gov' : 'opp'
      this.send_result({ score_sheet: this.score_sheet, tournament: this.target_tournament })
        .then(this.init_all)
        .then(() => {
          //this.reset_state()
          this.sending = false
          this.dialog.check.visible = false
          this.$router.push('done?winner='+winner+'&side='+side)
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
