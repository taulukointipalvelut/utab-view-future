<template lang="pug">
  .link-list
    .link-list__legend
      slot(name="legend")
    ul.link-list__container
      slot
</template>

<script>
  export default {
    name: "link-list",
    props: [],
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
</style>
