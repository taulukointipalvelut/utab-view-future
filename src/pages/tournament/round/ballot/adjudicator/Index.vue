<template lang="pug">
  loading-container.router-view-content(:loading="!round || !adjudicator", no_item_text="Fail to load round/adjudicator data")
    section.page-header(v-if="round && adjudicator")
      h1 {{ adjudicator.name }}
      h3 {{ round.name }}
    section(v-if="round && adjudicator")
      el-steps(:active="current_step", finish-status="success", center)
        el-step(title="Speaker")
        el-step(title="Score")
        el-step(title="Winner")
        el-step(title="Check")
        el-step(title="Done")
    router-view(v-if="round && adjudicator", :score_sheet="score_sheet")
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapActions } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  props: ['r_str', 'id_str'],
  components: {
    'loading-container': loading_container
  },
  computed: {
    round() {
      return this.round_by_r(this.r_str)
    },
    adjudicator () {
      return this.adjudicator_by_id(this.id_str)
    },
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'isAuth',
      'target_score_sheets',
      'round_by_r',
      'adjudicator_by_id',
      'score_sheet_by_id'
    ]),
    ...mapGetters('ballot', [
      'current_step'
    ]),
    score_sheet () {
      return this.score_sheet_by_id(this.id_str)
    }
  },
  methods: {
    ...mapActions([
      'init_teams'
    ]),
    ...mapActions('ballot', [
      'init_ballot'
    ])
  }/*,
  async mounted () {
    await this.init_teams()
    await this.init_ballot({ score_sheet: this.score_sheet })
    this.loading = false
  }*/
}
</script>
