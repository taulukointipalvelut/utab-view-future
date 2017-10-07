<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section.page-header
      h1 {{ target_tournament.name }}
    div(:class="{ cover: started }")
    .projection
      slides(title="Speaker Result", :texts_list="texts_list", :credit="config.credit")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'
import loading_container from 'components/loading-container'
import slides from 'components/slides.vue'

export default {
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item,
    'loading-container': loading_container,
    'slides': slides
  },
  data () {
    return {
      started: false,
      config: {
          max_ranking_rewarded: 3,
          credit: ''
      }
    }
  },
  computed: {
    texts_list () {
      let texts_list = []
      let slide_groups = this.slide_groups
      for (let slide_group of slide_groups) {
        texts_list.push([
          { tag: 'h2', text: slide_group.place }
        ])
        texts_list.push([])
        texts_list.push([
          { tag: 'h2', text: slide_group.place },
          { tag: 'h1', text: slide_group.name },
          { tag: 'p', text: slide_group.team }
        ])
        texts_list.push([])
      }
      return texts_list
    },
    slide_groups () {
        let output = []

        let results_sorted = [].concat(this.target_tournament.compiled_speaker_results).sort((r1, r2) => r1.ranking < r2.ranking)

        let number = 0
        let rankings = results_sorted.map(r => r.ranking)
        let tie_rankings = rankings.filter(r => rankings.filter(r2 => r2 === r).length > 1)
        for (let result of results_sorted) {
            if (result.ranking > this.config.max_ranking_rewarded) {
                continue
            }
            let place = ""
            if (result.ranking === 1) {
                place = "1st"
            } else if (result.ranking === 2) {
                place = "2nd"
            } else if (result.ranking === 3){
                place = "3rd"
            } else {
                place = result.ranking+"th"
            }
            if (tie_rankings.includes(result.ranking)) {
                place += " Place (Tie)"
            } else {
                place += " Place"
            }

            let team = this.target_tournament.teams.find(t => t.details[0].speakers.includes(result.id))
            output.push({
                number,
                property: {},
                name: this.speaker_by_id(result.id).name,
                place: place,
                team: team ? team.name : ''
            })
            number++
        }
        return output
    },
    ...mapGetters([
      'target_tournament',
      'speaker_by_id',
      'team_by_id',
      'institution_by_id'
    ])
  },
  mounted () {
    this.started = true
    this.config.max_ranking_rewarded = this.$route.query.max_ranking_rewarded
    this.config.credit = this.$route.query.credit
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
