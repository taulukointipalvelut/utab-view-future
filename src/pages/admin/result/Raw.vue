<template lang="pug">
  .router-view-content(v-if="target_tournament")
    section.page-header
      h1 {{ target_tournament.tournament_name }}
    loading-container(:loading="loading")
    p(v-if="adjudicators_unsubmitted") These adjudicators have not sent the ballots: #[font(size="4", color="red") {{ adjudicators_unsubmitted.map(id => adjudicator_by_id(id)).map(a => a.name).join(", ") }}]
    el-tabs(type="card")
      el-tab-pane(label="Collected raw Team results")
        section(v-if="!loading")
          el-table(:data="raw_team_results_by_r(r_str)")
            el-table-column(prop="id", label="Name", align="center", sortable)
              template(scope="scope")
                span {{ team_by_id(scope.row.id).name }}
            el-table-column(prop="win", label="Win", align="center", sortable)
              template(scope="scope")
                span {{ scope.row.win }}
            el-table-column(prop="from_id", label="From Adjudicator", align="center", sortable)
              template(scope="scope")
                span {{ adjudicator_by_id(scope.row.from_id).name }}
            el-table-column(align="right")
              template(scope="scope")
                el-button.edit(size="small", disabled) #[el-icon(name="edit")]
                el-button.delete(size="small", type="danger", disabled) #[el-icon(name="close")]
      el-tab-pane(label="Collected raw Speaker results")
        section(v-if="!loading")
          el-table(:data="raw_speaker_results_by_r(r_str)")
            el-table-column(prop="id", label="Name", align="center", sortable)
              template(scope="scope")
                span {{ speaker_by_id(scope.row.id).name }}
            el-table-column(label="scores", align="center")
              el-table-column(v-for="index in [0, 1, 2, 3]", prop="scores", :key="index", :label="['1st', '2nd', '3rd', '4th'][index]", align="center", sortable)
                template(scope="scope")
                  span {{ scope.row.scores[index] === 0 ? '' : scope.row.scores[index] }}
            el-table-column(prop="from_id", label="From Adjudicator", align="center", sortable)
              template(scope="scope")
                span {{ adjudicator_by_id(scope.row.from_id).name }}
            el-table-column(align="right")
              template(scope="scope")
                el-button.edit(size="small", disabled) #[el-icon(name="edit")]
                el-button.delete(size="small", type="danger", disabled) #[el-icon(name="close")]
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
      'adjudicator_by_id',
      'target_score_sheets'
    ]),
    ...mapGetters('result', [
      'raw_speaker_results_by_r',
      'raw_team_results_by_r'
    ]),
    adjudicators_submitted () {
      return Array.from(new Set(this.raw_team_results_by_r(this.r_str).map(tr => tr.from_id)))
    },
    adjudicators_unsubmitted () {
      let adjudicators_watching = Array.from(new Set(this.target_score_sheets.map(ss => ss.id)))
      return adjudicators_watching.filter(id => !this.adjudicators_submitted.includes(id))
    }
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

  .edit
    margin-right .4rem

  .delete
    margin-right 1rem

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>
