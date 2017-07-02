<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading && has_teams")
      el-card.gov
        div(slot="header").card-header-container
          span.card-title {{ gov.team.name }}
          span.card-subtitle Gov
        .outer-table
          .outer-table-tr(v-for="role in roles")
            .outer-table-td.role
              .inner-table
                .inner-table-tr
                  .inner-table-td {{ style.roles.gov[role].abbr }}
                .inner-table-tr
                  .inner-table-td
                    i.fa.fa-star.small(v-if="gov.result[role].best_debater")
                    i.fa.fa-hand-paper-o.small(v-if="gov.result[role].poi_prize")
            .outer-table-td.flex
              .inner-table.result
                .inner-table-tr.speaker
                  .inner-table-td {{ get_speaker_name(gov.team.speakers, gov.result[role].speaker_id) | defaults('Not specified yet') }}
                  .inner-table-td.right
                    router-link(:to="{ path: `score/gov-${ role }`, query: { prev: '../check' } }") #[el-icon(name="edit")]
                .inner-table-tr
                  .inner-table-td Matter
                  .inner-table-td.right {{ gov.result[role].matter }}
                .inner-table-tr
                  .inner-table-td Manner
                  .inner-table-td.right {{ gov.result[role].manner }}
                .inner-table-tr.total
                  .inner-table-td Total
                  .inner-table-td.right {{ Number(gov.result[role].matter) + Number(gov.result[role].manner) }}
          .outer-table-tr
            .outer-table-td.role Total
            .outer-table-td.flex.right {{ total(gov) }}

      el-card.opp
        div(slot="header").card-header-container
          span.card-title {{ opp.team.name }}
          span.card-subtitle Opp
        .outer-table
          .outer-table-tr(v-for="role in roles")
            .outer-table-td.role
              .inner-table
                .inner-table-tr
                  .inner-table-td {{ style.roles.opp[role].abbr }}
                .inner-table-tr
                  .inner-table-td
                    i.fa.fa-star.small(v-if="opp.result[role].best_speaker")
                    i.fa.fa-hand-paper-o.small(v-if="opp.result[role].poi_prize")
            .outer-table-td.flex
              .inner-table.result
                .inner-table-tr.speaker
                  .inner-table-td {{ get_speaker_name(opp.team.speakers, opp.result[role].speaker_id) | defaults('Not specified yet') }}
                  .inner-table-td.right
                    router-link(:to="{ path: `score/opp-${ role }`, query: { prev: '../check' } }") #[el-icon(name="edit")]
                .inner-table-tr
                  .inner-table-td Matter
                  .inner-table-td.right {{ opp.result[role].matter }}
                .inner-table-tr
                  .inner-table-td Manner
                  .inner-table-td.right {{ opp.result[role].manner }}
                .inner-table-tr.total
                  .inner-table-td Total
                  .inner-table-td.right {{ Number(opp.result[role].matter) + Number(opp.result[role].manner) }}
          .outer-table-tr
            .outer-table-td.role Total
            .outer-table-td.flex.right {{ total(opp) }}

    .card-container(v-if="!loading && has_teams")
      el-card.flat
        .outer-table.no-border
          .outer-table-tr
            .outer-table-td.label Winner
            .outer-table-td.winner {{ gov.team.name | defaults('Not specified yet') }}
            .outer-table-td
              router-link(:to="{ path: `winner`, query: { prev: 'check' } }"): el-icon(name="edit")
          .outer-table-tr.sign__label
            .outer-table-td.label Signature
          .outer-table-tr.sign
            .outer-table-td
              input.sign__input(type="text", v-model="signature", :placeholder="adjudicator.name")
              p.notice Enter your name to confirm the validity of this ballot

    section.buttons(v-if="!loading")
      el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
      el-button(type="primary" @click="on_next", :loading="sending", :disabled="loading || !sendable") {{ sending ? 'Sending...' : 'Send' }} #[i.fa.fa-paper-plane]
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { smartphone } from 'assets/js/media-query'
import loading_container from 'components/loading-container'
import input_label from 'components/input-label'

export default {
  props: ['tournament', 'round', 'adjudicator', 'teams', 'loading'],
  components: {
    'loading-container': loading_container,
    'input-label': input_label
  },
  data () {
    return {
      sending: false,
      signature: ''
    }
  },
  computed: {
    sendable () {
      return this.signature.toLocaleLowerCase() === this.adjudicator.name.toLocaleLowerCase()
    },
    has_teams () {
      return this.teams && this.teams.length > 0
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
      'winner',
      'style',
      'roles'
    ])
  },
  methods: {
    on_prev () {
      this.$router.push('score/gov-reply')
    },
    on_next () {
      this.sending = true
      setTimeout(() => {
        this.sending = false
        this.$router.push('done')
      }, 2000)
    },
    total (side) {
      return Object.values(side.result).map(x => x.matter + x.manner).reduce((a, b) => a + b, 0)
    },
    get_speaker (speakers, id) {
      return speakers.find(speaker => speaker.id === id)
    },
    get_speaker_name (speakers, id) {
      const speaker = this.get_speaker(speakers, id)
      return speaker ? speaker.name : ''
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
    width 50%
    font-weight bold
  
  .outer-table .outer-table-tr.sign__label
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
