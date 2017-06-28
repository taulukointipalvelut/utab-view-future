<template lang="pug">
  loading-container#ballot-speaker(:loading="loading")
    .card-container(v-if="!loading")
      el-card
        p Done!

    section.buttons(v-if="!loading")
      el-button(@click="on_prev") #[i.fa.fa-home] Home
      el-button(type="primary" @click="on_next", :disabled="loading") Next #[el-icon(name="arrow-right")]
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { smartphone } from 'assets/js/media-query'
import loading_container from 'components/loading-container'

export default {
  props: ['tournament', 'round', 'adjudicator', 'teams', 'loading'],
  components: {
    'loading-container': loading_container
  },
  computed: {
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'isAuth'
    ]),
    ...mapGetters('ballot', [
      'next'
    ])
  },
  methods: {
    on_prev () {
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
</style>
<style lang="stylus">
  @import "./ballot"
</style>
