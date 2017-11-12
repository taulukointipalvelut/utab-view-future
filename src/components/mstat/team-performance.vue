<template lang="pug">
  #team-performance-container
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import highcharts from 'highcharts'
//import 'highcharts/js/themes/grid-light.js'

export default {
  name: 'team-performance',
  props: {
    results: Array,
    tournament: Object,
  },
  computed: {
    ...mapGetters([
      'entity_name_by_id'
    ])
  },
  mounted () {
      let sorted_results = this.results.slice().sort((r1, r2) => r1.ranking > r2.ranking ? 1 : -1).reverse()
      let categories = sorted_results.map(result => result.id)
      let rounds = this.tournament.rounds.slice().sort((r1, r2) => r1.r > r2.r ? 1 : -1)
      let series = [{ name: 'gov', data: Array(categories.length).fill(0) }, { name: 'opp', data: Array(categories.length).fill(0) }]


      for (let result of sorted_results) {
          let ind = categories.findIndex(id => id === result.id)
          let num = { gov: 0, opp: 0 }
          for (let detail of result.details) {
              let side_series = series.find(s => s.name === detail.side)
              side_series.data[ind] += detail.sum
              num[detail.side] += 1
          }
          for (let side in num) {
              let side_series = series.find(s => s.name === side)
              side_series.data[ind] = num[side] === 0 ? side_series.data[ind] : side_series.data[ind] / num[side]
          }
      }
      series.map(side_series => { side_series.data = side_series.data.map(v => side_series.name === 'gov' ? -v : v) })

      highcharts.chart('team-performance-container', {
          title: {
              text: 'Team performance in gov/opp'
          },
          chart: {
              type: 'bar'
          },
          xAxis: [{
            categories: categories.map(this.entity_name_by_id),
            reversed: false,
            labels: { step: 1 },
          }, {
            opposite: true,
            reversed: false,
            categories: categories.map(this.entity_name_by_id),
            linkedTo: 0,
            labels: { step: 1 }
          }],
          yAxis: {
              title: {
                  text: null
              },
              labels: {
                  formatter () {
                      return Math.abs(this.value)
                  }
              }
          },
          plotOptions: {
              series: {
                  stacking: 'normal',
                  tooltip: {
                      headerFormat: '<b>{point.x}</b><br>',
                      pointFormatter () {
                          return Math.abs(this.y)+' pts'
                      }
                  }
              }
          },
          series,
          responsive: {
              rules: [{
                  condition: {
                      maxWidth: 500
                  },
                  chartOptions: {
                      legend: {
                          layout: 'horizontal',
                          align: 'center',
                          verticalAlign: 'bottom'
                      }
                  }
              }]
          }
      })

  }
}
</script>

<style lang="stylus">
</style>
