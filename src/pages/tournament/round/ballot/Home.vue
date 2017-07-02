<template lang="pug">
  .router-view-content
    section.page-header
      h1 Score Sheet
      h3 {{ round.name }}
    loading-container(:loading="loading")
    section(v-if="!loading && has_adjudicators")
      el-progress(:text-inside="true", :stroke-width="18", :percentage="percentage", :status="success")
    section(v-if="!loading && has_adjudicators")
      el-table(:data="sorted_adjudicators", @current-change="on_select", :row-class-name="row_class_name")
        el-table-column(prop="done", label="", width="40", align="center")
          template(scope="scope")
            span.icon-ok(v-if="scope.row.done")
              el-icon(name="check")
            span(v-else)
              el-icon(name="edit")
        el-table-column(prop="name", label="Name")
          template(scope="scope")
            span {{ scope.row.name }} #[i.fa.fa-user-secret(v-if="scope.row.role === 'chair'")]
        el-table-column(prop="venue", label="Venue", v-if="!smartphone")
    section(v-if="!loading && !has_adjudicators")
      span No Adjudicators Available
</template>

<script>
/* @flow */
import { smartphone } from 'assets/js/media-query.js'
import loading_container from 'components/loading-container'

export default {
  props: ['tournament', 'round', 'adjudicators', 'loading'],
  components: {
    'loading-container': loading_container
  },
  computed: {
    smartphone: smartphone,
    has_adjudicators () {
      return this.sorted_adjudicators && this.sorted_adjudicators.length > 0
    },
    sorted_adjudicators () {
      return this.adjudicators.slice().sort((a, b) => {
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
      const adjudicators_done = this.adjudicators.filter((x) => x.done)
      return Math.round((adjudicators_done.length / this.adjudicators.length) * 1000) / 10
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
