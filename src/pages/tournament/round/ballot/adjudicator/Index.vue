<template lang="pug">
  loading-container.router-view-content(:loading="!round || !adjudicator", no_item_text="Fail to load round/adjudicator data")
    section.page-header(v-if="round && adjudicator")
      h1 {{ adjudicator.name }}
      h3 {{ round.round_name }}
    section(v-if="round && adjudicator")
      el-steps(:active="current_step", finish-status="success", center)
        el-step(title="Speaker")
        el-step(title="Score")
        el-step(title="Winner")
        el-step(title="Check")
        el-step(title="Done")
    router-view(v-if="round && adjudicator", :tournament="tournament", :round="round", :adjudicator="adjudicator", :teams="teams", :loading="loading")
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapActions } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  props: ['tournament', 'round', 'adjudicator_name'],
  components: {
    'loading-container': loading_container
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    adjudicator () {
      return this.target_adjudicator
    },
    ...mapState([
      'auth',
      'teams'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament',
      'target_adjudicator'
    ]),
    ...mapGetters('ballot', [
      'current_step'
    ])
  },
  methods: {
    ...mapActions([
      'init_teams'
    ]),
    ...mapActions('ballot', [
      'init_ballot'
    ])
  },
  async mounted () {
    await this.init_teams({
      tournament: this.tournament,
      adjudicator: this.tournament.adjudicator
    })
    await this.init_ballot({
      teams: this.tournament.teams
    })
    this.loading = false
  }
}
</script>
