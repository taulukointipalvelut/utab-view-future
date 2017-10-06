<template lang="pug">
  .context
    .title
      h1 {{ title }}
    .content
        //div(:class="{ slide: on, unslide: !on }")
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
    title: "",
    on: false
  },
  data () {
    return {
      credit: "PDA Tournament 2018"
    }
  },
  methods: {
    texts_by_tag (tag) {
      return this.texts.filter(t => t.tag === tag)
    }
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

    .unslide
      opacity 1
      border solid 1px red
      transition all 1.5s

    .slide
      opacity 1
      border solid 1px red
      transition all 1.5s

  .text
    margin 0
    padding 0

  .credit
    height 3%
    text-align right
    margin-right 1rem
</style>
