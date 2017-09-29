<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section.page-header
      h1 {{ target_tournament.tournament_name }}
    loading-container(:loading="loading")
    legend Team results
    section(v-if="!loading")
      el-table(:data="compiled_team_results_by_r(r_str).slice().sort((r1, r2) => r1.ranking > r2.ranking)")
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
    legend Speaker results
      el-table(:data="compiled_speaker_results_by_r(r_str).slice().sort((r1, r2) => r1.ranking > r2.ranking)")
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
  props: ['loading', 'r_str'],
  computed: {
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament',
      'team_by_id',
      'speaker_by_id',
      'adjudicator_by_id'
    ]),
    ...mapGetters('result', [
      'compiled_speaker_results_by_r',
      'compiled_team_results_by_r'
    ]),
    ...mapState('result', [
      'compiled_team_results'
    ])
  },
  methods: {
    ...mapActions([
      'init_teams',
      'init_adjudicators'
    ])/*,
    sort_adjudicators (res1, res2) {
      console.log(res1)
      return this.adjudicator_by_id(res1.id).name.localeCompare(this.adjudicator_by_id(res2.id).name)
    },
    sort_teams (res1, res2) {
      console.log(res1)
      return this.team_by_id(res1.id).name.localeCompare(this.team_by_id(res2.id).name)
    }*/
  },
  mounted () {
    Promise.all([this.init_adjudicators(), this.init_teams()])
      .then(() => {
        this.loading = false
      })
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

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>
