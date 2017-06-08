<template lang="pug">
  #app-content
    utab-header(icon="arrow-left", :icon_href="`./speaker.html?name=${ this.name() }`", :login="login", base_url="../../", :tournament="tournament")
    main
      section.page-header
        h1 {{ adjudicator.name }}
        h3 {{ adjudicator.venue }}
      section
        el-steps(:active="current_step", finish-status="success", center)
          el-step(title="Speaker")
          el-step(title="Score")
          el-step(title="Winner")
          el-step(title="Check")
          el-step(title="Done")
      section
        el-card(:class="side")
          div(slot="header").card-header-container
            span.card-title {{ role }}
            span.card-subtitle {{ side | capitalize }}
          el-form(:model="result")
            el-form-item(label="Speaker", required, error="Select Speaker's Name")
              el-select(v-model="result.speaker_id", placeholder="Select Speaker")
                el-option(v-for="speaker in team.speakers", :key="speaker", :label="option_label(speaker.name)", :value="speaker.id")
            el-form-item(label="Matter", required)
              number-box(v-model="result.matter", :min="1", :max="10")
            el-form-item(label="Manner", required)
              number-box(v-model="result.manner", :min="1", :max="10")
            el-form-item(label="Total Score")
              input-label(:value="total_score")
            el-form-item(label="Best Debater")
              el-switch(v-model="result.best_debater", on-text="Yes", off-text="No")
            el-form-item(label="POI Prize")
              el-switch(v-model="result.poi_prize", on-text="Yes", off-text="No")
      section.buttons
        el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
        el-button(type="primary" @click="on_next", :loading="sending") {{ sending ? 'Sending...' : 'Next' }} #[el-icon(name="arrow-right")]
</template>

<script>
import qs from 'qs'
import utab_header from 'components/utab-header.vue'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'
import number_box from 'components/number-box.vue'
import input_label from 'components/input-label.vue'
import { smartphone } from 'assets/js/media-query.js'

export default {
  components: {
    'utab-header': utab_header,
    'link-list': link_list,
    'link-list-item': link_list_item,
    'number-box': number_box,
    'input-label': input_label
  },
  data () {
    return {
      login: false,
      sending: false,
      tournament: {
        name: 'PDA Tournament 2018',
        href: 'tournament.html'
      },
      current_step: 1,
      adjudicator: {
        name: this.name(),
        venue: 'E-204'
      },
      role: 'Prime Minister',
      side: 'gov',
      team: {
        name: 'University of Tokyo',
        speakers: [{
          id: 1,
          name: 'Ryumei Nakada'
        }, {
          id: 2,
          name: 'Speaker 2'
        }, {
          id: 3,
          name: 'Speaker 3'
        }]
      },
      result: {
        speaker_id: 1,
        matter: 5,
        manner: 5,
        best_debater: false,
        poi_prize: false
      }
    }
  },
  computed: {
    smartphone: smartphone,
    total_score () {
      return this.result.matter + this.result.manner
    }
  },
  methods: {
    name () {
      return qs.parse(location.search.slice(1)).name
    },
    on_prev () {
      location.href = `./speaker.html?name=${ this.name() }`
    },
    on_next () {
      this.sending = true
      console.log(this.result)
    },
    option_label (speaker_name) {
      return this.smartphone ? speaker_name : `${ speaker_name } (${ this.team.name })`
    }
  },
  filters: {
    capitalize (v) {
      let s = v[0].toUpperCase() + v.slice(1).toLowerCase()
      return s
    }
  }
}
</script>

<style lang="stylus">
  @import "../../../main.styl"
  @import "../ballot.styl"

  .el-form-item__content
    width 100%
    
    & .input-label
      text-align center

    & .el-select
      width 100%
</style>
