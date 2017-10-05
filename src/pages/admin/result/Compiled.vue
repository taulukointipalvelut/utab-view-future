<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section.page-header
      h1 {{ target_tournament.name }}
    loading-container(:loading="loading")
    p(v-if="target_tournament.compiled_team_results.length == 0 && target_tournament.compiled_speaker_results.length == 0") No teams are registered or Please recompile results.
    el-tabs(type="card", v-if="target_tournament.compiled_team_results.length > 0 || target_tournament.compiled_speaker_results.length > 0")
      el-tab-pane(label="Team results")
        section(v-if="!loading")
          el-table(:data="target_tournament.compiled_team_results.slice().sort((r1, r2) => r1.ranking > r2.ranking ? 1 : -1)")
            el-table-column(prop="ranking", label="Ranking", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.ranking }}
            el-table-column(prop="id", label="Name", align="center", sortable)
              template(scope="scope")
                span {{ team_by_id(scope.row.id).name }}
            el-table-column(prop="win", label="Win", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.win }}
            el-table-column(prop="sum", label="Sum", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.sum }}
            el-table-column(prop="margin", label="Margin", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.margin }}
            el-table-column(prop="vote", label="Vote", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.vote }}
            el-table-column(prop="sd", label="StDev", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.sd }}
          .operations
            el-button(@click="on_download_team_results") Download Team Results
            el-button(type="primary", @click="on_select_team_slide") #[el-icon(name="picture")] &nbsp;Slide Show

      el-tab-pane(label="Speaker results")
        el-table(:data="target_tournament.compiled_speaker_results.slice().sort((r1, r2) => r1.ranking > r2.ranking ? 1 : -1)")
          el-table-column(prop="ranking", label="Ranking", align="center", sortable)
            template(scope="scope")
              span {{ scope.row.ranking }}
          el-table-column(prop="id", label="Name", align="center", sortable)
            template(scope="scope")
              span {{ speaker_by_id(scope.row.id).name }}
          el-table-column(prop="average", label="Average", align="center", sortable)
            template(scope="scope")
              span {{ scope.row.average }}
          el-table-column(prop="sum", label="Sum", align="center", sortable)
            template(scope="scope")
              span {{ scope.row.sum }}
          el-table-column(prop="sd", label="StDev", align="center", sortable)
            template(scope="scope")
              span {{ scope.row.sd }}
        .operations
          el-button(@click="on_download_speaker_results") Download Speaker Results
          el-button(type="primary", @click="on_select_speaker_slide") #[el-icon(name="picture")] &nbsp;Slide Show
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'
import loading_container from 'components/loading-container'

export default {
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item,
    'loading-container': loading_container
  },
  props: ['r_str'],
  computed: {
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament',
      'team_by_id',
      'speaker_by_id',
      'adjudicator_by_id'
    ])
  },
  methods: {
    on_select_team_slide () {
      this.$router.push({
        path: 'slide/team'
      })
    },
    on_select_speaker_slide () {
      this.$router.push({
        path: 'slide/speaker'
      })
    },
    on_download_team_results () {
      let results = this.target_tournament.compiled_team_results
      let blob = new Blob([this.team_results_to_csv_text(results)], {type: 'text/plain'})
      let link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'team_results.csv'
      link.click()
    },
    on_download_speaker_results () {
      let results = this.target_tournament.compiled_speaker_results
      let blob = new Blob([this.speaker_results_to_csv_text(results)], {type: 'text/plain'})
      let link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'speaker_results.csv'
      link.click()
    },
    team_results_to_csv_text (results) {
      let csv = ['name', 'ranking', 'win', 'sum', 'margin', 'vote', 'stDev'].join(',') + '\n'
      for (let result of results.slice().sort((r1, r2) => r1.ranking > r2.ranking)) {
        csv += [this.team_by_id(result.id).name, result.ranking, result.win, result.sum, result.margin, result.vote, result.sd].join(',') + '\n'
      }
      return csv
    },
    speaker_results_to_csv_text (results) {
      let csv = ['name', 'ranking', 'average', 'sum', 'stDev'].join(',') + '\n'
      for (let result of results.slice().sort((r1, r2) => r1.ranking > r2.ranking)) {
        csv += [this.speaker_by_id(result.id).name, result.ranking, result.average, result.sum, result.sd].join(',') + '\n'
      }
      return csv
    }
  }
}
</script>

<style lang="stylus">
  body
    background-color #f5f5f5
  #app-content
    margin 0
    padding 0
    width 100%
    min-height 100vh
  a
    text-decoration none
    color inherit
  main
    padding 5%

  .operations
    display flex
    justify-content flex-end
    margin-top 1rem

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>
