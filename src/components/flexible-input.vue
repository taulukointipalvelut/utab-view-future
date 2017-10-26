<template lang="pug">
  div(@click="editing=true").flexible-wrapper
    span(v-if="!editing") {{ text }}
    input.flexible-input(v-if="editing", v-model="text", :autofocus="true", @keyup.enter="update", @change="update", @blur="editing=false")
    el-icon.edit-icon(name="edit", v-if="!editing")
    //el-icon(name="check", v-if="editing", style="color: red;")
</template>

<script>
  export default {
    name: "flexible-input",
    props: ['original_text'],
    data () {
      return {
        editing: false,
        text: ''
      }
    },
    mounted () {
      this.text = this.original_text
    },
    methods: {
      update () {
        this.editing = false
        return this.$emit('text-update', this.text)
      }
    }
  }
</script>

<style lang="stylus">
  .flexible-wrapper
    display inline-block

  i.edit-icon.el-icon-edit
    font-size 1rem
    color rgba(0, 0, 0, 0.6)
    margin-left 1rem
    margin-bottom 0.2rem

  input.flexible-input
    background-color rgba(139, 139, 139, 0.07)
    border none
    font inherit
    padding 0
</style>
