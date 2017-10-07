<template lang="pug">
    router-view
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  props: [],
  components: {
    'loading-container': loading_container
  },
  computed: {
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'isAuth',
      'target_tournament'
    ])
  }
}
</script>

<style lang="stylus">
</style>
