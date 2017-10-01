<template>
  <div>
    <p>
      below are slides
    </p>
    <div class="reveal">
      <div class="slides">
        <section>
          <section>
            <p>
              Hello
            </p>
          </section>
          <section>
            <h2> Hi </h2>
          </section>
        </section>
        <section>
          <p>
            Hello
          </p>
        </section>
      </div>
    </div>
  </div>
</template><!--          section(v-for="slide in slides", :key="slide.number")
            section(v-if="config.show_place")
              h2 {{ slide.place }} Place
            section
              span
            section
              h2(v-if="config.show_place") {{ slide.place }} Place
              h1 {{ slide.name }}
          div(style="display: block; position: absolute; upper: 16px; left: 10px; margin-left: -139px; z-index: 20;")
            p {{ config.name }}
</template>-->

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'
import loading_container from 'components/loading-container'
import Reveal from 'assets/js/reveal.js'

export default {
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item,
    'loading-container': loading_container
  },
  props: ['loading', 'r_str'],
  data () {
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
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament'
    ])
  },
  mounted() {
    Reveal.initialize()
  }
}
</script>

<style src="assets/css/reveal.css"></style>
<style>

.reveal * {
  color: #555;
}

.reveal h1 {
  font-size: 8rem;
}

.reveal h2 {
  font-size: 4rem;
}

.reveal p {
  font-size: 3rem;
  margin: 2rem 0;
}

</style>
<!--
<style lang="stylus">
  body
    background-color #f5f5f5
  #app-content
    margin 0
    padding 0
    width 100%
    min-height 100vh
  a
    text-decoration none
    color inherit
  main
    padding 5%

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>-->
