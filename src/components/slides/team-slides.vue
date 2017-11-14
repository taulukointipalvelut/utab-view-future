<template lang="pug">
  slides-wrapper(title="Team Results", :max_ranking_rewarded="max_ranking_rewarded", :credit="credit", :organized_results="organized_results", label="teams", sub_label="institutions", :type="type", @close="$emit('close')")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import slides_wrapper from 'components/slides/slides-wrapper.vue'

export default {
  name: 'team-slides',
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
      for (let compiled_result of this.tournament.compiled_team_results) {
        let team = this.entity_by_id[compiled_result.id]
        let result = Object.assign({}, compiled_result)
        result.name = team.name
        result.institutions = this.access_detail(team).institutions.map(this.entity_name_by_id)
        organized_results.push(result)
      }
      return organized_results
    },
    ...mapGetters([
      'target_tournament',
      'entity_by_id',
      'entity_name_by_id',
      'access_detail'
    ])
  },
  mounted () {
    this.started = true
  }
}
</script>
