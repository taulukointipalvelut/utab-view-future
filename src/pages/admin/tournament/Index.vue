<template lang="pug">
  loading-container.router-view-content(:loading="one_loading", no_item_text="Fail to load round data")
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
      'one_loading',
      'target_tournament'
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
