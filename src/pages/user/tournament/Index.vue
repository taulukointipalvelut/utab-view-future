<template lang="pug">
  loading-container(:loading="one_loading || one_reloading")
    router-view
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import loading_container from 'components/loading-container'

export default {
  components: {
    'loading-container': loading_container
  },
  computed: {
    ...mapGetters([
      'target_tournament',
      'tournament_href',
      'one_loading',
      'one_reloading'
    ])
  },
  methods: {
    ...mapActions(['init_one'])
  },
  mounted () {
    this.init_one({ tournament: this.target_tournament })
  }
}
</script>
