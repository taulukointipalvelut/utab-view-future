<template lang="pug">
  #app-content(v-loading.fillscreen.lock="loading || reloading", element-loading-text="Loading...")
    utab-header
    main
      router-view(v-if="!loading")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import utab_header from 'components/utab-header.vue'

export default {
  components: {
    'utab-header': utab_header
  },
  computed: {
    ...mapState([
      'loading',
      'reloading'
    ]),
    ...mapGetters([
      'tournament_href',
      'target_tournament'
    ])
  }
}
</script>

<style lang="stylus">
  #app-content
    margin 0
    padding 0
    width 100%
    min-height 100vh
  main
    padding 5%

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto
</style>
