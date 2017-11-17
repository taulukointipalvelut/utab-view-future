<template lang="pug">
  draggable(v-model="list_adjusted").draggable-container
    .element-container(v-for="element in list_adjusted", :key="element.value", @click="toggle_disabled(element)")
      span(:class="{ 'disabled-filter': element.disabled }") {{ labels[element.value] }} #[el-badge(:value="number(element)")]
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    components: {
      'draggable': draggable
    },
    name: "draggable-list",
    props: ['list', 'labels'],
    data () {
      return {
        list_adjusted: []
      }
    },
    computed: {
      converted () {
        return this.list_adjusted.filter(e => !e.disabled).map(e => e.value)
      }
    },
    mounted () {
      for (let e of this.list) {
        this.list_adjusted.push({
          value: e,
          disabled: false
        })
      }
    },
    methods: {
      number (element) {
        if (element.disabled) {
          return null
        }
        let c = 1
        for (let e of this.list_adjusted) {
          if (e.value === element.value) {
            break
          }
          if (!e.disabled) {
            c += 1
          }
        }
        return c
      },
      toggle_disabled (element) {
        element.disabled = !element.disabled
      }
    },
    watch: {
      list_adjusted: {
        handler () {
          this.$emit('change', this.converted)
        },
        deep: true
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .draggable-container
    border solid 1px gray
    border-radius 4px
    padding-bottom 6px

  .element-container
    height 2rem
    margin 2px
    cursor pointer
    span
      margin-left 1rem
      font-family sans-serif

  .disabled-filter
    color rgb(152, 152, 152)
</style>
