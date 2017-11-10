<template lang="pug">
  div(:id="id+'-score-range-container'")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import highcharts from 'highcharts'
import more from 'highcharts-more'
more(highcharts)

export default {
  name: 'mstat-score-range',
  props: {
    id: String,
    results: Array,
    tournament: Object,
    score: String
  },
  computed: {
    ...mapGetters([
      'entity_name_by_id'
    ])
  },
  mounted () {
      let scores_list = []
      let rounds = this.tournament.rounds.slice().sort((r1, r2) => r1.r > r2.r ? 1 : -1)
      let sorted_results = this.results.sort((r1, r2) => r1.ranking > r2.ranking ? 1 : -1)
      for (let result of sorted_results) {
          scores_list.push(result.details.map(d => d[this.score]))
      }
      let series = [{
          name: 'Scores',
          data: scores_list.map(scores => {
              if (scores.length === 0) {
                  return [0, 0]
              } else {
                  return [Math.min(...scores), Math.max(...scores)]
              }
          })
      }]
      let categories = sorted_results.map(r => r.id).map(this.entity_name_by_id)

      highcharts.chart(this.id+'-score-range-container', {
          chart: {
              type: 'columnrange',
              inverted: true
          },
          title: {
              text: 'Score Range'
          },
          xAxis: {
              categories
          },
          yAxis: {
              title: {
                  text: 'Score'
              }
          },
          plotOptions: {
              columnrange: {
                  dataLabels: {
                      enabled: false,
                      formatter () {
                          return highcharts.numberFormat(this.y, 1)
                      },
                      style: {
                          fontWeight: 0,
                          fontSize: 5
                      }
                  },
                  marker: {
                      enabled: false,
                      lineWidth: 0
                  }
              }
          },
          legend: {
              enabled: false
          },
          series
      })
  }
}
</script>

<style lang="stylus">
</style>
