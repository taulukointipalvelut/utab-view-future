<template lang="pug">
  loading-container.router-view-content(:loading="loading", no_item_text="Fail to load round data")
    router-view(:tournament="tournament", :loading="loading", v-if="round_by_r(r)")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  props: ['tournament', 'loading', 'r'],
  components: {
    'loading-container': loading_container
  },
  computed: {
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament',
      'round_by_r'
    ])
  }
}
</script>

<style lang="stylus">
</style>
