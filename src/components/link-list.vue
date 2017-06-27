<template lang="pug">
  .link-list
    .link-list__legend
      slot(name="legend")
    ul.link-list__container
      loading-container(:loading="loading", :no_item_text="no_item_text")
        slot
</template>

<script>
  import loading_container from 'components/loading-container'

  export default {
    name: "link-list",
    props: ['loading', 'no_item_text'],
    components: {
      'loading-container': loading_container
    },
    data () {
      return {
        /* none */
      }
    }
  }
</script>

<style lang="stylus">
  .link-list
    margin 0 0 1.5rem
  .link-list__legend
    font-size .8em
    color rgba(0, 0, 0, .54)
    margin-bottom .5rem
    font-family "Open Sans", sans-serif
  ul.link-list__container
    list-style none
    padding 0
    margin 0
    
    & .link-list-item
      margin 0 0 .5rem
</style>
