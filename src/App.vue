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
  methods: {
    ...mapActions([
      'init_all'
    ]),
    ...mapMutations([
      'finish_loading'
    ])
  }
}
</script>

<style lang="stylus">
  @import "./common"
</style>
