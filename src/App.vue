<template lang="pug">
  #app
    router-view
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'app',
  async mounted () {
    await this.start_loading()
    await this.init_tournaments()
    let tournament = this.target_tournament
    if (tournament !== undefined) {
      await this.init_one({ tournament })
    }
    await this.finish_loading()
  },
  computed: {
    ...mapState([
      'errors'
    ]),
    ...mapGetters([
      'target_tournament'
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
    }/*,
    '$route': function () {
      console.log("route changed")
    }*/
  }
}
</script>

<style lang="stylus">
  @import "./common"
</style>
