<template lang="pug">
  label.input-label {{ value }}
</template>

<script>
  export default {
    name: "input-label",
    props: {
      value: null,
      min: {
        type: [Number, Date, String],
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
  }
</script>

<style lang="stylus">
  .input-label
    background: #fff
    border-radius 4px
    border 1px solid #bfcbd9
    box-sizing border-box
    color #1f2d3d
    height 36px
    line-height 1
    outline 0
    padding 9px 10px
    width 100%
    display inline-block
</style>
