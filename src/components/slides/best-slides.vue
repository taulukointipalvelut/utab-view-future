<template lang="pug">
  slides-wrapper(title="Best Debater Results", :max_ranking_rewarded="max_ranking_rewarded", :credit="credit", :organized_results="organized_results", label="speakers", sub_label="teams", :type="type", @close="$emit('close')")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import loading_container from 'components/loading-container'
import slides_wrapper from 'components/slides/slides-wrapper.vue'

export default {
  name: 'best-slides',
  components: {
    'loading-container': loading_container,
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
      for (let compiled_result of this.compiled_sub_prize_results('best')) {
        let speaker = this.entity_by_id[compiled_result.id]
        let result = Object.assign({}, compiled_result)
        result.name = speaker.name
        result.teams = this.teams_by_speaker_id(speaker.id).map(t => t.name)
        organized_results.push(result)
      }
      return organized_results
    },
    ...mapGetters([
      'target_tournament',
      'compiled_sub_prize_results',
      'entity_by_id',
      'teams_by_speaker_id'
    ])
  },
  mounted () {
    this.started = true
  }
}
</script>
