<template lang="pug">
  div
    el-table(:data="entities.sort((e1, e2) => e1.id > e2.id)", @row-click="$emit('select')")
      el-table-column(prop="id", label="ID", width="60", align="center")
      el-table-column(prop="name", label="Name", show-overflow-tooltip)
      el-table-column
        template(scope="scope")
          el-button(size="small", @click="$emit('edit')") #[el-icon(name="edit")] Edit
          el-button(size="small", type="danger", @click="$emit('delete')") #[el-icon(name="close")] Delete
    .operations
      el-button(type="primary", @click="$emit('add')") #[el-icon(name="plus")] &nbsp;Add New {{ label }}
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { smartphone } from 'assets/js/media-query'
  export default {
    name: 'entity-list',
    props: ['entities', 'label'],
    data () {
      return {}
    },
    computed: {},
    methods: {}
  }
</script>

<style lang="stylus" scoped>
  .operations
    display flex
    justify-content flex-end
    margin-top 1rem
</style>
