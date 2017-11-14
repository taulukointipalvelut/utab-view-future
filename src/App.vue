<template lang="pug">
  #app
    router-view
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'app',
  async mounted () {
    await this.init_tournaments()
    let tournament = this.target_tournament
    if (tournament !== undefined) {
      await this.init_one({ tournament })
    }
  },
  computed: {
    ...mapState([
      'errors',
      'auth'
    ]),
    ...mapGetters([
      'target_tournament',
      'is_auth'
    ])
  },
  methods: {
    ...mapActions([
      'init_tournaments',
      'init_one'
    ]),
    ...mapMutations([
      'finish_loading',
      'start_loading'
    ])
  },
  watch: {
    errors (errs) {
      console.log(errs)
      errs.map(err => this.$notify({
        type: "error",
        title: "Error",
        message: err.message,
        duration: 0
      }))
    },
    is_auth (new_value) {
      if (!new_value) {
        this.$router.replace({ path: this.auth.href.login.to, query: { next: this.$route.fullPath } })
      }
    }
  }
}
</script>

<style lang="stylus">
  @import "./common"
  #app
    -webkit-font-smoothing antialiased
</style>
