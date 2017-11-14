<template lang="pug">
  .router-view-content
    section.page-header
      h1 Judge Evaluation Sheet
      h3 {{ target_round.name }} #[span(v-if="draw_time && draw_time.updated") , {{ draw_time.text }}]
    section
      el-progress(:text-inside="true", :stroke-width="18", :percentage="percentage", :status="success")
    section(v-if="target_round.user_defined_data.team_allocation_opened && target_round.user_defined_data.adjudicator_allocation_opened")
      el-table(:data="evaluation_sheets", @current-change="on_select", :row-class-name="row_class_name", empty-text="No Evaluation Sheets are available")
        el-table-column(prop="done", label="", width="40", align="center")
          template(slot-scope="scope")
            span.icon-ok(v-if="scope.row.done")
              el-icon(name="check")
        el-table-column(prop="name", label="Name")
          template(slot-scope="scope")
            span {{ entity_name_by_id(scope.row.from_id) }}
        el-table-column(prop="venue", label="Venue", v-if="!smartphone")
          template(slot-scope="scope")
            span {{ entity_name_by_id(scope.row.venue) }}
        el-table-column(label="Time", v-if="!smartphone")
          template(slot-scope="scope")
            span {{ elapsed_time(scope.row.created) }}
    section(v-else)
      p Evaluation Sheets for {{ target_round.name }} are not available.
</template>

<script>
/* @flow */
import { mapState, mapGetters, mapActions } from 'vuex'
import { smartphone } from 'assets/js/media-query.js'
import math from 'assets/js/math.js'

export default {
  props: ['r_str'],
  computed: {
    evaluation_sheets () {
      let evs = this.target_evaluation_sheets[parseInt(this.r_str, 10)]
      if (this.$route.query.hasOwnProperty('filter') && this.$route.query.filter === 'adjudicator') {
        evs = evs.filter(es => es.is_adjudicator)
      } else if (this.$route.query.hasOwnProperty('filter') && this.$route.query.filter === 'team') {
        evs = evs.filter(es => !es.is_adjudicator)
      }
      let evs_done = evs.filter(ev => ev.done).slice().sort((s1, s2) => this.entity_name_by_id(s1.from_id).localeCompare(this.entity_name_by_id(s2.from_id)))
      let evs_undone = evs.filter(ev => !ev.done).slice().sort((s1, s2) => this.entity_name_by_id(s1.from_id).localeCompare(this.entity_name_by_id(s2.from_id)))
      evs_done.sort((e1, e2) => e1.created.getTime() > e2.created.getTime() ? 1 : -1)
      return evs_undone.concat(evs_done)
    },
    fastest_time () {
      let sheets_done = this.evaluation_sheets.filter(e => e.done)
      if (sheets_done.length === 0) {
        return null
      } else {
        let fastest = sheets_done.sort((es1, es2) => es1.created.getTime() > es2.created.getTime() ? 1 : -1)[0].created
        return fastest
      }
    },
    ...mapGetters([
      'target_round',
      'target_tournament',
      'draw_time',
      'entity_name_by_id',
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
    elapsed_time (created) {
      if (created === null) { return '' }
      return math.elapsed_string(created, this.fastest_time)
    },
    ...mapActions([
      'init_one'
    ]),
    on_select (selected) {
      if (!selected.done) {
        this.$router.push(selected.href.to)
      }
    },
    row_class_name ({row}): string {
      let class_name = 'row'
      if (row.done) {
        class_name += ' done'
      }
      return class_name
    }
  },
  mounted () {
    this.init_one({ tournament: this.target_tournament })
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
