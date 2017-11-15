<template lang="pug">
  .loading-container(v-loading.fillscreen.lock="loading", element-loading-text="Loading...")
    .dummy-cover(v-show="loading")
    .router-view-content(v-show="!loading")
      slot
</template>

<script>
  export default {
    name: "loading_container",
    props: {
      loading: Boolean
    }
  }
</script>

<style lang="stylus">
  .dummy-cover
    height 83vh
</style>
