<template lang="pug">
  div
    .slide_groups
        slide(v-for="index in range(texts_list.length)", :title="title", :texts="texts_list[index]", v-if="index === current_slide", :key="index")
    div.control
      el-button(style="padding: 0; border: none; background: none;", @click="on_previous", :disabled="current_slide === 0") #[el-icon(name="arrow-left")]
      el-button(style="padding: 0; border: none; background: none;", @click="on_next", :disabled="current_slide+1 === texts_list.length") #[el-icon(name="arrow-right")]
</template>

<script>
import slide from 'components/slide.vue'
import math from 'assets/js/math'

export default {
  components: {
    'slide': slide
  },
  props: {
    texts_list: {
      default () { return [] }
    },
    title: ""
  },
  data () {
    return {
      current_slide: 0
    }
  },
  methods: {
    on_next () {
      if (this.texts_list.length > this.current_slide + 1) {
        this.current_slide += 1
      } else {
        this.$message.error('Last Slide')
      }
    },
    on_previous () {
      if (this.current_slide > 0) {
        this.current_slide -= 1
      } else {
        this.$message.error('First Slide')
      }
    },
    range: math.range,
    on_keyup_event(evt) {
      if (evt.key === 'Enter' || evt.key === ' ') {
        this.on_next()
      } else if (evt.key === 'Backspace') {
        this.on_previous()
      }
    }
  },
  created () {
    window.addEventListener('keyup', this.on_keyup_event)
  }
}
</script>

<style lang="stylus">
  .control
    border none
    align center
    margin auto
    text-align center

  .slide_groups
    .first
      margin-top 25%
    .last
      margin-top 15%
      position relative
</style>
