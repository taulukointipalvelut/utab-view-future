<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    section(v-if="score_sheet")
      el-card(:class="side_name")
        div(slot="header").card-header-container
          span.card-title {{ role_name_long | camelize }}
          span.card-subtitle {{ side_label | capitalize }}
        el-form
          el-form-item(label="Speaker", required, error="Select Speaker's Name")
            el-select(:value="value(side_name, 'speakers', role_order)", @input="on_input_result('speakers', $event)", placeholder="Select Speaker")
              el-option(v-for="id in access_detail(entity_by_id(score_sheet.teams[side_name]), r_str).speakers", :key="id", :label="entity_by_id(id).name", :value="id")
          el-form-item(label="Matter", required)
            number-box(:value="value(side_name, 'matters', role_order)", @input="on_input_result('matters', $event)", :min="role_range.from", :max="role_range.to", :step="role_range.unit")
          el-form-item(label="Manner", required)
            number-box(:value="value(side_name, 'manners', role_order)", @input="on_input_result('manners', $event)", :min="role_range.from", :max="role_range.to", :step="role_range.unit")
          el-form-item(label="Total Score")
            input-label(:value="total_score")
          el-form-item(label="Best Debater")
            el-switch(:value="value(side_name, 'best', role_order)", @input="on_input_result('best', $event)", on-text="Yes", off-text="No")
          el-form-item(label="POI Prize")
            el-switch(:value="value(side_name, 'poi', role_order)", @input="on_input_result('poi', $event)", on-text="Yes", off-text="No")
    section.buttons(v-if="score_sheet")
      el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
      el-button(type="primary" @click="on_next", :disabled="loading || !proceedable") Next #[el-icon(name="arrow-right")]
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import qs from 'qs'
import { smartphone } from 'assets/js/media-query'
import number_box from 'components/number-box'
import input_label from 'components/input-label'
import loading_container from 'components/loading-container'

export default {
  props: ['sequence_name', 'score_sheet', 'r_str'],
  components: {
    'loading-container': loading_container,
    'number-box': number_box,
    'input-label': input_label
  },
  computed: {
    smartphone: smartphone,
    proceedable () {
      return true//this.result_editing.speakers[this.role_name] !== null
    },
    total_score () {
      return this.value(this.side_name, 'manners', this.role_order) + this.value(this.side_name, 'matters', this.role_order)
    },
    side_label () {
      return this.style.side_labels_short[this.side_name]
    },
    side_name () {
      return this.sequence_name.split('-')[0]
    },
    role_order () {
      return parseInt(this.sequence_name.split('-')[1].toLocaleLowerCase(), 10)
    },
    role_range () {
      return this.style.roles[this.side_name].find(r => r.order === this.role_order).range
    },
    role_name () {
      return this.style.roles[this.side_name].find(r => r.order === this.role_order).abbr
    },
    result_editing () {
      return this.result[this.side_name]
    },
    role_name_long () {
      return this.style.roles[this.side_name].find(r => r.order === this.role_order).long
    },
    ...mapGetters([
      'entity_by_id',
      'access_detail',
      'style'
    ]),
    ...mapGetters('ballot', [
      'value'
    ]),
    ...mapState([
      'loading'
    ]),
    ...mapState('ballot', [
      'result'
    ])
  },
  methods: {
    ...mapMutations('ballot', [
      'input_result'
    ]),
    on_input_result (key, value) {
      this.input_result({ side: this.side_name, key, role_order: this.role_order, value })
    },
    on_prev () {
      let speaker_sequence = this.style.speaker_sequence.slice().sort((s1, s2) => s1.order > s2.order ? 1 : -1)
      let seq_index = speaker_sequence.findIndex(seq => seq.value === this.sequence_name)
      if (seq_index === 0) {
        return this.$router.push('../speaker')
      } else {
        return this.$router.push(speaker_sequence[seq_index - 1].value)
      }
    },
    on_next () {
      let speaker_sequence = this.style.speaker_sequence.slice().sort((s1, s2) => s1.order > s2.order ? 1 : -1)
      let seq_index = speaker_sequence.findIndex(seq => seq.value === this.sequence_name)
      if (seq_index === this.style.speaker_sequence.length - 1) {
        return this.$router.push('../winner')
      } else {
        return this.$router.push(speaker_sequence[seq_index + 1].value)
      }
    },
  },
  filters: {
    capitalize (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    },
    camelize (v) {
      const capitalize = word => word[0].toUpperCase() + word.slice(1).toLowerCase()
      const words = v.split(' ')
      return words.map(word => word === 'of' ? word : capitalize(word)).join(' ')
    }
  }
}
</script>

<style lang="stylus">
  @import "./ballot.styl"

  .el-form-item__content
    width 100%

    & .input-label
      text-align center

    & .el-select
      width 100%
</style>
