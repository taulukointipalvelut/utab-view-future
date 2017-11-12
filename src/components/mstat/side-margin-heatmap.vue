<template lang="pug">
  div(:id="id+'-side-margin-heatmap-container'")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import highcharts from 'highcharts'
import math from 'assets/js/math'
import heatmap from 'highcharts/modules/heatmap.js'
heatmap(highcharts)

export default {
  name: 'side-margin-heatmap',
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

      let series = [{
          name: 'Gov Margin',
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
                  let this_id = categories.findIndex(id => id === detail.id)
                  let that_id = categories.findIndex(id => id === detail.opponents[0])
                  let i = detail.side === 'gov' ? this_id : that_id
                  let j = detail.side === 'gov' ? that_id : this_id
                  if (i < j) {
                    let e = series[0].data.find(arr => arr[0] === i && arr[1] === j)
                    e[2] = -detail.margin
                  } else {
                    let e = series[0].data.find(arr => arr[0] === j && arr[1] === i)
                    e[2] = detail.margin
                  }
              }
          }
      }
      if (!result_exists) { return }
      let max = Math.max(...series[0].data.map(e => Math.abs(e[2])))
      highcharts.chart(this.id+'-side-margin-heatmap-container', {
          chart: {
              type: 'heatmap',
              marginTop: 40,
              marginBottom: 80,
              plotBorderWidth: 1
          },
          title: {
              text: 'Gov margin for team pairs in '+this.round.name
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
                      pointFormat: '{point.value}'
                  }
              }
          },
          colorAxis: {
              reversed: false,
              min: -max,
              max: max,
              stops: [
                  [0, 'rgb(89, 136, 185)'],
                  [0.5, '#fcfcfc'],
                  [1, 'rgb(158, 190, 99)']
              ],
              labels: {
                  enabled: true
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
