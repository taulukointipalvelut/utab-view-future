<template lang="pug">
  slides(:divided_results="divided_results", :title="title", :credit="credit")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import math from 'assets/js/math'
import slides from 'components/slides'

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
  data () {
    return {
      current_slide: 0,
      texts_class: '',
      current_texts: []
    }
  },
  computed: {
    divided_results () {
      let texts_list = []
      let sorted_results = this.sorted_results
      let divided_results = []
      let num_div = 3
      let c = 0
      if (true) {
        for (let result of sorted_results) {
          if (c % num_div === 0) {
            divided_results.push([result])
          } else {
            divided_results[divided_results.length - 1].push(result)
          }
          ++c
        }
      }
      return divided_results
    },
    sorted_results () {
        let sorted_results = []
        let results = [].concat(this.organized_results).sort((r1, r2) => r1.ranking < r2.ranking)
        let all_rankings = results.map(r => r.ranking).sort()
        let rankings = Array.from(new Set(all_rankings)).sort()
        let tie_rankings = rankings.filter(r => all_rankings.filter(r2 => r2 === r).length > 1)

        for (let ranking of rankings) {
          if (ranking > this.max_ranking_rewarded) {
              continue
          }
          for (let result of results.filter(r => r.ranking === ranking)) {
            sorted_results.push({
                name: result.name,
                place: this.place(ranking),
                sub_names: result[this.sub_label],
                tie: tie_rankings.includes(ranking)
            })
          }
        }
        return sorted_results
    }
  },
  methods: {
    place (ranking) {
        let place = ""
        if (ranking === 1) {
            place = "1st"
        } else if (ranking === 2) {
            place = "2nd"
        } else if (ranking === 3){
            place = "3rd"
        } else {
            place = ranking+"th"
        }
        place += " Place"
        return place
    }
  }
}
</script>

<style lang="stylus">
</style>
