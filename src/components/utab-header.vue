<template lang="pug">
  header(:data-nav-opened="nav_opened")
    .header-container
      #title
        span.nav-icon
          a(:href="icon_href"): i.fa(:class="nav_icon_class")
        h1: a(href="/") utab
        span.nav-collapse-arrow
          button(@click="toggleDropdownMenu")
            i.caret-collapse-toggle
      nav: ul
        li.spacer
        li: a(:href="url(tournament.href)", v-if="tournament") {{ tournament.name }}
        li: a(:href="url('logout.html')" v-if="login") Logout
        li: a(:href="url('login.html')" v-if="!login") Login
</template>

<script>
  import { smartphone } from 'assets/js/media-query'
  export default {
    props: ['icon', 'icon_href', 'login', 'base_url', 'tournament'],
    data () {
      return {
        nav_opened: false
      }
    },
    computed: {
      el_menu_mode () {
        return smartphone ? 'vertical' : 'horizontal'
      },
      nav_icon_class () {
        return `fa-${ this.icon }`
      },
    },
    methods: {
      on_select (index, indexPath) {
        location.href = this.menu_links[index]
      },
      toggleDropdownMenu () {
        this.nav_opened = !this.nav_opened
      },
      url (target) {
        if (this.base_url.slice(-1) !== '/') {
          this.base_url + '/'
        }
        return this.base_url + target
      }
    }
  }
</script>

<style lang="stylus">
  $primary-color = #20a0ff
  $header_height = 5rem
  $line_height = $header_height - 2rem

  header
    background $primary-color
    margin 0
    width 100%
    box-sizing border-box
    display flex
    justify-content center
    align-items bottom
    height $header_height
    font-family "Oswald", sans-serif
    & .header-container
      max-width 860px
      flex 1
      display flex
      justify-content space-between
      align-items center
    
    & #title
      margin-left 3.5%
      margin-right 1rem
      
      & .nav-icon
        margin 1rem 0 1rem
        display inline-block
        
        & a
          display block
          color white
          
          & i.fa
            font-size 2rem

      & h1
        color white
        margin 0
        display inline-block
        line-height $line_height
        box-sizing border-box
        font-family "Oswald", sans-serif
        
        &:hover
          background rgba(255, 255, 255, .2)
          cursor pointer
        
        & a
          display block
          padding ($header_height - $line_height) 1rem 0
    
      & .nav-collapse-arrow
        display none

    & nav
      display inline-block
      margin 0 1rem
      box-sizing border-box
      flex 1 0 auto
      text-align right
  
      & ul
        list-style none
        margin 0
        padding 0
        box-sizing border-box
        display flex
        justify-content flex-end
  
        & li.spacer
          flex 1
        & li
          display inline-block
          box-sizing border-box
          line-height $line_height
          height $header_height
          padding 0
          
          &:not(.spacer):hover
            cursor pointer
            background rgba(255, 255, 255, .2)

          & a
            color white
            font-size 1rem
            padding ($header_height - $line_height + .2rem) 1rem 0
            display block
            box-sizing border-box
            vertical-align bottom

  @media (max-width: 599px)
    $header_height = 3.5rem
    $line_height = $header_height - 3.5rem
    $caret_size = 8px
    
    header
      justify-content space-between
      height 3.5rem

      & .header-container
        flex-direction column
      
      & #title
        width 100%
        padding-left 10px
        box-sizing border-box
        display flex
        z-index 11

        & h1
          line-height $line_height
          flex 1

        & .nav-collapse-arrow
          display inline-block
          margin 0
          box-sizing border-box
          color white
          text-align right
          
          & button
            padding 1.5rem 1rem 0
            display inline-block
            outline none
            border none
            color inherit
            background transparent
            height $header_height
            width $header_height

      & i.caret-collapse-toggle
        box-sizing border-box
        width $caret_size
        height $caret_size
        border $caret_size solid transparent
        border-top $caret_size solid #fff
        border-bottom 0 none transparent
      
      & nav
        display none
        width 100%
        min-height 100vh
        flex-basis 100%
        text-align left
        background $primary-color
        z-index 10
        box-sizing border-box
        margin $header_height 0 0
        
        & ul
          display none
    
    header[data-nav-opened]
      margin-bottom 100vh

      & #title .nav-collapse-arrow button
        padding 0 1rem 1.5rem
      & i.caret-collapse-toggle
        border-top 0 none transparent
        border-bottom $caret_size solid #fff

      & nav
        display block
        
        & ul
          display flex
          flex-direction column
          
          & li.spacer
            height .3.5rem
          & li
            height auto
            
            & a
              padding 1rem 1rem
              line-height 1
</style>
