<template lang="pug">
  .context
    .title
      h1 {{ title }}
    .content
      div(:class="texts_class")
        section(v-for="text in current_texts", :key="text.text")
          h1.text(v-if="text.tag === 'h1'") {{ text.text }}
          h2.text(v-if="text.tag === 'h2'") {{ text.text }}
          h3.text(v-if="text.tag === 'h3'") {{ text.text }}
          p.text(v-if="text.tag === 'p'") {{ text.text }}
    .footer
      .credit
        p {{ credit }}
      .pagination
        p {{ (current_slide+1)+' / '+texts_list.length }}
      .control
        el-button(style="padding: 0; border: none; background: none;", @click="on_previous", :disabled="current_slide === 0") #[el-icon(name="arrow-left")]
        el-button(style="padding: 0; border: none; background: none;", @click="on_next", :disabled="current_slide+1 === texts_list.length") #[el-icon(name="arrow-right")]
</template>

<script>
import math from 'assets/js/math'

export default {
  props: {
    texts_list: {
      default () { return [] }
    },
    title: "",
    credit: ""
  },
  data () {
    return {
      current_slide: 0,
      texts_class: '',
      current_texts: []
    }
  },
  methods: {
    on_next () {
      if (this.texts_list.length > this.current_slide + 1) {
        this.current_slide += 1
      } else {
        this.$message({
          message: 'Last Slide',
          type: 'warning'
        })
      }
    },
    on_previous () {
      if (this.current_slide > 0) {
        this.current_slide -= 1
      } else {
        this.$message({
          message: 'First Slide',
          type: 'warning'
        })
      }
    },
    range: math.range,
    on_keyup_event(evt) {
      if (evt.key === 'Enter' || evt.key === ' ' || evt.key === 'ArrowRight' || evt.key === 'ArrowDown') {
        this.on_next()
      } else if (evt.key === 'Backspace' || evt.key === 'ArrowLeft' || evt.key === 'ArrowUp') {
        this.on_previous()
      }
    }
  },
  watch: {
    current_slide (new_value, old_value) {
      if (new_value > old_value) {
        this.texts_class = 'slide-up-fade-out'
        setTimeout(() => {
          this.current_texts = this.texts_list[new_value]
          this.texts_class = 'slide-up-fade-in'
          setTimeout(() => {
            this.texts_class = 'base'
          }, 500)
        }, 500)
      } else {
        this.texts_class = 'slide-up-fade-out'
        setTimeout(() => {
          this.current_texts = this.texts_list[new_value]
          this.texts_class = 'slide-up-fade-in'
          setTimeout(() => {
            this.texts_class = 'base'
          }, 500)
        }, 500)
      }
    }
  },
  created () {
    window.addEventListener('keyup', this.on_keyup_event)
  },
  mounted () {
    this.$message({
      message: 'Press Space key for the next slide',
      duration: 4000,
      showClose: true
    })
    setTimeout(() => {
      this.$message({
        message: 'Press Backspace key for the previous slide',
        duration: 4000,
        showClose: true
      })
    }, 4000)
    this.current_texts = this.texts_list.length > 0 ? this.texts_list[0] : []
  },
  destroyed () {
    window.removeEventListener('keyup', this.on_keyup_event)
  }
}
</script>

<style lang="stylus">

  .undisplayed
    display none

  .slide-up-fade-out {
      animation-duration: 0.5s;
      animation-name: slideupfadeout;
      -webkit-animation-timing-function: ease-in;
  }

  @keyframes slideupfadeout {
      0% {
          margin-bottom: 0%;
          opacity: 1;
      }

      100% {
          margin-bottom: 10%;
          opacity: 0;
      }
  }

  .slide-up-fade-in {
      animation-duration: 0.5s;
      animation-name: slideupfadein;
      -webkit-animation-timing-function: ease-out;
  }

  @keyframes slideupfadein {
      0% {
          margin-top: 10%;
          opacity: 0;
      }

      100% {
          margin-top: 0%;
          opacity: 1;
      }
  }

  .context
    background white
    height 60vh
    color #555
    margin-top 0%
    text-shadow 0.1rem 0.1rem 0.05rem rgba(#999999, 0.15)

    .title
      position relative
      font-size 1.5rem
      margin-left 1.5rem
      height 10%
      & h1
        margin-top 1rem
        padding-right 0.3rem
        display inline-block
        font-weight normal
        font-family serif

    .content
      margin-top 9%
      height 70%
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

      .text
        margin 0
        padding 0

    .footer
      height 3%
      padding 0

      .credit
        width 40%
        text-align right
        margin-right 1rem
        float right

      .pagination
        width 40%
        text-align left
        margin-left 1rem
        color #a4a4a4
        float left
        font-size 1rem

      .control
        width 20%
        float center
        margin-left auto
        margin-right auto
        text-align center
        opacity 0.4
        transform scale(0.8, 0.8)
</style>
