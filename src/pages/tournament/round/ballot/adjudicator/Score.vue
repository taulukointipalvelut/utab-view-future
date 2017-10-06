<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    section(v-if="result_editing")
      el-card(:class="side_name")
        div(slot="header").card-header-container
          span.card-title {{ role_name_long(role_name) | camelize }}
          span.card-subtitle {{ side_name | capitalize }}
        el-form
          el-form-item(label="Speaker", required, error="Select Speaker's Name")
            el-select(:value="result_editing.speakers[role_name]", @input="on_input_result('speakers', $event)", placeholder="Select Speaker")
              el-option(v-for="id in details_1(team_by_id(score_sheet.teams[side_name])).speakers", :key="id", :label="speaker_by_id(id).name", :value="id")
          el-form-item(label="Matter", required)
            number-box(:value="result_editing.matters[role_name]", @input="on_input_result('matters', $event)", :min="role_name === 'deputy' || role_name === 'member' ? 0.5 : 1", :max="role_name === 'deputy' || role_name === 'member' ? 5 : 10", :step="role_name === 'deputy' || role_name === 'member' ? 0.5 : 1")
          el-form-item(label="Manner", required)
            number-box(:value="result_editing.manners[role_name]", @input="on_input_result('manners', $event)", :min="role_name === 'deputy' || role_name === 'member' ? 0.5 : 1", :max="role_name === 'deputy' || role_name === 'member' ? 5 : 10", :step="role_name === 'deputy' || role_name === 'member' ? 0.5 : 1")
          el-form-item(label="Total Score")
            input-label(:value="total_score")
          el-form-item(label="Best Debater")
            el-switch(:value="result_editing.best[role_name]", @input="on_input_result('best', $event)", on-text="Yes", off-text="No")
          el-form-item(label="POI Prize")
            el-switch(:value="result_editing.poi[role_name]", @input="on_input_result('poi', $event)", on-text="Yes", off-text="No")
    section.buttons(v-if="result_editing")
      el-button(@click="on_prev") #[el-icon(name="arrow-left")] Back
      el-button(type="primary" @click="on_next", :disabled="loading || !proceedable") Next #[el-icon(name="arrow-right")]
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
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
      return this.result_editing.speakers[this.role_name] !== null
    },
    total_score () {
      return this.result_editing.matters[this.role_name] + this.result_editing.manners[this.role_name]
    },
    query () {
      return qs.parse(location.search.slice(1))
    },
    side_name () {
      return this.sequence_name.split('-')[0].toLocaleLowerCase()
    },
    role_name () {
      return this.sequence_name.split('-')[1].toLocaleLowerCase()
    },
    result_editing () {
      return this.result[this.side_name]
    },
    current_sequence_index () {
      return this.sequence.findIndex(x => x.toLocaleLowerCase() === this.sequence_name.toLocaleLowerCase())
    },
    prev () {
      return this.sequence[this.current_sequence_index - 1]
    },
    next () {
      return this.sequence[this.current_sequence_index + 1]
    },
    ...mapGetters([
      'team_by_id',
      'speaker_by_id',
      'details_1'
    ]),
    ...mapState([
      'loading'
    ]),
    ...mapState('ballot', [
      'result',
      'speakers',
      'sequence',
      'style'
    ])
  },
  methods: {
    on_prev () {
      const prev = this.query.prev ? this.query.prev : this.prev
      this.$router.push(prev)
    },
    on_next () {
      const next = this.query.next ? this.query.next : this.next
      this.$router.push(next)
    },
    on_input_result (key, value) {
      const side = this.side_name
      const role = this.role_name
      this.$store.commit('ballot/input_result', { side, role, key, value })
    },
    role_name_long (role_name) {
      return this.style.roles[this.side_name][this.role_name].long
    }
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
