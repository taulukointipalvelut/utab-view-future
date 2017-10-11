<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    section(v-if="score_sheet")
      el-card(:class="side_name")
        div(slot="header").card-header-container
          span.card-title {{ role_name_long | camelize }}
          span.card-subtitle {{ side_label | capitalize }}
        el-form
          el-form-item(label="Speaker", required, error="Select Speaker's Name")
            el-select(:value="result_editing.speakers[role_name]", @input="on_input_result('speakers', $event)", placeholder="Select Speaker")
              el-option(v-for="id in details_1(team_by_id(score_sheet.teams[side_name])).speakers", :key="id", :label="speaker_by_id(id).name", :value="id")
          el-form-item(label="Matter", required)
            number-box(:value="result_editing.matters[role_name]", @input="on_input_result('matters', $event)", :min="role_range.from", :max="role_range.to", :step="role_range.unit")
          el-form-item(label="Manner", required)
            number-box(:value="result_editing.manners[role_name]", @input="on_input_result('manners', $event)", :min="role_range.from", :max="role_range.to", :step="role_range.unit")
          el-form-item(label="Total Score")
            input-label(:value="total_score")
          el-form-item(label="Best Debater")
            el-switch(:value="result_editing.best[role_name]", @input="on_input_result('best', $event)", on-text="Yes", off-text="No")
          el-form-item(label="POI Prize")
            el-switch(:value="result_editing.poi[role_name]", @input="on_input_result('poi', $event)", on-text="Yes", off-text="No")
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
  props: ['sequence_name', 'score_sheet'],
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
      return this.result_editing.matters[this.role_name] + this.result_editing.manners[this.role_name]
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
    role_name () {
      return this.style.roles[this.side_name].find(r => r.order === this.role_order).abbr
    },
    role_range () {
      return this.style.roles[this.side_name].find(r => r.order === this.role_order).range
    },
    result_editing () {
      return this.result[this.side_name]
    },
    role_name_long () {
      return this.style.roles[this.side_name].find(r => r.order === this.role_order).long
    },
    ...mapGetters([
      'team_by_id',
      'speaker_by_id',
      'details_1',
      'style'
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
      this.input_result({ side: this.side_name, key, role_name: this.role_name, value })
    },
    on_prev () {
      let seq_index = this.style.speaker_sequence.findIndex(seq => seq === this.sequence_name)
      if (seq_index === 0) {
        return this.$router.push('../speaker')
      } else {
        return this.$router.push(this.style.speaker_sequence[seq_index - 1])
      }
    },
    on_next () {
      let seq_index = this.style.speaker_sequence.findIndex(seq => seq === this.sequence_name)
      if (seq_index === this.style.speaker_sequence.length - 1) {
        return this.$router.push('../winner')
      } else {
        return this.$router.push(this.style.speaker_sequence[seq_index + 1])
      }
    },
  }/*,
  filters: {
    capitalize (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    },
    camelize (v) {
      const capitalize = word => word[0].toUpperCase() + word.slice(1).toLowerCase()
      const words = v.split(' ')
      return words.map(word => word === 'of' ? word : capitalize(word)).join(' ')
    }
  }*/
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
