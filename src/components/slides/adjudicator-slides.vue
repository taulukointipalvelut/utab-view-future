<template lang="pug">
  slides-wrapper(title="Adjudicator Results", :max_ranking_rewarded="max_ranking_rewarded", :credit="credit", :organized_results="organized_results", label="adjudicators", :type="type", @close="$emit('close')")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import slides_wrapper from 'components/slides/slides-wrapper.vue'

export default {
  name: 'adjudicator-slides',
  components: {
    'slides-wrapper': slides_wrapper
  },
  props: ['credit', 'type', 'max_ranking_rewarded', 'tournament'],
  data () {
    return {
      started: false
    }
  },
  computed: {
    organized_results () {
      let organized_results = []
      for (let compiled_result of this.target_tournament.compiled_adjudicator_results) {
        let adjudicator = this.entity_by_id[compiled_result.id]
        let result = Object.assign({}, compiled_result)
        result.name = adjudicator.name
        //result.teams = this.teams_by_adjudicator_id(adjudicator.id).map(t => t.name)
        organized_results.push(result)
      }
      return organized_results
    },
    ...mapGetters([
      'target_tournament',
      'entity_by_id',
      'teams_by_adjudicator_id'
    ])
  },
  mounted () {
    this.started = true
  }
}
</script>
