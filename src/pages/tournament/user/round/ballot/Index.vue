<template lang="pug">
  .router-view-content
    router-view
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState([
      'auth'
    ])
  }
}
</script>
