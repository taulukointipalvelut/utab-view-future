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
    router-view(v-if="round && adjudicator", :tournament="tournament", :round="round", :score_sheet="score_sheet", :loading="loading")
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
      'auth'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament',
      'target_adjudicator',
      'target_score_sheets'
    ]),
    ...mapGetters('ballot', [
      'current_step'
    ]),
    score_sheet() {
      return this.target_score_sheets.find(ss => ss.id === this.target_adjudicator.id)
    }
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
    await this.init_teams()
    await this.init_ballot({ score_sheet: this.score_sheet })
    this.loading = false
  }
}
</script>
