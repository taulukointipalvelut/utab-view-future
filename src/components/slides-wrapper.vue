<template lang="pug">
  slides(:title="title", :texts_list="texts_list", :credit="credit")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import slides from 'components/slides.vue'
import math from 'assets/js/math'

export default {
  name: 'slides-wrapper',
  components: {
    'slides': slides
  },
  props: [
    'max_ranking_rewarded',
    'credit',
    'label',
    'label_singular',
    'sub_label',
    'sub_label_singular',
    'title',
    'organized_results'
  ],
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
          { tag: 'p', text: slide_group.sub_names.join(', ') }
        ])
        texts_list.push([])
      }
      return texts_list
    },
    slide_groups () {
        let output = []
        let results_sorted = [].concat(this.organized_results).sort((r1, r2) => r1.ranking < r2.ranking)
        let number = 0
        let rankings = results_sorted.map(r => r.ranking)
        let tie_rankings = rankings.filter(r => rankings.filter(r2 => r2 === r).length > 1)

        for (let result of results_sorted) {
            if (result.ranking > this.max_ranking_rewarded) {
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

            output.push({
                number,
                name: result.name,
                place: place,
                sub_names: result[this.sub_label]
            })
            number++
        }
        return output
    },
    ...mapGetters([
      'team_by_id',
      'speaker_by_id',
      'institution_by_id',
      'details_1'
    ])
  },
  methods: {
      capitalize: math.capitalize,
  },
}
</script>

<style lang="stylus">

</style>
