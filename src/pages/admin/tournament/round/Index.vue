<template lang="pug">
  router-view
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState([
      'auth'
    ]),
    ...mapGetters([
      'is_auth'
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
