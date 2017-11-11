<template lang="pug">
  slideshow(:paragraphs_list="paragraphs_list", :title="title", :credit="credit", @close="$emit('close')")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import math from 'assets/js/math'
import slideshow from 'components/slides/slideshow'

export default {
  name: 'slides-wrapper',
  components: {
    'slideshow': slideshow
  },
  props: [
    'max_ranking_rewarded',
    'credit',
    'label',
    'sub_label',
    'title',
    'organized_results',
    'type'
  ],
  data () {
    return {
      current_slide: 0,
      texts_class: '',
      current_texts: []
    }
  },
  computed: {
    paragraphs_list () {
      let paragraphs_list = []
      if (this.type === 'listed') {
        let num_div = 4
        let c = 0
        let ranking = null

        for (let result of this.sorted_results.slice().reverse()) {
          if (ranking !== result.ranking) {
            c = 0
            let place_paragraph = [{
              tag: 'h1',
              text: result.place + ' Place'
            }]
            if (result.tie) {
              place_paragraph.push({
                tag: 'h3',
                text: 'Tie '+this.sorted_results.filter(r => r.ranking === result.ranking).length+' '+math.capitalize(this.label)
              })
            }
            place_paragraph.num = 0
            paragraphs_list.push([place_paragraph])
            paragraphs_list.push([])
            /*let tiny_place_paragraph = [{
              tag: 'h3',
              text: result.place + ' Place'
            }]
            tiny_place_paragraph.num = 1
            paragraphs_list[paragraphs_list.length-1].push(tiny_place_paragraph)*/
            ranking = result.ranking
          } else if (c % num_div === 0) {
            paragraphs_list.push([])
          }
          let content_paragraph = [{
            tag: 'h2',
            text: result.name,
          }, {
            tag: 'h4',
            text: result.sub_names.join(','),
          }]
          content_paragraph.num = c % num_div
          paragraphs_list[paragraphs_list.length - 1].push(content_paragraph)
          ++c
        }
        paragraphs_list = paragraphs_list.map(paragraphs => paragraphs.reverse())
      } else if (this.type === 'pretty') {
        let ranking = null

        for (let result of this.sorted_results.slice().reverse()) {
          if (ranking !== result.ranking) {
            let place_paragraph = [{
              tag: 'h1',
              text: result.place + ' Place'
            }]
            if (result.tie) {
              place_paragraph.push({
                tag: 'h3',
                text: 'Tie '+this.sorted_results.filter(r => r.ranking === result.ranking).length+' '+math.capitalize(this.label)
              })
            }
            place_paragraph.num = 0
            paragraphs_list.push([place_paragraph])
            ranking = result.ranking
          }
          let content_paragraph = [{
            tag: 'h2',
            text: result.tie ? result.place+' Place (Tie)' : result.place+' Place'
          }, {
            tag: 'h1',
            text: result.name
          }, {
            tag: 'p',
            text: result.sub_names.join(',')
          }]
          content_paragraph.num = 0
          paragraphs_list.push([content_paragraph])
        }
        paragraphs_list = paragraphs_list.map(paragraphs => paragraphs.reverse())
      }
      return paragraphs_list
    },
    sorted_results () {
        let sorted_results = []
        let results = [].concat(this.organized_results).sort((r1, r2) => r1.ranking < r2.ranking ? 1 : -1)
        let all_rankings = results.map(r => r.ranking).sort((a, b) => a > b ? 1 : -1)
        let rankings = Array.from(new Set(all_rankings)).sort((a, b) => a > b ? 1 : -1)
        let tie_rankings = rankings.filter(r => all_rankings.filter(r2 => r2 === r).length > 1)
        for (let ranking of rankings) {
          if (ranking > this.max_ranking_rewarded) {
              continue
          }
          for (let result of results.filter(r => r.ranking === ranking)) {
            sorted_results.push({
                name: result.name,
                ranking: result.ranking,
                place: math.ordinal(ranking),
                sub_names: this.sub_label ? result[this.sub_label] : [],
                tie: tie_rankings.includes(ranking)
            })
          }
        }
        return sorted_results
    }
  }
}
</script>

<style lang="stylus">
</style>
