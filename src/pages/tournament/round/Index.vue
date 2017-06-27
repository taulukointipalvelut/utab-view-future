<template lang="pug">
  loading-container.router-view-content(:loading="loading", no_item_text="Fail to load round data")
    router-view(:tournament="tournament", :round="round", :loading="loading", v-if="round")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  props: ['tournament', 'rounds', 'round_name', 'loading'],
  components: {
    'loading-container': loading_container
  },
  computed: {
    round () {
      return this.current_round
    },
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'isAuth',
      'current_round'
    ])
  }
}
</script>

<style lang="stylus">
</style>
