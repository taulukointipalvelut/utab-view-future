<template lang="pug">
  div
    div(:class="{ cover: started }")
    div.projection
      slides(title="Team Result", :texts_list="texts_list")
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
          max_teams_rewarded: 3,
          name: "PDA Tournament 2018",
          show_place: true
      }
    }
  },
  /*data () {
    return {
      config: {
          max_teams_rewarded: 3,
          name: "PDA Tournament 2018",
          show_place: true
      },
      teams: [{
            id: 1,
            name: "t1"
        }, {
            id: 2,
            name: "t2"
        }, {
            id: 3,
            name: "t3"
        }, {
            id: 4,
            name: "t4"
      }],
      results: [{
            id: 2,
            win: 0,
            sum: 228,
            margin: 5,
            average_margin: 5,
            average: 228,
            sd: 0,
            opponent_average: 223,
            ranking: 3
        },
        {
            id: 3,
            win: 1,
            sum: 218,
            margin: 31,
            average_margin: 31,
            average: 218,
            sd: 0,
            opponent_average: 187,
            ranking: 2
        },
        {
            id: 1,
            win: 1,
            sum: 223,
            margin: -5,
            average_margin: -5,
            average: 223,
            sd: 0,
            opponent_average: 228,
            ranking: 1
        },
        {
            id: 4,
            win: 0,
            sum: 187,
            margin: -31,
            average_margin: -31,
            average: 187,
            sd: 0,
            opponent_average: 218,
            ranking: 4
      }]
    }
  },*/
  computed: {
    texts_list () {
      let texts_list = []
      let slide_groups = this.slide_groups
      for (let slide_group of slide_groups) {
        texts_list.push([
          { tag: 'h2', text: slide_group.place+' Place'  }
        ])
        texts_list.push([])
        texts_list.push([
          { tag: 'h2', text: slide_group.place+' Place' },
          { tag: 'h1', text: slide_group.name },
          { tag: 'p', text: slide_group.institutions.join(', ') }
        ])
      }
      return texts_list
    },
    slide_groups () {
        let output = []

        let results_sorted = [].concat(this.target_tournament.compiled_team_results).sort((r1, r2) => r1.ranking < r2.ranking)

        let number = 0
        let place = ""
        for (let result of results_sorted) {
            if (result.ranking > this.config.max_teams_rewarded) {
                continue
            }
            if (result.ranking === 1) {
                place = "1st"
            } else if (result.ranking === 2) {
                place = "2nd"
            } else if (result.ranking === 3){
                place = "3rd"
            } else {
                place = result.ranking+"th"
            }

            output.push({
                number,
                property: {},
                name: this.team_by_id(result.id).name,//this.team_by_id(result.id).name,
                place: place,
                institutions: this.team_by_id(result.id).details[0].institutions.map(this.institution_by_id).map(i=>i.name)//this.team_by_id(result.id).institutions
            })
            number++
        }
        return output
    },
    ...mapGetters([
      'target_tournament',
      'team_by_id',
      'institution_by_id'
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
    z-index 1
    display table
    transition all 7s
  .projection
    position relative
    width 100%
    background-color white
    margin-top 3rem
    z-index 2
</style>
