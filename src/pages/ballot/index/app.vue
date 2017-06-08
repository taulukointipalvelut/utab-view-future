<template lang="pug">
  #app-content
    utab-header(icon="arrow-left", :icon_href="prev", :login="login", base_url="../../", :tournament="tournament")
    main
      section.page-header
        h1 Score Sheet
        h3 Round 1
      section
        el-progress(:text-inside="true", :stroke-width="18", :percentage="percentage", :status="success")
      section
        el-table(:data="sorted_adjudicators", @current-change="on_select", :row-class-name="row_class_name")
          el-table-column(prop="done", label="", width="40", align="center")
            template(scope="scope")
              span.icon-ok
                el-icon(name="check", v-if="scope.row.done")
          el-table-column(prop="name", label="Name")
          el-table-column(prop="venue", label="Venue", v-if="!smartphone")
          el-table-column(prop="href", label="", width="50", align="right", header-align="center")
            template(scope="scope")
              el-icon(name="edit")
</template>

<script>
import qs from 'qs'
import utab_header from 'components/utab-header.vue'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'
import { smartphone } from 'assets/js/media-query.js'

export default {
  components: {
    'utab-header': utab_header,
    'link-list': link_list,
    'link-list-item': link_list_item
  },
  data () {
    return {
      query: qs.parse(location.search.slice(1)),
      login: false,
      tournament: {
        name: 'PDA Tournament 2018',
        href: 'tournament.html'
      },
      adjudicators: [{
        done: false,
        name: 'Adjudicator 1',
        venue: 'E-204',
        href: 'Adjudicator%201'
      }, {
        done: true,
        name: 'Adjudicator 2',
        venue: 'Table 8',
        href: 'Adjudicator%202'
      }, {
        done: false,
        name: 'Adjudicator 5',
        venue: 'Table 13',
        href: 'Adjudicator%205'
      }, {
        done: false,
        name: 'Adjudicator 3',
        venue: 'Table 14',
        href: 'Adjudicator%203'
      }, {
        done: false,
        name: 'Adjudicator 6',
        venue: 'H-208',
        href: 'Adjudicator%206'
      }, {
        done: true,
        name: 'Adjudicator 7',
        venue: 'H-102',
        href: 'Adjudicator%207'
      }, {
        done: true,
        name: 'Adjudicator 4',
        venue: 'Riso H-286',
        href: 'Adjudicator%204'
      }]
    }
  },
  computed: {
    smartphone: smartphone,
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
    percentage () {
      const adjudicators_done = this.adjudicators.filter((x) => x.done)
      return Math.round((adjudicators_done.length / this.adjudicators.length) * 1000) / 10
    },
    success () {
      return this.percentage >= 100 ? 'success' : ''
    },
    prev () {
      return this.query.prev ? `../${ this.query.prev }` : '../adjudicator.html'
    }
  },
  methods: {
    on_select (selected) {
      location.href = `speaker.html?name=${ selected.href }`
    },
    row_class_name (row, index) {
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
  @import "../../../main.styl"

  .row:hover
    cursor pointer

  .row.done
    background #c9e5f5

  .icon-ok
    color #20a0ff

</style>
