<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    section(v-if="team")
      el-card(:class="side_name")
        div(slot="header").card-header-container
          span.card-title {{ role_name_long(role_name) | camelize }}
          span.card-subtitle {{ side_name | capitalize }}
        el-form
          el-form-item(label="Speaker", required, error="Select Speaker's Name")
            el-select(:value="result.id", @input="on_input_result('id', $event)", placeholder="Select Speaker")
              el-option(v-for="id in team_by_id(score_sheet[side_name]).speakers", :key="id", :label="speaker_by_id(id).name", :value="id")
          el-form-item(label="Matter", required)
            number-box(:value="result.matter", @input="on_input_result('matter', $event)", :min="1", :max="role_name == 'reply' ? 5 : 10", :step="role_name == 'reply' ? 0.5 : 1")
          el-form-item(label="Manner", required)
            number-box(:value="result.manner", @input="on_input_result('manner', $event)", :min="1", :max="role_name == 'reply' ? 5 : 10", :step="role_name == 'reply' ? 0.5 : 1")
          el-form-item(label="Total Score")
            input-label(:value="total_score")
          el-form-item(label="Best Debater")
            el-switch(:value="result.best_debater", @input="on_input_result('best_debater', $event)", on-text="Yes", off-text="No")
          el-form-item(label="POI Prize")
            el-switch(:value="result.poi_prize", @input="on_input_result('poi_prize', $event)", on-text="Yes", off-text="No")
    section.buttons(v-if="team")
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
  props: ['loading', 'sequence_name'],
  components: {
    'loading-container': loading_container,
    'number-box': number_box,
    'input-label': input_label
  },
  computed: {
    smartphone: smartphone,
    proceedable () {
      return this.result.id
    },
    total_score () {
      return this.result.matter + this.result.manner
    },
    query () {
      return qs.parse(location.search.slice(1))
    },
    side_name () {
      return this.sequence_name.split('-')[0]
    },
    role_name () {
      return this.sequence_name.split('-')[1]
    },
    team () {
      return [this.gov, this.opp].find(team => team.side.toLocaleLowerCase() === this.side_name.toLocaleLowerCase())
    },
    result () {
      return this.team.result[this.role_name.toLocaleLowerCase()]
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
      'speaker_by_id'
    ]),
    ...mapState('ballot', [
      'gov',
      'opp',
      'score_sheet',
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
      return this.style.roles[this.side_name.toLocaleLowerCase()][role_name.toLocaleLowerCase()].long
    }
  },
  filters: {
    capitalize (word) {
      return word[0].toUpperCase() + word.slice(1).toLowerCase()
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
