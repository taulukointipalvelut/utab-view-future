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
  name: 'mstat-side-heatmap',
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
          name: 'Win per Side',
          borderWidth: 1,
          data: [],
          dataLabels: {
              enabled: false,
              color: '#000000'
          }
      }]

      for (let i = 0; i < categories.length; i++) {
          for (let j = 0; j < categories.length; j++) {
              series[0].data.push([i, j, null])
          }
      }

      let filtered_details = [].concat(...sorted_results.map(r => r.details.filter(d => d.r === this.round.r)))
      for (let result of sorted_results) {
          for (let detail of result.details) {
              if (detail.r === this.round.r) {
                  let this_index = categories.findIndex(id => id === detail.id)
                  let that_index = categories.findIndex(id => id === detail.opponents[0])
                  let i = detail.side === 'gov' ? this_index : that_index
                  let j = detail.side === 'gov' ? that_index : this_index
                  let e1 = series[0].data.find(arr => arr[0] === i && arr[1] === j)
                  let e2 = series[0].data.find(arr => arr[1] === i && arr[0] === j)
                  e1[2] = detail.win === 1 ? 1 : -1
                  e2[2] = detail.win === 1 ? -1 : 1
              }
          }
      }
      highcharts.chart(this.id+'-side-heatmap-container', {
          chart: {
              type: 'heatmap',
              marginTop: 40,
              marginBottom: 80,
              plotBorderWidth: 1
          },
          title: {
              text: 'Side-Win Map in '+this.round.name
          },
          xAxis: {
              categories: categories.map(this.entity_name_by_id)
          },
          yAxis: {
              categories: categories.map(this.entity_name_by_id),
              title: null
          },
          colorAxis: {
              reversed: false,
              min: -1,
              minColor: 'rgb(111, 177, 209)',
              maxColor: 'rgb(237, 168, 123)',
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
