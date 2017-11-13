<template lang="pug">
  .number-box
    el-button(@click="on_minus", :disabled="minus_button_disabled", size="small"): el-icon(name="minus")
    el-input.number-box__input(ref="input", :value="value", @input="updateValue(Number.isNaN($event) ? $event.target.value : $event)", type="number", :max="max", :min="min", :step="step", :disabled="disabled")
    el-button(@click="on_plus", :disabled="plus_button_disabled", size="small"): el-icon(name="plus")
</template>

<script>
  export default {
    name: "number-box",
    props: {
      value: null,
      min: {
        type: [Number, Date, String],
        default: ''
      },
      max: {
        type: [Number, Date, String],
        default: ''
      },
      step: {
        type: [Number, String],
        default: 1
      },
      readonly: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        minus_button_disabled: false,
        plus_button_disabled: false
      }
    },
    mounted () {
      this.check_button_disabled()
    },
    watch: {
      value () {
        this.check_button_disabled()
      }
    },
    methods: {
      updateValue (value) {
        let val = value
        if (Number.isNaN(value)) {
          return
        }
        if (this.min && Number(value) < this.min) {
          val = this.min
        }
        if (this.max && Number(value) > this.max) {
          val = this.max
        }
        this.$emit('input', Number(val))
      },
      on_minus () {
        this.updateValue(this.$refs.input.value - this.step)
      },
      on_plus () {
        this.updateValue(this.$refs.input.value + this.step)
      },
      check_button_disabled () {
        if (this.min){
          this.minus_button_disabled = this.value <= this.min
        }
        if (this.max) {
          this.plus_button_disabled = this.value >= this.max
        }
      }
    }
  }
</script>

<style lang="stylus">
  .number-box
    display flex
    justify-content space-between
    align-items bottom
    flex-wrap nowrap
    
    & .number-box__input
      flex 1
      margin 0 5px
      
      & .el-input__inner
        text-align center
        appearance none
</style>
