<template lang="pug">
  div(:id="id+'-series-container'")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import highcharts from 'highcharts'

export default {
  name: 'mstat-series',
  props: {
    id: String,
    results: Array,
    tournament: Object,
    score: {
      type: String,
      default: 'average'
    },
    marker: {
      type: Object,
      default () {
        return {
          key: '',
          value: undefined
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'entity_name_by_id'
    ])
  },
  mounted () {
      let series = []
      let rounds = this.tournament.rounds.slice().sort((r1, r2) => r1.r > r2.r ? 1 : -1)
      for (let result of this.results) {
        series.push({
          name: this.entity_name_by_id(result.id),
          data: rounds.map(round => {
            let detail = result.details.find(d => d.r === round.r)
            let e = { x: round.r, y: null }
            if (detail !== undefined) {
              e.y = detail[this.score]
              e.marker = {
                //symbol: 'circle',
                fillColor: detail[this.marker.key] === this.marker.value ? '#FFFFFF' : '#111111',
                lineColor: detail[this.marker.key] === this.marker.value ? '#111111' : '#4198c8',
                lineWidth: detail[this.marker.key] === this.marker.value ? 0.25 : 0
              }
            }
            return e
          }),
          zoneAxis: 'x',
          zones: [{
            value: rounds.length
          }, {
            dashStyle: 'dot'
          }]
        })
      }
      let categories = {}
      rounds.map(round => { categories[round.r] = round.name })

      highcharts.chart(this.id+'-series-container', {
          title: {
              text: 'Changes in Scores'
          },
          //subtitle: {
          //    text: rounds.map(round => round.name).join(',')
          //},
          xAxis: {
              categories
          },
          yAxis: {
              title: {
                  text: 'Score'
              }
          },
          legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle',
              itemStyle: {
                fontWeight: 0
              }
          },
          plotOptions: {
              series: {
                  label: {
                      connectorAllowed: false
                  },
                  marker: {
                      symbol: 'circle'
                  },
                  color: '#4198c8',
                  lineWidth: 1
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
