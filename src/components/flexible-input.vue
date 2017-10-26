<template lang="pug">
  div(@click="on_click").flexible-wrapper
    span.flexible-span(v-show="!editing") {{ inner_text }}
    input.flexible-input(ref="input", v-show="editing", v-model="inner_text", @keyup.esc="restore_default", @keydown.enter="update", @blur="restore_default", spellcheck="false")
    el-icon.edit-icon(name="edit", v-show="!editing && !loading")
    el-icon.edit-icon(name="loading", v-show="loading")
    //el-icon(name="check", v-if="editing", style="color: red;")
</template>

<script>
  export default {
    name: "flexible-input",
    props: {
      text: {
        type: String
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        previous_text: '',
        editing: false,
        inner_text: ''
      }
    },
    mounted () {
      this.inner_text = this.text
    },
    methods: {
      on_click () {
        if (!this.loading) {
          this.editing=true
        }
      },
      update () {
        if (this.editing && this.inner_text.length !== 0) {
          this.editing = false
          return this.$emit('text-update', this.inner_text)
        }
      },
      restore_default () {
        if (this.editing) {
          this.editing = false
          this.inner_text = this.previous_text
        }
      }
    },
    watch: {
      editing (val) {
        if (val) {
          this.$emit('start')
          this.previous_text = this.inner_text
          this.$nextTick(function () {
            this.$refs.input.focus()
          })
        }
      },
      text (val) {
        this.inner_text = val
      }
    }
  }
</script>

<style lang="stylus">
  .flexible-wrapper
    display inline-block
    max-height 90%
    line-height 95%

  i.edit-icon
    font-size 0.7em
    color rgba(0, 0, 0, 0.6)
    margin-left 0.5em
    margin-bottom 0.3em

  input.flexible-input
    outline 0
    background-color rgba(92, 92, 92, 0.05)
    border none
    color inherit
    font inherit
    padding 0
    padding-left 1rem

  span.flexible-span
    padding-left 1rem
</style>
