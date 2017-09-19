<template lang="pug">
  loading-container.router-view-content(:loading="loading", no_item_text="Fail to load round data")
    router-view(:tournament="tournament", :round="round", :loading="loading", v-if="round")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  props: ['tournament', 'round_num', 'loading'],
  components: {
    'loading-container': loading_container
  },
  computed: {
    round () {
      return this.target_round
    },
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament',
      'target_round'
    ])
  }
}
</script>

<style lang="stylus">
</style>
