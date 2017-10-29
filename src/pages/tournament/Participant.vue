<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section.page-header
      h1 {{ capitalize(participant) }}
    section
      loading-container(:loading="loading", no_item_text="No Round Available")
        link-list(v-for="round in target_tournament.rounds.slice().sort((r1, r2) => r1.r > r2.r ? 1 : -1)", :key="round.r", v-if="!loading && !round.user_defined_data.hidden")
          legend(slot="legend") {{ round.name }}
          router-link(:to="url(round, 'draw')")
            link-list-item Draw &amp; Allocation
          router-link(:to="url(round, 'ballot')", v-if="participant === 'adjudicator'")
            link-list-item Score Sheet
          router-link(:to="url(round, 'feedback')", v-if="(participant === 'speaker') || (participant === 'adjudicator' && round.user_defined_data.evaluate_each_other)")
            link-list-item Judge Evaluation Sheet
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list'
import link_list_item from 'components/link-list-item'
import loading_container from 'components/loading-container'
import math from 'assets/js/math'

export default {
  props: ['loading', 'participant'],
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item,
    'loading-container': loading_container
  },
  computed: {
    has_rounds () {
      return this.target_tournament.rounds && this.target_tournament.rounds.length > 0
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
    url (round, ...targets) {
      return `${ this.round_href(round).path }/${ targets.join('/') }`+'?filter=adjudicator'
    },
    ...mapActions([
      'init_one'
    ]),
    login_pagination (usertype) {
      return new Promise((resolve, reject) => {
        let tournament = this.target_tournament
        if (usertype === 'superuser') {//NO LOGIN REQUIRED
          resolve(false)
        } else if (['organizer', 'audience', 'adjudicator', 'speaker'].includes(usertype) && this.auth.tournaments.includes(tournament.id)) {////NO LOGIN REQUIRED WITH CONDITIONS
          resolve(false)
        } else if (['audience', 'adjudicator', 'speaker'].includes(this.participant) && !tournament.auth[this.participant].required) {
          resolve(false)
        } else {//LOGIN REQUIRED
          this.$router.push(this.tournament_href(tournament).path+'/login?usertype='+this.participant)
          resolve(true)
        }
      })
    }
  },
  mounted () {
    this.login_pagination(this.auth.usertype)
        .then(page_change => {
          if (!page_change) {
            this.init_one({ tournament: this.target_tournament })
          }
        })
  },
  watch: {
    'auth.usertype': function (usertype) {
      this.login_pagination(usertype)
    }
  }
}
</script>

<style lang="stylus">
  body
    background-color #f5f5f5
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
