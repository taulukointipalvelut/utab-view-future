<template lang="pug">
  #app-content
    utab-header(icon="home", icon_href="/", :login="login")
    main
      h1 Welcome!
      link-list
        link-list-item Tournaments
        link-list-item Config
      link-list
        legend(slot="legend") Admin
        link-list-item(href="login.html") Login
        link-list-item Config
</template>

<script>
import utab_header from 'components/utab-header.vue'
import link_list from 'components/link-list.vue'
import link_list_item from 'components/link-list-item.vue'

export default {
  components: {
    'utab-header': utab_header,
    'link-list': link_list,
    'link-list-item': link_list_item
  },
  data () {
    return {
      login: false
    }
  }
}
</script>

<style lang="stylus">
  body
    background-color #f5f5f5
  #app-content
    margin 0
    padding 0
    width 100%
    min-height 100vh
  a
    text-decoration none
    color inherit
  main
    padding 5%

  @media (min-width: 600px)
    main
      max-width 600px
      margin 0 auto

</style>
