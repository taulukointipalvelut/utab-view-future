<template lang="pug">
  loading-container.router-view-content(:loading="loading", no_item_text="Fail to load round data")
    router-view(v-if="target_round")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  props: ['r_str'],
  components: {
    'loading-container': loading_container
  },
  computed: {
    ...mapState([
      'loading'
    ]),
    ...mapGetters([
      'target_round'
    ])
  }
}
</script>

<style lang="stylus">
</style>
