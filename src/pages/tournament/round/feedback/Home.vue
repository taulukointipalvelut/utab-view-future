<template lang="pug">
  .router-view-content
    section.page-header
      h1 Judge Evaluation Sheet
      h3 {{ target_round.name }}
    loading-container(:loading="loading")
      section(v-if="!loading")
        el-progress(:text-inside="true", :stroke-width="18", :percentage="percentage", :status="success")
      section(v-if="!loading && target_round.team_allocation_opened && target_round.adjudicator_allocation_opened")
        el-table(:data="evaluation_sheets", @current-change="on_select", :row-class-name="row_class_name")
          el-table-column(prop="done", label="", width="40", align="center")
            template(slot-scope="scope")
              span.icon-ok(v-if="scope.row.done")
                el-icon(name="check")
              span(v-else)
                el-icon(name="edit")
          el-table-column(prop="name", label="Name")
            template(slot-scope="scope")
              span {{ entity_by_id(scope.row.from_id).name }}
          el-table-column(prop="venue", label="Venue", v-if="!smartphone")
            template(slot-scope="scope")
              span {{ entity_by_id(scope.row.venue).name }}
      section(v-else)
        p Evaluation Sheets for {{ target_round.name }} are not available.
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
    evaluation_sheets () {
      let evs = this.target_evaluation_sheets
      if (this.$route.query.hasOwnProperty('filter') && this.$route.query.filter === 'adjudicator') {
        evs = evs.filter(es => es.is_adjudicator)
      } else if (this.$route.query.hasOwnProperty('filter') && this.$route.query.filter !== 'adjudicator') {
        evs = evs.filter(es => !es.is_adjudicator)
      }
      return evs.slice().sort((ev1, ev2) => Math.abs(ev1.from_id) > Math.abs(ev2.from_id) ? 1 : -1)
    },
    ...mapState([
      'loading'
    ]),
    ...mapGetters([
      'target_tournament',
      'target_round',
      'entity_by_id',
      'details_1',
      'target_evaluation_sheets'
    ]),
    smartphone: smartphone,
    percentage (): number {
      const num_done = this.evaluation_sheets.filter(ev => ev.done)
      if (this.evaluation_sheets.length === 0) {
        return 0
      } else {
        return Math.round((num_done.length / this.evaluation_sheets.length) * 1000) / 10
      }
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
