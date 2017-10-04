<template lang="pug">
  .router-view-content
    section.page-header
      h1 Adjudicator Evaluation Sheet
      h3 {{ round_by_r(r_str).name }}
    loading-container(:loading="loading")
      section(v-if="!loading && has_adjudicators")
        el-progress(:text-inside="true", :stroke-width="18", :percentage="percentage", :status="success")
      section(v-if="!loading && has_adjudicators")
        el-table(:data="target_evaluation_sheets.slice().sort((ev1, ev2) => ev1.from_id > ev2.from_id)", @current-change="on_select", :row-class-name="row_class_name")
          el-table-column(prop="done", label="", width="40", align="center")
            template(scope="scope")
              span.icon-ok(v-if="scope.row.done")
                el-icon(name="check")
              span(v-else)
                el-icon(name="edit")
          el-table-column(prop="name", label="Name")
            template(scope="scope")
              span(v-if="scope.row.is_adjudicator") {{ adjudicator_by_id(scope.row.from_id).name }}
              span(v-if="!scope.row.is_adjudicator") {{ team_by_id(scope.row.from_id).name }}
          el-table-column(prop="venue", label="Venue", v-if="!smartphone")
      section(v-if="!loading && !has_adjudicators && !has_teams")
        span No Adjudicators and Teams Available
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapActions } from 'vuex'
import { smartphone } from 'assets/js/media-query.js'
import loading_container from 'components/loading-container'

export default {
  components: {
    'loading-container': loading_container
  },
  props: ['r_str'],
  computed: {
    ...mapState([
      'loading'
    ]),
    ...mapGetters([
      'target_tournament',
      'round_by_r',
      'adjudicator_by_id',
      'team_by_id',
      'details_1',
      'target_evaluation_sheets'
    ]),
    smartphone: smartphone,
    has_adjudicators () {
      return this.sorted_adjudicators && this.sorted_adjudicators.length > 0
    },
    has_teams () {
      return this.sorted_teams && this.sorted_teams.length > 0
    },
    sorted_adjudicators () {
      return this.target_tournament.adjudicators.slice().sort((a, b) => {
        if (a.done && !b.done) {
          return 1;
        } else if (!a.done && b.done) {
          return -1;
        } else if (a.done && b.done) {
          if (a.time !== b.time) {
            return a.time - b.time
          } else {
            return a.name.localeCompare(b.name)
          }
        } else if (!a.done && !b.done) {
          return a.name.localeCompare(b.name)
        }
        return 0
      })
    },
    sorted_teams () {
      return this.teams.slice().sort((a, b) => {
        if (a.done && !b.done) {
          return 1;
        } else if (!a.done && b.done) {
          return -1;
        } else if (a.done && b.done) {
          if (a.time !== b.time) {
            return a.time - b.time
          } else {
            return a.name.localeCompare(b.name)
          }
        } else if (!a.done && !b.done) {
          return a.name.localeCompare(b.name)
        }
        return 0
      })
    },
    percentage (): number {
      const teams_done = this.target_evaluation_sheets.filter(ev => ev.done)
      return Math.round((teams_done.length / this.target_evaluation_sheets.length) * 1000) / 10
    },
    success (): string {
      return this.percentage >= 100 ? 'success' : ''
    }
  },
  methods: {
    on_select (selected) {
      this.$router.push(selected.href.to)
    },
    row_class_name (row, index): string {
      let class_name = 'row'
      if (row.done) {
        class_name += ' done'
      }
      return class_name
    }
  }
}
</script>

<style lang="stylus">
  .row:hover
    cursor pointer

  .row.done
    background #c9e5f5

  .icon-ok
    color #20a0ff

</style>
