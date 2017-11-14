<template lang="pug">
  loading-container(:loading="one_loading || one_reloading")
    router-view(v-if="!one_loading")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  components: {
    'loading-container': loading_container
  },
  props: ['r_str'],
  computed: {
    ...mapGetters([
      'target_round',
      'one_loading',
      'one_reloading'
    ])
  }
}
</script>

<style lang="stylus">
</style>
