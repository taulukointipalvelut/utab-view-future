<template lang="pug">
  div(:id="id+'-histogram-container'")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import highcharts from 'highcharts'
import math from 'assets/js/math'

export default {
  name: 'mstat-histogram',
  props: {
    results: Array,
    tournament: Object,
    score: String,
    round: Object,
    id: String
  },
  computed: {
    ...mapGetters([
      'entity_name_by_id'
    ])
  },
  methods: {
      hist (raw_data, start=null, end=null) {
          if (raw_data.length === 0) {
            return {
              freqs: [],
              bins: { start: null, end: null, n: null, h: null }
            }
          }
          let data = raw_data.slice().sort((v1, v2) => v1 > v2 ? 1 : -1)
          let n = 1 + Math.ceil(Math.log(data.length)/Math.log(2))
          start = start === null ? Math.floor(data[0]*10)/10 : start
          end = end === null ? Math.ceil(data[data.length-1]*10)/10 : end
          let h = (end - start)/n
          let freqs = Array(n).fill(0)

          let bins = math.range(n-1).map(v => start+v*h)
          bins.push(end)
          let i = 0
          for (let e of data) {
            while (e > bins[i]) {
              i++
            }
            freqs[i]++
          }
          return {
            freqs,
            bins: { start, end, n, h }
          }
      }
  },
  mounted () {
      let scores = []
      let start = 1000000
      let end = -1000000
      for (let result of this.results) {
          for (let detail of result.details) {
              let score = detail[this.score]
              if (score > end) {
                  end = score
              } else if (score < start) {
                  start = score
              }
              if (detail.r === this.round.r) {
                  scores.push(score)
              }
          }
      }

      let hist = this.hist(scores, start, end)

      highcharts.chart(this.id+'-histogram-container', {
          title: {
              text: 'Score histogram in '+this.round.name
          },
          xAxis: [{
              title: { text: 'Score' }
          }],
          yAxis: {
              title: { text: 'Frequency' },
              allowDecimals: false,
              gridLineDashStyle: 'dot'
          },
          plotOptions: {
              column: {
                  shadow: false,
                  borderWidth: 1,
                  pointPadding: 0,
                  groupPadding: 0,
                  pointStart: hist.bins.start,
                  pointInterval: hist.bins.h,
                  pointPlacement: 'between'
              }
          },
          series: [{
              name: 'Histogram',
              type: 'column',
              data: hist.freqs
          }]
      })
  }
}
</script>
