<template lang="pug">
  div(:id="id+'-side-pie-chart-container'")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import highcharts from 'highcharts'
import math from 'assets/js/math'

export default {
  name: 'side-pie-chart',
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
      let filtered_details = [].concat(...sorted_results.map(r => r.details.filter(d => d.r === this.round.r)))
      let ids = Array.from(new Set(filtered_details.map(r => r.id)))
      let all_ids = this.tournament.teams.map(t => t.id)

      let nums = {
          gov: 0,
          opp: 0,
          absent: all_ids.filter(id => !ids.includes(id)).length
      }

      for (let detail of filtered_details) {
          nums[detail.side] += detail.win === 1 ? 1 : 0
      }
      let sum = nums.gov + nums.opp + nums.absent
      if (nums.gov+nums.opp === 0) { return }

      let series = [{
          name: 'Winners',
          colorByPoint: true,
          data: [{
              name: 'Gov',
              y: nums.gov/sum,
              num: nums.gov,
              dataLabels: {
                  enabled: nums.gov !== 0
              },
              color: 'rgb(237, 168, 123)'
          }, {
              name: 'Opp',
              y: nums.opp/sum,
              num: nums.opp,
              dataLabels: {
                  enabled: nums.opp !== 0
              },
              color: 'rgb(111, 177, 209)'
          }, {
              name: 'Unknown',
              y: nums.absent/sum,
              num: nums.absent,
              dataLabels: {
                  enabled: nums.absent !== 0
              },
              color: 'rgb(147, 147, 147)'
          }]
      }]

      highcharts.chart(this.id+'-side-pie-chart-container', {
          chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
          },
          title: {
              text: 'Winner in '+this.round.name
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.1f} %<br>{point.num} Teams',
                      connectorColor: '#c2c2c2'
                  }
              }
          },
          series,
          tooltip: {
              enabled: false
          }
      })
  }
}
</script>
