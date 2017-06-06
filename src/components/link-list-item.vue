<template lang="pug">
  li.link-list-item
    a.link-list-item__content(:href="href")
      span.link-list-item__content-icon(v-if="icon")
        i.fa(:class="icon_name")
      span.link-list-item__content-text
        slot
      span.link-list-item__content-nav-icon(v-if="nav_icon")
        i.fa(:class="nav_icon_name")
</template>

<script>
  export default {
    name: "link-list-item",
    props: {
      "href": {
        type: String
      },
      "icon": {
        type: String,
        default: ""
      },
      "nav_icon": {
        type: String,
        default: "chevron-right"
      }
    },
    data () {
      return {
        /* none */
      }
    },
    computed: {
      icon_name () {
        return `fa-${ this.icon }`
      },
      nav_icon_name () {
        return `fa-${ this.nav_icon }`
      }
    }
  }
</script>

<style lang="stylus">
  .link-list-item
    line-height 2rem
    border-color #dadada #1d8ce0
    border-style solid
    border-width 1px 0 0 5px
    box-shadow 1px 1px #555
    margin 0 0 .5rem
    padding 0
    color rgba(0, 0, 0, .87)
    
    &:first-child
      margin-top 0
    
    &:last-child
      margin-bottom 0
    
    & .link-list-item__content
      display flex
      justify-content space-between
      align-items baseline
      padding .2rem
      
      & *
        margin 0 .5rem
        
        &:first-child
          margin-right 0
        &:last-child
          margin-left 0

      & .link-list-item__content-icon,
      & .link-list-item__content-nav-icon
        width 1.2rem
        
        & i.fa
          margin 0
          font-size 1.2rem

      & .link-list-item__content-nav-icon
        color #1d8ce0
        text-align right
      
      & .link-list-item__content-text
        flex 1
    
    &:hover
      cursor pointer
      background #1d8ce0
      border-color #1d8ce0
      color #fff
      
      & .link-list-item__content .link-list-item__content-nav-icon
        color #fff
</style>
