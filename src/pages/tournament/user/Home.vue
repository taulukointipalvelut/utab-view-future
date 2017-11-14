<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section.page-header
      h1 {{ { speaker: 'Debaters', adjudicator: 'Judges', audience: 'Audience' }[participant] }}
    el-card(v-if="compiled_markdown !== ''").info-card
      div.info-card-header(slot="header")
        h5(style="opacity: 0") {{ '----' }}
        .title
          h3 Important Notice
        .time
          h5 {{ info_time }}
      div.info-card-body(v-html="compiled_markdown")
    section
      loading-container(no_item_text="No Round Available")
        link-list(v-for="round in target_tournament.rounds.slice().sort((r1, r2) => r1.r > r2.r ? 1 : -1)", :key="round.r", v-if="!round.user_defined_data.hidden")
          legend(slot="legend") {{ round.name }}
          router-link(:to="url(round, 'draw')")
            link-list-item Draw &amp; Allocation
          router-link(:to="url(round, 'ballot')", v-if="is_adjudicator")
            link-list-item Score Sheet
          router-link(:to="url(round, 'feedback')", v-if="(is_speaker && round.user_defined_data.evaluate_from_teams) || (is_adjudicator && round.user_defined_data.evaluate_from_adjudicators)")
            link-list-item Judge Evaluation Sheet
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list'
import link_list_item from 'components/link-list-item'
import loading_container from 'components/loading-container'
import math from 'assets/js/math'
import marked from 'marked'

export default {
  props: ['participant'],
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item,
    'loading-container': loading_container
  },
  computed: {
    compiled_markdown () {
      let info = this.target_tournament.user_defined_data.info
      return marked(info ? info.text : '', { sanitize: true })
    },
    info_time () {
      let time = this.target_tournament.user_defined_data.info.time
      if (time !== undefined) {
        let date = new Date(time)
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' })
      } else {
        return ''
      }
    },
    is_adjudicator () {
      return this.participant === 'adjudicator'
    },
    is_speaker () {
      return this.participant === 'speaker'
    },
    is_audience () {
      return this.participant === 'audience'
    },
    filter () {
      if (this.is_adjudicator) {
        return 'adjudicator'
      } else if (this.is_speaker) {
        return 'team'
      } else {
        return ''
      }
    },
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'target_tournament',
      'round_href',
      'tournament_href'
    ])
  },
  methods: {
    capitalize: math.capitalize,
    url (round, target) {
      return 'rounds/'+round.r+'/'+target+'?filter='+this.filter
    }
  }
}
</script>

<style lang="stylus">
  body
    background-color #f5f5f5

  .page-header
    margin-bottom 1rem

  #app-content
    margin 0
    padding 0
    width 100%
    min-height 100vh
  a
    text-decoration none
    color inherit
  main
    padding 5%

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>
