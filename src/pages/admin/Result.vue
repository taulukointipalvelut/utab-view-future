<template lang="pug">
  .router-view-content
    h1 Welcome!

    loading-container(:loading="loading")
      section
        legend Tournaments
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import loading_container from 'components/loading-container'

  export default {
    props: ['tourmanents', 'loading', 'r'],
    components: {
      'loading-container': loading_container
    },
    computed: {}
  }
</script>
