<template lang="pug">
  router-view(v-if="target_round")
  h3(v-else) Round No. {{ r_str }} is not available
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
    ...mapGetters([
      'target_round'
    ])
  }
}
</script>

<style lang="stylus">
</style>
