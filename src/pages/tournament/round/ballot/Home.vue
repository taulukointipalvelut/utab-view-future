<template lang="pug">
  .router-view-content
    section.page-header
      h1 Score Sheet
      h3 {{ round_by_r(r_str).name }}
    loading-container(:loading="loading")
      section(v-if="round_by_r(r_str).team_allocation_opened && round_by_r(r_str).adjudicator_allocation_opened")
        section(v-if="!loading")
          el-progress(:text-inside="true", :stroke-width="18", :percentage="percentage", :status="success")
        section(v-if="!loading")
          el-table(:data="score_sheets", @current-change="on_select", :row-class-name="row_class_name")
            el-table-column(prop="done", label="", width="40", align="center")
              template(scope="scope")
                span.icon-ok(v-if="scope.row.done")
                  el-icon(name="check")
                span(v-else)
                  el-icon(name="edit")
            el-table-column(prop="from_id", label="Name")
              template(scope="scope")
                span {{ adjudicator_by_id(scope.row.from_id).name }} #[i.fa.fa-user-secret(v-if="scope.row.is_chair")]
            el-table-column(prop="venue", label="Venue", v-if="!smartphone")
              template(scope="scope")
                span {{ venue_by_id(scope.row.venue).name }}
      section(v-else)
        p Score Sheets for {{ round_by_r(r_str).name }} are not available.
</template>

<script>
/* @flow */
import { smartphone } from 'assets/js/media-query.js'
import { mapState, mapGetters, mapActions } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  props: ['r_str'],
  components: {
    'loading-container': loading_container
  },
  computed: {
    ...mapState([
      'loading'
    ]),
    ...mapGetters([
      'target_score_sheets',
      'adjudicator_by_id',
      'venue_by_id',
      'round_by_r',
      'target_tournament'
    ]),
    smartphone: smartphone,
    score_sheets () {
      return this.target_score_sheets
    },
    percentage (): number {
      if (this.target_score_sheets.length === 0) {
        return 0
      } else {
        const score_sheets_done = this.target_score_sheets.filter(ss => ss.done)
        return Math.round((score_sheets_done.length / this.target_score_sheets.length) * 1000) / 10
      }
    },
    success (): string {
      return this.percentage >= 100 ? 'success' : ''
    }
  },
  methods: {
    ...mapActions([
      'init_draws',
      'init_raw_results'
    ]),
    on_select (selected) {
      if (!selected.done) {
        this.$router.push(selected.href.to)
      }
    },
    row_class_name (row, index): string {
      let class_name = 'row'
      if (row.done) {
        class_name += ' done'
      }
      return class_name
    }
  },
  mounted () {
    this.init_draws()
    this.init_raw_results()
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
