<template lang="pug">
  .context
    .title
      h1 {{ title }}
    .content
      div(:class="slide_class")
        section(v-for="paragraph in current_slide", :class="paragraph_classes[paragraph.num]")
          div(v-for="phrase in paragraph")
            h1.text(v-if="phrase.tag === 'h1'") {{ phrase.text }}
            h2.text(v-if="phrase.tag === 'h2'") {{ phrase.text }}
            h3.text(v-if="phrase.tag === 'h3'") {{ phrase.text }}
            h4.text(v-if="phrase.tag === 'h4'") {{ phrase.text }}
            h5.text(v-if="phrase.tag === 'h5'") {{ phrase.text }}
            p.text(v-if="phrase.tag === 'p'") {{ phrase.text }}
    .footer
      .credit
        p {{ credit }}
      .pagination
        p {{ paragraph_num+' / '+(paragraphs_list[slide_num].length-1) }}, {{ (slide_num+1)+' / '+paragraphs_list.length }}
      .control
        el-button(style="padding: 0; border: none; background: none;", @click="on_previous", :disabled="slide_num === 0 && paragraph_num === 0") #[el-icon(name="arrow-left")]
        el-button(style="padding: 0; border: none; background: none;", @click="on_next", :disabled="slide_num+1 === paragraphs_list.length && paragraph_num+1 === paragraphs_list[slide_num].length") #[el-icon(name="arrow-right")]
</template>

<script>
import math from 'assets/js/math'

const timestep = 500

export default {
  props: [
    'paragraphs_list',
    'title',
    'credit'
  ],
  data () {
    return {
      slide_num: 0,
      paragraph_num: 0,
      current_slide: [[]],
      slide_class: '',
      paragraph_classes: []
    }
  },
  methods: {
    on_next () {
      if (this.paragraphs_list[this.slide_num].length > this.paragraph_num + 1) {
        this.paragraph_num += 1
        this.$emit('paragraph', 1)
      } else {
        if (this.paragraphs_list.length > this.slide_num + 1) {
          this.slide_num += 1
          this.paragraph_num = 0
          this.$emit('slide', 1)
        } else {
          this.$message({
            message: 'Last Slide',
            type: 'warning'
          })
        }
      }
    },
    on_previous () {
      if (this.paragraph_num > 0) {
        this.paragraph_num -= 1
        this.$emit('paragraph', -1)
      } else {
        if (this.slide_num > 0) {
          this.slide_num -= 1
          this.paragraph_num = this.paragraphs_list[this.slide_num].length - 1
          this.$emit('slide', -1)
        } else {
          this.$message({
            message: 'First Slide',
            type: 'warning'
          })
        }
      }
    },
    on_keyup_event(evt) {
      if (evt.key === 'Enter' || evt.key === 'ArrowRight') {
        this.on_next()
      } else if (evt.key === 'Backspace' || evt.key === 'ArrowLeft') {
        this.on_previous()
      }
    }
  },
  created () {
    window.addEventListener('keyup', this.on_keyup_event)
  },
  mounted () {
    this.paragraph_classes = Array(this.paragraphs_list[0].length).fill('undisplayed')
    this.$set(this.paragraph_classes, 0, 'slide-up-fade-in')
    setTimeout(() => {
      this.$set(this.paragraph_classes, 0, 'base')
    }, timestep)
    this.current_slide = this.paragraphs_list[0]
    this.$message({
      message: 'Press Enter key for the next slide',
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

    this.$on('slide', function (step) {
      if (step === 1) {
        this.slide_class = 'slide-up-fade-out'
        setTimeout(() => {
          this.slide_class = 'base'
          this.paragraph_classes = Array(this.paragraphs_list[this.slide_num].length).fill('undisplayed')
          this.current_slide = this.paragraphs_list[this.slide_num]
          this.$set(this.paragraph_classes, 0, 'slide-up-fade-in')
        }, timestep)
        setTimeout(() => {
          this.$set(this.paragraph_classes, 0, 'base')
        }, 2*timestep)
      } else if (step === -1) {
        //this.slide_class = 'fade-in'
        this.paragraph_classes = Array(this.paragraphs_list[this.slide_num].length).fill('base')
        this.current_slide = this.paragraphs_list[this.slide_num]
        //setTimeout(() => {
        //  this.slide_class = 'base'
        //  this.paragraph_classes.fill('base')
        //}, timestep)
      }
    })
    this.$on('paragraph', function (step) {
      if (step === 1) {
        setTimeout(() => {
          this.$set(this.paragraph_classes, this.paragraph_num, 'fade-in')
        }, timestep)
        setTimeout(() => {
          this.$set(this.paragraph_classes, this.paragraph_num, 'base')
        }, 2*timestep)
      } else if (step === -1) {
        this.$set(this.paragraph_classes, this.paragraph_num+1, 'fade-out')
        setTimeout(() => {
          this.$set(this.paragraph_classes, this.paragraph_num+1, 'undisplayed')
        }, timestep)
      }
    })
  },
  destroyed () {
    window.removeEventListener('keyup', this.on_keyup_event)
  }
}
</script>

<style lang="stylus">
  timestep = 0.5s

  .undisplayed
    opacity 0

  .fade-in {
      opacity 1
      transition all timestep
  }

  .fade-out {
      opacity 0
      transition all timestep
  }

  .slide-up-fade-out {
      animation-duration: timestep;
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
      animation-duration: timestep;
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
    height 70vh
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
      & h4
        font-size 2rem
        font-weight normal
      & h5
        font-size 1.5rem
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
