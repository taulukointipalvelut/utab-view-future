<template lang="pug">
  .router-view-content
    section.page-header
      h1 {{ target_tournament.name }}
    el-card(v-if="compiled_markdown !== ''").info-card.admin
      div.info-card-header(slot="header")
        h5(style="opacity: 0") {{ '----' }}
        .title
          h3 Important Notice
        .time
          h5 {{ info_time }}
      div.info-card-body(v-html="compiled_markdown")
    section
      link-list
        router-link(to="audience")
          link-list-item Audience
        router-link(to="speaker")
          link-list-item Debaters
        router-link(to="adjudicator")
          link-list-item Judges
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'
import marked from 'marked'

export default {
  components: {
    'link-list': link_list,
    'link-list-item': link_list_item
  },
  computed: {
    ...mapGetters([
      'target_tournament'
    ]),
    compiled_markdown () {
      let info = this.target_tournament.user_defined_data.info
      return marked(info ? info.text : '', { sanitize: true })
    },
    info_time () {
      let time = this.target_tournament.user_defined_data.info.time
      if (time !== undefined) {
        let date = new Date(time)
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' })
      } else {
        return ''
      }
    }
  }
}
</script>
