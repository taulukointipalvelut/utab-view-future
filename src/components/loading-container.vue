<template lang="pug">
    .loading-container(v-loading="loading", element-loading-text="Loading...", :class="{ loading: loading }")
      slot
        span.loading-container__no-item {{ no_item_text }}
</template>

<script>
  export default {
    name: "loading_container",
    props: ['loading', 'no_item_text'],
    data () {
      return {
        /* none */
      }
    }
  }
</script>

<style lang="stylus">
  .loading-container
    padding 0
    margin 0
    
    &.loading
      min-height: 150px
      
      & .loading-container__no-item
        display none

    & .loading-container__no-item
      display block
      margin-left calc(7px + .7rem)
</style>
