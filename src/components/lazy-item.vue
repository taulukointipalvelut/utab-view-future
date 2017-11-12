<template lang="pug">
  div(v-observe-visibility="change_visibility")
    slot(v-if="visible")
</template>

<script>
  export default {
    name: "lazy-item",
    data () {
      return {
        visible: false
      }
    },
    methods: {
      change_visibility (visible) {
        if (visible) {
          this.visible = visible
        }
      }
    }
  }
</script>
