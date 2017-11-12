<template lang="pug">
  div(:id="id+'-score-histogram-container'")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import highcharts from 'highcharts'
import math from 'assets/js/math'

export default {
  name: 'score-histogram',
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
              nums: [],
              bins: { start: null, end: null, n: null, h: null }
            }
          }
          let data = raw_data.slice().sort((v1, v2) => v1 > v2 ? 1 : -1)
          let n = 1 + Math.ceil(Math.log(data.length)/Math.log(2))
          start = start === null ? Math.floor(data[0]*10)/10 : start
          end = end === null ? Math.ceil(data[data.length-1]*10)/10 : end
          let h = (end - start)/n
          let nums = Array(n).fill(0)

          let bins = math.range(n-1).map(v => start+v*h)
          bins.push(end)
          let i = 0
          for (let e of data) {
            while (e > bins[i]) {
              i++
            }
            nums[i]++
          }
          return {
            freqs: nums.map(v => v/data.length),
            nums: nums,
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

      if (scores.length === 0) { return }
      let hist = this.hist(scores, start, end)

      highcharts.chart(this.id+'-score-histogram-container', {
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
                  pointPlacement: 'between',
                  tooltip: {
                      headerFormat: '',
                      pointFormatter () {
                          let ind = hist.freqs.findIndex(v => v === this.y)
                          return 'Range: '+this.x+'-'+(this.x+hist.bins.h)+'<br>Nums: '+hist.nums[ind]+'<br>Frequency: '+this.y
                      }
                  }
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
