<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section.page-header
      h1 {{ target_tournament.name }}
    slides-wrapper.slides(title="Team Results", :max_ranking_rewarded="max_ranking_rewarded", :credit="credit", :organized_results="organized_results", label="teams", sub_label="institutions", :type="type")
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
    type () {
      return this.$route.query.type
    },
    organized_results () {
      let organized_results = []
      for (let compiled_result of this.target_tournament.compiled_team_results) {
        let team = this.entity_by_id(compiled_result.id)
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

<style lang="stylus">
  .slides
    border solid 1px lightgray
</style>
