<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section.page-header
      h1 {{ target_tournament.name }}
    div(:class="{ cover: started }")
    .projection
      slides-wrapper(title="Best Speaker Result", :max_ranking_rewarded="max_ranking_rewarded", :credit="credit", :organized_results="organized_results", label="speakers", label_singular="speaker", sub_label="teams", sub_label_singular="team")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import loading_container from 'components/loading-container'
import slides_wrapper from 'components/slides-wrapper.vue'

export default {
  components: {
    'loading-container': loading_container,
    'slides-wrapper': slides_wrapper
  },
  data () {
    return {
      started: false
    }
  },
  computed: {
    max_ranking_rewarded () {
      return this.$route.query.max_ranking_rewarded
    },
    credit () {
      return this.$route.query.credit
    },
    organized_results () {
      let organized_results = []
      for (let compiled_result of this.compiled_sub_prize_results('best')) {
        let speaker = this.speaker_by_id(compiled_result.id)
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
      'team_by_id',
      'speaker_by_id',
      'teams_by_speaker_id'
    ])
  },
  mounted () {
    this.started = true
  }
}
</script>

<style lang="stylus">
  .cover:not(.projection)
    position absolute
    top 0px
    left 0px
    width 100%
    height 100%
    background black
    opacity 0.7
    display table
    transition all 7s
  .projection
    position relative
    width 100%
    background-color white

</style>
