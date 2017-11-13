<template lang="pug">
  div(id="side-scatter-container")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import highcharts from 'highcharts'
import math from 'assets/js/math'

export default {
  name: 'side-scatter',
  props: {
    results: Array,
    tournament: Object
  },
  computed: {
    ...mapGetters([
      'entity_name_by_id'
    ])
  },
  mounted () {
      let series = []
      let rounds = this.tournament.rounds.slice().sort((r1, r2) => r1.r > r2.r ? 1 : -1)
      let all_details = [].concat(...this.results.map(r => r.details))
      for (let side of ['gov', 'opp']) {
          series.push({
              name: math.capitalize(side),
              color: side === 'gov' ? 'rgba(223, 83, 83, .5)' : 'rgba(119, 152, 191, .5)',
              data: all_details.filter(d => d.side === side).map(detail => {
                  return [
                      detail.r+(detail.side === 'gov' ? 0.05 : -0.05),
                      detail.sum
                  ]
              })
          })
      }
      let categories = {}
      rounds.map(round => { categories[round.r] = round.name })
      let rs = rounds.map(round => round.r)

      highcharts.chart('side-scatter-container', {
          title: {
              text: 'Scores by side'
          },
          chart: {
              type: 'scatter',
              zoomType: 'xy'
          },
          //subtitle: {
          //    text: rounds.map(round => round.name).join(',')
          //},
          xAxis: {
              min: Math.min(...rs),
              max: Math.max(...rs),
              title: {
                  enabled: false
              },
              startOnTick: true,
              endOnTick: true,
              showLastLabel: true,
              categories
          },
          yAxis: {
              title: {
                  text: 'Score'
              }
          },
          legend: {
              layout: 'vertical',
              align: 'left',
              verticalAlign: 'top',
              x: 100,
              y: 70,
              floating: true,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderWidth: 1
          },
          plotOptions: {
              scatter: {
                  marker: {
                      radius: 5,
                      states: {
                          hover: {
                              enabled: true,
                              lineColor: 'rgb(100,100,100)'
                          }
                      }
                  },
                  states: {
                      hover: {
                          marker: {
                              enabled: false
                          }
                      }
                  },
                  tooltip: {
                      headerFormat: '<b>{series.name}</b><br>',
                      pointFormatter () {
                          return highcharts.numberFormat(this.y, 2)+' pts'
                      }
                  }
              }
          },
          series
      })

  }
}
</script>

<style lang="stylus">
</style>
