<template>
  <div class="reveal">
    <div class="slides">
      <section>
        <section>
          <h2>
            Place
          </h2>
        </section>
        <section>
          <h2>
            Place2
          </h2>
        </section>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Reveal from 'assets/js/reveal.js'

export default {
  components: {},
  props: [],
  data () {
    return {
      config: {
          max_teams_rewarded: 3,
          tournament_name: "PDA Tournament 2017",
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
  },
  computed: {
    slides() {
        let output = []

        let results_sorted = [].concat(this.results).sort((r1, r2) => r1.ranking < r2.ranking)

        number = 0
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
                name: this.entities.find(t => t.id === result.id).name,
                place: place
            })
            number++
        }

        return output
    },
    ...mapState([]),
    ...mapGetters([
      'target_tournament'
    ]),
  },
  methods: {
    ...mapActions([])
  },
  mounted () {
    Reveal.initialize()
    this.loading = false
  }
}
</script>

<style src='assets/css/reveal.css'</style>
<style lang="stylus">
</style>
