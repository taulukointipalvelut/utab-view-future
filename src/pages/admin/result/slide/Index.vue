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
      'is_auth',
      'target_tournament'
    ])
  },
  mounted () {
    if (!this.is_auth) {
      this.$router.replace({ path: this.auth.href.login.to, query: { next: this.$route.fullPath } })
    }
  }
}
</script>

<style lang="stylus">
</style>
