<template lang="pug">
    .reveal.slides
        section(v-for="slide in slides", :key="slide.number")
            section(v-if="config.show_place")
                h2 {{ slide.place }} Place
            section(v-if="config.show_place")
                h2 {{ slide.place }} Place
                h1 {{ slide.name }}
        .tournament
            p {{ config.tournament_name }}
</template>

<script src="assets/js/reveal.js">
  Reveal.initialize()
</script>
<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { smartphone } from 'assets/js/media-query'

  export default {
    name: 'results-slide',
    props: ['config', 'entities', 'results'],
    computed: {
        slides() {
            let data = []

            let results_sorted = [].concat(this.results).sort((r1, r2) => r1.ranking < r2.ranking)

            let number = 0
            for (let result of results_sorted) {
                let place = ""
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

                data.push({
                    number,
                    property: {},
                    name: this.entities.find(t => t.id === result.id).name,
                    place: place
                })
                number++
            }
            return data
        }
    }
  }
</script>

<style>
.tournament * {
  display: block;
  position: absolute;
  up: 16px;
  left: 10px;
  margin-left: -139px;
  z-index: 20;
}

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
