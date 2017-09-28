<template lang="pug">
  .router-view-content
    section.page-header
      h1 Allocation
      h3 Round {{ draw.r }}
    section
      el-table(:data="draw.allocation")
        el-table-column(label="Venue")
          template(scope="scope")
            draggable.adj-list(v-model="scope.row.venues", :options="venue_options", @start="drag=true", @end="drag=false")
              .draggable-item(v-for="id in scope.row.venues") {{ venue_by_id(id).name }}
        el-table-column(label="Gov")
          template(scope="scope")
            draggable.adj-list(v-model="scope.row.teams[0]", :options="team_options", @start="drag=true", @end="drag=false")
              .draggable-item(v-for="id in scope.row.teams[0]") {{ team_by_id(id).name }}
        el-table-column(label="Opp")
          template(scope="scope")
            draggable.adj-list(v-model="scope.row.teams[1]", :options="team_options", @start="drag=true", @end="drag=false")
              .draggable-item(v-for="id in scope.row.teams[1]") {{ team_by_id(id).name }}
        el-table-column(label="Chair")
          template(scope="scope")
            draggable.adj-list.chair(v-model="scope.row.chairs", :options="adjudicator_options", @start="drag=true", @end="drag=false")
              .draggable-item(v-for="id in scope.row.chairs") {{ adjudicator_by_id(id).name }}
        el-table-column(label="Panel")
          template(scope="scope")
            draggable.adj-list.panel(v-model="scope.row.panels", :options="adjudicator_options", @start="drag=true", @end="drag=false")
              .draggable-item(v-for="id in scope.row.panels") {{ adjudicator_by_id(id).name }}
        el-table-column(label="Trainee")
          template(scope="scope")
            draggable.adj-list.trainee(v-model="scope.row.trainees", :options="adjudicator_options", @start="drag=true", @end="drag=false")
              .draggable-item(v-for="id in scope.row.trainees") {{ adjudicator_by_id(id).name }}
    legend Adjudicators
    section.adj-list-container
      draggable.adj-list.src(v-model="adjudicators", :options="adjudicator_options", @start="drag=true", @end="drag=false")
        .draggable-item(v-for="id in adjudicators") {{ adjudicator_by_id(id).name }}
    legend Teams
    section.adj-list-container
      draggable.adj-list.src(v-model="teams", :options="team_options", @start="drag=true", @end="drag=false")
        .draggable-item(v-for="id in teams") {{ team_by_id(id).name }}
    legend Venues
    section.adj-list-container
      draggable.adj-list.src(v-model="venues", :options="venue_options", @start="drag=true", @end="drag=false")
        .draggable-item(v-for="id in venues") {{ venue_by_id(id).name }}
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import utab_header from 'components/utab-header.vue'
import draggable from 'vuedraggable'

export default {
  components: {
    'utab-header': utab_header,
    'draggable': draggable
  },
  data () {
    return {
      team_options: {
        group: { name: 'team-list' },
        animation: 100
      },
      adjudicator_options: {
        group: { name: 'adjudicator-list' },
        animation: 100
      },
      venue_options: {
        group: { name: 'venue-list' },
        animation: 100
      },
      loading: true,
      draw: {
        r: 1,
        allocation: [{
          venues: [1],
          teams: {
            0: [1],
            1: [2]
          },
          chairs: [-1],
          panels: [-2, -3],
          trainees: []
        }, {
          venues: [2],
          teams: {
            0: [3],
            1: [4]
          },
          chairs: [-4],
          panels: [],
          trainees: []
        }]
      },
      teams: [],
      adjudicators: [],
      venues: []
    }
  },
  computed: {
    loading_tournaments () {
      return !this.tournaments
    },
    icon_href () {
      return this.tournament ? this.tournament.href : { to: '/home' }
    },
    ...mapState([
      'auth',
      'tournaments'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament',
      'team_by_id',
      'adjudicator_by_id',
      'venue_by_id'
    ]),
    adjudicators_in_draw () {
      let adjudicators_in_draw = []
      for (let square of this.draw.allocation) {
        adjudicators_in_draw = adjudicators_in_draw.concat(square.chairs).concat(square.panels).concat(square.trainees)
      }
      return adjudicators_in_draw
    },
    teams_in_draw () {
      let teams_in_draw = []
      for (let square of this.draw.allocation) {
        teams_in_draw = teams_in_draw.concat(square.teams[0]).concat(square.teams[1])
      }
      return teams_in_draw
    },
    venues_in_draw () {
      let venues_in_draw = []
      for (let square of this.draw.allocation) {
        venues_in_draw = venues_in_draw.concat(square.venues)
      }
      return venues_in_draw
    },
    converted_draw () {
      let converted_draw = {
        r: this.draw.r,
        allocation: []
      }
      for (let raw_square of this.draw.allocation) {
        let square = {
          venue: raw_square.venues[0],
          teams: {
            0: raw_square.teams[0][0],
            1: raw_square.teams[1][0]
          },
          chairs: raw_square.chairs,
          panels: raw_square.panels,
          trainees: raw_square.trainees
        }
        converted_draw.allocation.push(square)
      }
      return converted_draw
    }
  },
  methods: {
    ...mapActions([
      'init_adjudicators',
      'init_teams'
    ])
  },
  mounted () {
    if (!this.isAuth) {
      this.$router.replace({ path: this.auth.href.login.to, query: { next: this.$route.fullPath } })
    }
    Promise.all([this.init_adjudicators(), this.init_teams()])
      .then(() => {
        this.teams = this.target_tournament.teams.map(t => t.id).filter(id => !this.teams_in_draw.includes(id))
        this.adjudicators = this.target_tournament.adjudicators.map(a => a.id).filter(id => !this.adjudicators_in_draw.includes(id))
        this.venues = this.target_tournament.venues.map(v => v.id).filter(id => !this.venues_in_draw.includes(id))
        this.loading = false
      })
  }
}
</script>

<style lang="stylus">
  @import '../../draggable'

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

  .el-table .cell
    padding 0

  .el-table .col-cell,
  .el-table th .cell
    padding 0 18px

  .adj-list
    margin 5px
    min-height 30px
    min-width 20%

  .adj-list-container
    width calc(100% - .5rem)
    background rgba(0, 0, 0, .05)
    padding-left .5rem
    padding-bottom .5rem
    min-height 50px

    .adj-list.src
      display flex
      flex-flow row wrap
      margin 0

      .draggable-item
        margin-right .5rem
        min-width 20%
</style>
