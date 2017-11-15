<template lang="pug">
  .router-view-content
    section.page-header
      h1 Score Sheet
      h3 {{ target_round.name }}
    section(v-if="target_round.user_defined_data.team_allocation_opened && target_round.user_defined_data.adjudicator_allocation_opened")
      section
        el-progress(:text-inside="true", :stroke-width="18", :percentage="percentage", :status="success")
      section
        el-table(:data="score_sheets", @current-change="on_select", :row-class-name="row_class_name", empty-text="No score sheets are available")
          el-table-column(prop="done", label="", width="40", align="center")
            template(slot-scope="scope")
              span.icon-ok(v-if="scope.row.done")
                el-icon(name="check")
          el-table-column(prop="from_id", label="Name")
            template(slot-scope="scope")
              span {{ entity_name_by_id(scope.row.from_id) }} #[i.fa.fa-user-o(v-if="scope.row.is_chair")]
          el-table-column(prop="venue", label="Venue", v-if="!smartphone")
            template(slot-scope="scope")
              span {{ entity_name_by_id(scope.row.venue) }}
          el-table-column(label="Time", v-if="!smartphone")
            template(slot-scope="scope")
              span {{ elapsed_time(scope.row.created) }}
              span(v-if="scope.row.created === fastest_time") #[i.fa.fa-flag-checkered]
    section(v-else)
      p Score Sheets for {{ target_round.name }} are not available.
</template>

<script>
/* @flow */
import { smartphone } from 'assets/js/media-query.js'
import { mapState, mapGetters, mapActions } from 'vuex'
import math from 'assets/js/math.js'

export default {
  props: ['r_str'],
  computed: {
    fastest_time () {
        let sheets_done = this.score_sheets.filter(s => s.done)
        if (sheets_done.length === 0) {
            return 0
        } else {
            let fastest = sheets_done.sort((ss1, ss2) => ss1.created.getTime() > ss2.created.getTime() ? 1 : -1)[0].created
            return fastest
        }
    },
    ...mapGetters([
      'target_score_sheets',
      'entity_name_by_id',
      'target_round',
      'target_tournament'
    ]),
    smartphone: smartphone,
    score_sheets () {
      let score_sheets = this.target_score_sheets[parseInt(this.r_str, 10)]
      let score_sheets_done = score_sheets.filter(s => s.done).slice().sort((s1, s2) => this.entity_name_by_id(s1.from_id).localeCompare(this.entity_name_by_id(s2.from_id)))
      let score_sheets_undone = score_sheets.filter(s => !s.done).slice().sort((s1, s2) => this.entity_name_by_id(s1.from_id).localeCompare(this.entity_name_by_id(s2.from_id)))
      score_sheets_done.sort((s1, s2) => s1.created.getTime() > s2.created.getTime() ? 1 : -1)
      return score_sheets_undone.concat(score_sheets_done)
    },
    percentage (): number {
      let score_sheets = this.target_score_sheets[parseInt(this.r_str, 10)]
      if (score_sheets.length === 0) {
        return 0
      } else {
        const score_sheets_done = score_sheets.filter(ss => ss.done)
        return Math.round((score_sheets_done.length / score_sheets.length) * 1000) / 10
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
        if (this.target_round.user_defined_data.no_speaker_score) {
          this.$router.push(selected.href.to+'/winner')
        } else {
          this.$router.push(selected.href.to+'/speaker')
        }
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
