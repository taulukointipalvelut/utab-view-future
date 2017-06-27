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
  $primary-color = #20a0ff
  .link-list-item
    line-height 2rem
    background #fff
    border-radius 4px
    border-color $primary-color
    border-style solid
    border-width 0 0 0 7px
    box-shadow 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)
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
      padding .5rem .2rem .2rem .2rem
      
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
      background $primary-color
      border-color $primary-color
      color #fff
      
      & .link-list-item__content .link-list-item__content-nav-icon
        color #fff
</style>
