<template lang="pug">
  div
    header(:data-nav-opened="nav_opened").header-wrapper
      .header-container
        #title
          span.nav-icon
            router-link(to="/", @click.native="dropdown(false)"): i.fa.fa-home
          //h1: router-link(to="/") PDA
          h1: router-link(to="/")
          span.nav-collapse-arrow
            button(@click="dropdown(!nav_opened)")
              i.caret-collapse-toggle
        nav: ul
          li.spacer
          li(v-if="target_tournament")
            router-link(v-if="tournament_href(target_tournament)", :to="tournament_href(target_tournament)", @click.native="dropdown(false)") {{ target_tournament.name }}
          li(v-if="target_tournament !== undefined && is_admin")
            a(@click="dropdown_wrapper(on_edit_info)") #[el-icon(name="message")]
          li
            a(@click="dropdown_wrapper(reload)") Reload #[el-icon(v-if="reloading", name="loading")] #[i.fa.fa-refresh(v-if="!reloading")]
          li(v-if="is_admin")
            a(@click="dropdown_wrapper(on_logout)") Sign-out #[i.fa.fa-sign-out]
          li(v-if="is_admin")
            router-link(v-if="!is_user", :to="admin_href", @click.native="dropdown(false)") {{ username }} #[el-icon(name="setting")]
            a(v-if="is_user") {{ username }}
          li(v-if="!is_admin")
            router-link(:to="user_login_href", @click.native="dropdown(false)") Sign-in #[i.fa.fa-sign-in]
          li(v-if="!is_admin")
            router-link(:to="signup_href", @click.native="dropdown(false)") Register

    el-dialog.message-dialog(title="Tournament Information", :visible.sync="editor.visible", v-if="!one_loading")
      span You can use Markdown here. For further information, press ? button below.
      markdown-editor.tournament-info(v-model="editor.text", :configs="editor.configs")
      .message-dialog-footer
        el-button(@click="editor.visible=false") Cancel
        el-button(type="primary", @click="on_send_info", :loading="editor.loading") Save
</template>

<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
  import { smartphone } from 'assets/js/media-query'
  import math from 'assets/js/math'
  import markdown_editor from 'vue-simplemde/src/markdown-editor'

  export default {
    components: {
      'markdown-editor': markdown_editor
    },
    props: {
      base_url: {
        type: String,
        default: ''
      },
      next: {
        type: String,
        default: null
      }
    },
    data () {
      return {
        editor: {
          text: '',
          visible: false,
          loading: false,
          configs: {
            spellChecker: false,
            autofocus: true,
            placeholder: 'Write Tounament Information. This will be displayed to tournament participants.',
            showIcons: ['bold'],
            tabSize: 4
          }
        },
        nav_opened: false
      }
    },
    computed: {
      is_user () {
        return ['speaker', 'adjudicator', 'audience'].includes(this.auth.usertype)
      },
      username () {
        if (this.is_user) {
          return math.capitalize(this.auth.usertype)
        } else {
          return this.auth.username
        }
      },
      el_menu_mode () {
        return smartphone ? 'vertical' : 'horizontal'
      },
      login_href () {
        return { path: '/login', query: { next: this.nextLoginPath } }
      },
      user_login_href () {
        let query = { next: this.nextLoginPath }
        if (this.target_tournament !== undefined) {
          query.tournament_id = this.target_tournament.id
        }
        return { path: '/login', query }
      },
      signup_href () {
        return { path: '/signup', query: { next: this.nextLoginPath } }
      },
      admin_href () {
        return { path: '/admin' }
      },
      nextLoginPath () {
        return this.next ?
               this.next :
               this.$route.fullPath
      },
      nextLogoutPath () {
        return this.next ?
               this.next :
               this.$route.fullPath
      },
      ...mapState([
        'reloading',
        'auth'
      ]),
      ...mapGetters([
        'is_admin',
        'one_reloading',
        'one_loading',
        'target_tournament',
        'tournament_href'
      ])
    },
    methods: {
      ...mapMutations([
        'set_one_reloading',
        'set_reloading'
      ]),
      ...mapActions([
        'init_tournaments',
        'init_one',
        'logout',
        'send_update_tournament'
      ]),
      dropdown_wrapper (f = () => {}) {
        this.dropdown(false)
        f()
      },
      on_edit_info () {
        let tournament = this.target_tournament
        this.editor.text = tournament.user_defined_data.info ? tournament.user_defined_data.info.text : ''
        this.editor.visible = true
      },
      async on_send_info () {
        this.editor.loading = true
        let tournament = this.target_tournament
        tournament.user_defined_data.info = {
          text: this.editor.text,
          time: Date.now()
        }
        await this.send_update_tournament({ tournament })
        this.editor.loading = false
        this.editor.visible = false
      },
      on_logout () {
        this.$router.push('/')
        this.logout()
        this.init_tournaments()
      },
      on_select (index, indexPath) {
        this.nav_opened = false
        location.href = this.menu_links[index]
      },
      dropdown (val) {
        this.nav_opened = val
      },
      url (target) {
        if (this.base_url.slice(-1) !== '/') {
          this.base_url + '/'
        }
        return this.base_url + target
      },
      async reload () {
        this.nav_opened = false
        let tournament = this.target_tournament
        if (tournament !== undefined) {
          this.set_one_reloading({ tournament, one_reloading: true })
          await this.init_one({ tournament })
          this.set_one_reloading({ tournament, one_reloading: false })
        } else {
          this.set_reloading({ reloading: true })
          await this.init_tournaments()
          this.set_reloading({ reloading: false })
        }
      }
    },
    watch: {
      '$route': function () {
        this.dropdown(false)
      }
    }
  }
</script>

<style lang="stylus">
  @import '~simplemde/dist/simplemde.min.css'

  $primary-color = #20a0ff
  //$primary-color = #69b241
  $header_height = 4rem
  $line_height = $header_height - 2rem

  .message-dialog
    div.el-dialog
      font-family Times
      .message-dialog-footer
        display flex
        justify-content flex-end
        margin-right 1rem

  .tournament-header-wrapper
    display flex
    justify-content space-between

  .markdown-editor.tournament-info
    margin-top 1rem

  a.fa.fa-columns.no-disable.no-mobile
    display none
  a.fa.fa-arrows-alt.no-disable.no-mobile
    display none

  header.header-wrapper
    opacity 0.9
    position fixed
    z-index 3
    background $primary-color
    margin 0
    padding-bottom 0.5rem
    width 100%
    box-shadow 0 1px 3px rgba(0, 0, 0, 0.3)
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

    & a,
    & button
      cursor pointer

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
        height $header_height + .5rem
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

    header.header-wrapper
      position fixed
      justify-content space-between
      height $header_height

      & .header-container
        flex-direction column

      & #title
        width 100%
        padding-left 10px
        box-sizing border-box
        display flex
        z-index 11

        & h1
          margin 0 0 0 10px
          height $header_height
          line-height 1.6
          flex 1

          & a
            padding 0

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
        //min-height 100vh
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
