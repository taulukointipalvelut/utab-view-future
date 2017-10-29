<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading")
      el-card
        h2 Thank you! Your ballot was successfully sent.
        h2 You voted for #[span.voted-for {{ entity_name_by_id(winner) }} ({{ side_label }})].

    section.buttons(v-if="!loading")
      el-button(@click="on_home") #[i.fa.fa-home] Home
      //el-button(type="primary" @click="on_next", :disabled="loading") Next #[el-icon(name="arrow-right")]
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { smartphone } from 'assets/js/media-query'
import loading_container from 'components/loading-container'
import math from 'assets/js/math'

export default {
  components: {
    'loading-container': loading_container
  },
  computed: {
    winner () {
      return this.$route.query.winner
    },
    side () {
      return this.$route.query.side
    },
    side_label () {
      return this.target_tournament.style.side_labels[this.side]
    },
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapGetters([
      'entity_name_by_id',
      'target_tournament'
    ]),
    ...mapGetters('ballot', [
      'next',
      'converted'
    ])
  },
  methods: {
    capitalize: math.capitalize,
    on_home () {
      this.$router.push('/home')
    },
    on_next () {
      this.$router.push(this.next)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-card
    width 100%
    margin-bottom 2rem

  span.voted-for
    color red

</style>
<style lang="stylus">
  @import "./ballot"
</style>
