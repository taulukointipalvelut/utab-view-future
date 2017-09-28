<template lang="pug">
  .router-view-content
    section.page-header
      h1 Allocation
      h3 Round {{ draw.r }}
    section
      el-table(:data="draw.allocation")
        el-table-column(label="Venue")
          template(scope="scope")
            draggable.adj-list(v-model="scope.row.venues", :options="{ group: { name: 'venue' } }", @start="drag=true", @end="drag=false")
              .draggable-item(v-for="venue in scope.row.venues") {{ venue }}
        el-table-column(label="Gov")
          template(scope="scope")
            draggable.adj-list(v-model="scope.row.teams[0]", :options="{ group: { name: 'team' } }", @start="drag=true", @end="drag=false")
              .draggable-item(v-for="team in scope.row.teams[0]") {{ team.name }}
        el-table-column(label="Opp")
          template(scope="scope")
            draggable.adj-list(v-model="scope.row.teams[1]", :options="{ group: { name: 'team' } }", @start="drag=true", @end="drag=false")
              .draggable-item(v-for="team in scope.row.teams[1]") {{ team.name }}
        el-table-column(label="Chair")
          template(scope="scope")
            draggable.adj-list.chair(v-model="scope.row.chairs", :options="{ group: { name: 'adj-list' } }", @start="drag=true", @end="drag=false")
              .draggable-item(v-for="adjudicator in scope.row.chairs") {{ adjudicator.name }}
        el-table-column(label="Panel")
          template(scope="scope")
            draggable.adj-list.panel(v-model="scope.row.panels", :options="{ group: { name: 'adj-list' } }", @start="drag=true", @end="drag=false")
              .draggable-item(v-for="adjudicator in scope.row.panels") {{ adjudicator.name }}
        el-table-column(label="Trainee")
          template(scope="scope")
            draggable.adj-list.trainee(v-model="scope.row.trainees", :options="{ group: { name: 'adj-list' } }", @start="drag=true", @end="drag=false")
              .draggable-item(v-for="adjudicator in scope.row.trainees") {{ adjudicator.name }}
    section.adj-list-container
      draggable.adj-list.src(v-model="unpresent_adjudicators", :options="{ group: { name: 'adj-list' } }", @start="drag=true", @end="drag=false")
        .draggable-item(v-for="adjudicator in unpresent_adjudicators") {{ adjudicator.name }}
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
      loading: true,
      draw: {
        r: 1,
        allocation: [{
          venues: ['v1'],
          teams: {
            0: {
              id: 1,
              name: "t1"
            },
            1: {
              id: 2,
              name: "t2"
            }
          },
          chairs: [],
          panels: [],
          trainees: []
        }, {
          venues: ['v1'],
          teams: {
            0: {
              id: 1,
              name: "t1"
            },
            1: {
              id: 2,
              name: "t2"
            }
          },
          chairs: [],
          panels: [],
          trainees: []
        }]
      },
      adjudicators: [],
      teams: [],
      venues: [{
        id: 1,
        name: 'v1'
      }, {
        id: 2,
        name: 'v2'
      }]
    }
  },
  computed: {
    adjudicators () {
      let adjudicators = []
      for (let raw_adj of this.target_tournament.adjudicators) {
        let adj = {
          id: raw_adj.id,
          name: raw_adj.name,
          institutions: raw_adj.institutions,
          present: false,
          available: raw_adj.available
        }
        adjudicators.push(adj)
      }
      return adjudicators
    },
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
      'target_tournament'
    ])
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
