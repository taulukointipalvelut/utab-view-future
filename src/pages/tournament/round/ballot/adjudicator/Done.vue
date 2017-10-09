<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading")
      el-card
        h2 Thank you! Your ballot was successfully sent.
        h2 You voted for {{ team_by_id(winner).name }}.

    section.buttons(v-if="!loading")
      el-button(@click="on_home") #[i.fa.fa-home] Home
      //el-button(type="primary" @click="on_next", :disabled="loading") Next #[el-icon(name="arrow-right")]
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { smartphone } from 'assets/js/media-query'
import loading_container from 'components/loading-container'

export default {
  components: {
    'loading-container': loading_container
  },
  data () {
    return {
      winner: ""
    }
  },
  computed: {
    ...mapState([
      'auth',
      'loading'
    ]),
    ...mapState('ballot', [
      'result'
    ]),
    ...mapGetters([
      'isAuth',
      'team_by_id'
    ]),
    ...mapGetters('ballot', [
      'next',
      'converted'
    ])
  },
  methods: {
    ...mapMutations('ballot', [
      'reset_state'
    ]),
    on_home () {
      this.$router.push('/home')
    },
    on_next () {
      this.$router.push(this.next)
    }
  },
  mounted () {
    this.winner = this.result.winner
    this.reset_state()
  }
}
</script>

<style lang="stylus" scoped>
  .el-card
    width 100%
    margin-bottom 2rem
</style>
<style lang="stylus">
  @import "./ballot"
</style>
