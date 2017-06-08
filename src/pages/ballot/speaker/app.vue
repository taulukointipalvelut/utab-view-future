<template lang="pug">
  #app-content
    utab-header(icon="arrow-left", icon_href="./index.html", :login="login", base_url="../../", :tournament="tournament")
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
      section.card-container
        el-card.gov
          div(slot="header").card-header-container
            span.card-title {{ gov.name }}
            span.card-subtitle Gov
          el-form(:model="gov_pos_name")
            el-form-item(label="PM", required, error="Select PM's Name")
              el-select(v-model="gov_pos_name.leader", placeholder="Select PM")
                el-option(v-for="speaker in gov.speakers", :key="speaker", :label="option_label(speaker.name, gov.name)", :value="speaker.id")
            el-form-item(label="DPM", required, error="Select DPM's Name")
              el-select(v-model="gov_pos_name.dupty", placeholder="Select DPM")
                el-option(v-for="speaker in gov.speakers", :key="speaker", :label="option_label(speaker.name, gov.name)", :value="speaker.id")
            el-form-item(label="MG", required, error="Select MG's Name")
              el-select(v-model="gov_pos_name.member", placeholder="Select MG")
                el-option(v-for="speaker in gov.speakers", :key="speaker", :label="option_label(speaker.name, gov.name)", :value="speaker.id")
            el-form-item(label="GR", required, error="Select GR's Name")
              el-select(v-model="gov_pos_name.reply", placeholder="Select GR")
                el-option(v-for="speaker in gov.speakers", :key="speaker", :label="option_label(speaker.name, gov.name)", :value="speaker.id")
        el-card.opp
          div(slot="header").card-header-container
            span.card-title {{ opp.name }}
            span.card-subtitle Opp
          el-form(:model="opp_pos_name", label-position="label_position")
            el-form-item(label="LO", required, error="Select LO's Name")
              el-select(v-model="opp_pos_name.leader", placeholder="Select LO")
                el-option(v-for="speaker in opp.speakers", :key="speaker", :label="option_label(speaker.name, opp.name)", :value="speaker.id")
            el-form-item(label="DLO", required, error="Select DLO's Name")
              el-select(v-model="opp_pos_name.dupty", placeholder="Select DLO")
                el-option(v-for="speaker in opp.speakers", :key="speaker", :label="option_label(speaker.name, opp.name)", :value="speaker.id")
            el-form-item(label="MO", required, error="Select MO's Name")
              el-select(v-model="opp_pos_name.member", placeholder="Select MO")
                el-option(v-for="speaker in opp.speakers", :key="speaker", :label="option_label(speaker.name, opp.name)", :value="speaker.id")
            el-form-item(label="OR", required, error="Select OR's Name")
              el-select(v-model="opp_pos_name.reply", placeholder="Select OR")
                el-option(v-for="speaker in opp.speakers", :key="speaker", :label="option_label(speaker.name, opp.name)", :value="speaker.id")
      section.buttons
        el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
        el-button(type="primary" @click="on_next") Next #[el-icon(name="arrow-right")]
</template>

<script>
import qs from 'qs'
import utab_header from 'components/utab-header.vue'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'
import { smartphone } from 'assets/js/media-query.js'

console.log('smartphone:', smartphone())

export default {
  components: {
    'utab-header': utab_header,
    'link-list': link_list,
    'link-list-item': link_list_item
  },
  data () {
    return {
      login: false,
      tournament: {
        name: 'PDA Tournament 2018',
        href: 'tournament.html'
      },
      current_step: 0,
      adjudicator: {
        name: this.name(),
        venue: 'E-204'
      },
      gov: {
        name: 'Super Duper Jumpin\' Long Team Name',
        speakers: [{
          id: 1,
          name: 'Speaker 1'
        }, {
          id: 2,
          name: 'Speaker 2'
        }, {
          id: 3,
          name: 'Speaker 3'
        }]
      },
      opp: {
        name: 'Team B',
        speakers: [{
          id: 4,
          name: 'Speaker 4'
        }, {
          id: 5,
          name: 'Speaker 5'
        }, {
          id: 6,
          name: 'Speaker 6'
        }, {
          id: 7,
          name: 'Speaker 7'
        }]
      },
      gov_pos_name: {
        leader: '',
        dupty: '',
        member: '',
        reply: ''
      },
      opp_pos_name: {
        leader: '',
        dupty: '',
        member: '',
        reply: ''
      }
    }
  },
  computed: {
    smartphone: smartphone
  },
  methods: {
    name () {
      return qs.parse(location.search.slice(1)).name
    },
    on_prev () {
      location.href = "./index.html"
    },
    on_next () {
      location.href = `./score.html?name=${ this.name() }`
    },
    option_label (speaker_name, team_name) {
      return this.smartphone ? speaker_name : `${ speaker_name } (${ team_name })`
    }
  }
}
</script>

<style lang="stylus">
  @import "../../../main.styl"
  @import "../ballot.styl"
</style>
