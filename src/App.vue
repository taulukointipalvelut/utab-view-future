<template lang="pug">
  #app
    router-view
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'app',
  mounted () {
    this.init_all()
  },
  computed: {
    ...mapState([
      'errors'
    ])
  },
  methods: {
    ...mapActions([
      'init_all'
    ]),
    ...mapMutations([
      'finish_loading'
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
    }
  }
}
</script>

<style lang="stylus">
  @import "./common"
</style>
