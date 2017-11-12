<template lang="pug">
  div(:id="id+'-side-heatmap-container'")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import highcharts from 'highcharts'
import math from 'assets/js/math'
import heatmap from 'highcharts/modules/heatmap.js'
heatmap(highcharts)

export default {
  name: 'side-heatmap',
  props: {
    results: Array,
    tournament: Object,
    round: Object,
    id: String
  },
  computed: {
    ...mapGetters([
      'entity_name_by_id'
    ])
  },
  mounted () {
      let sorted_results = this.results.slice().sort((r1, r2) => r1.ranking > r2.ranking ? 1 : -1)
      let categories = sorted_results.map(r => r.id)
      let that = this

      let series = [{
          name: 'Gov Win',
          borderWidth: 1,
          data: [],
          dataLabels: {
              enabled: false,
              color: '#000000'
          },
          borderWidth: 0,
          nullColor: '#EFEFEF',
      }]

      for (let i = 0; i < categories.length; i++) {
          for (let j = 0; j < categories.length; j++) {
              if (i >= j) {
                  series[0].data.push([i, j, null])
              } else {
                  series[0].data.push([i, j, 0])
              }
          }
      }

      let result_exists = false
      for (let result of sorted_results) {
          for (let detail of result.details) {
              if (detail.r === this.round.r) {
                  result_exists = true
                  let this_index = categories.findIndex(id => id === detail.id)
                  let that_index = categories.findIndex(id => id === detail.opponents[0])
                  let i = detail.side === 'gov' ? this_index : that_index
                  let j = detail.side === 'gov' ? that_index : this_index
                  if (i < j) {
                    let e = series[0].data.find(arr => arr[0] === i && arr[1] === j)
                    e[2] = detail.win === 1 ? -1 : 1
                  } else {
                    let e = series[0].data.find(arr => arr[1] === i && arr[0] === j)
                    e[2] = detail.win === 1 ? 1 : -1
                  }
              }
          }
      }
      if (!result_exists) { return }

      highcharts.chart(this.id+'-side-heatmap-container', {
          chart: {
              type: 'heatmap',
              marginTop: 40,
              marginBottom: 80,
              plotBorderWidth: 1
          },
          title: {
              text: 'Gov win for team pairs in '+this.round.name
          },
          xAxis: {
              title: null,
              categories: categories.map(this.entity_name_by_id)
          },
          yAxis: {
              title: null,
              categories: categories.map(this.entity_name_by_id)
          },
          plotOptions: {
              heatmap: {
                  tooltip: {
                      headerFormat: '',
                      pointFormatter () {
                          if (this.value === 1) {
                              return 'Win'
                          } else if (this.value === -1) {
                              return 'Lose'
                          } else {
                              return 'Undefined'
                          }
                      }
                  }
              }
          },
          colorAxis: {
              reversed: false,
              min: -1,
              max: 1,
              stops: [
                  [0, 'rgb(111, 177, 209)'],
                  [0.5, '#fcfcfc'],
                  [1, 'rgb(237, 168, 123)']
              ],
              labels: {
                  enabled: true,
                  formatter () {
                      if (this.value === 1) {
                          return 'Win'
                      } else if (this.value === -1) {
                          return 'Lose'
                      } else {
                          return ''
                      }
                  }
              }
          },
          legend: {
              align: 'right',
              layout: 'vertical',
              margin: 0,
              verticalAlign: 'top',
              y: 25,
              symbolHeight: 280
          },
          series
      })
  }
}
</script>
