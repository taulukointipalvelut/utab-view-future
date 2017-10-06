<template lang="pug">
  .context
    .title
      h1 {{ title }}
      p {{ on }}
    .content
      div(:class="texts_class")
        section(v-for="text in texts", :key="text.text")
          h1.text(v-if="text.tag === 'h1'") {{ text.text }}
          h2.text(v-if="text.tag === 'h2'") {{ text.text }}
          h3.text(v-if="text.tag === 'h3'") {{ text.text }}
          p.text(v-if="text.tag === 'p'") {{ text.text }}
    .credit
      p {{ credit }}
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'slide',
  props: {
    texts: {
      default () { return [] }
    },
    title: ""
  },
  data () {
    return {
      credit: "PDA Tournament 2018",
      on: false
    }
  },
  computed: {
    texts_class () {
      return {
        'fadeout': !this.on
      }
    }
  },
  methods: {
    texts_by_tag (tag) {
      return this.texts.filter(t => t.tag === tag)
    }
  },
  mounted () {
    setTimeout(() => {
      this.on = true
    }, 2000)
  }
}
</script>

<style lang="stylus">
  .context
    background white
    height 60vh
    color #555
  .title
    position relative
    font-size 1.5rem
    margin-left 1.5rem
    height 17%
    & h1
      margin-top 1rem
      padding-right 0.3rem
      display inline-block
      font-weight normal
      //border-bottom 2px solid
      //line-height 2rem
      font-family serif

  .content
    height 80%
    position relative
    display flex
    flex-direction column
    justify-content center
    align-items center
    text-align center
    font-family Times, 'Times New Roman'

    & h1
      font-size 4rem
      font-weight normal
    & h2
      font-size 3rem
      font-weight normal
    & h3
      font-size 2.5rem
      font-weight normal
    & p
      font-size 2rem

  .fadeout
    opacity 0.5
    transition all 1.5s

  .fadein
    transition all 1.5s
    opacity 1

  .text
    margin 0
    padding 0

  .credit
    height 3%
    text-align right
    margin-right 1rem
</style>
