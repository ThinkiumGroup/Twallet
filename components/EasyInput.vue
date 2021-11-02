<template>
  <input
      class="input"
      v-model="valueCopy"
      @input="handleInput"
      @change="handleChange"
      :type="type"
      :disabled="disabled"
      :style="containerStyle"/>
</template>
<script>
  export default {
    name: 'EasyInput',
    props: {
      value: {},
      type: {},
      containerStyle: {
          type: Object
      },
      disabledStyle: {
          type: Object,
          default: function () {
            return{

            }
          }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    model: {
      prop: 'value',
      event: 'input'
    },

    data() {
      return {
        valueCopy: {}
      }
    },
    methods: {
      handleInput(e) {
        this.$emit('input', e)
      },
      handleChange(e) {
        this.$emit('change', e)
      },
    },
    created() {
      this.valueCopy = this.value;
    },
    watch: {
      value() {
        this.valueCopy = this.value;
      }
    }
  }
</script>
<style scoped lang="scss">
    *{
        box-sizing: border-box;
    }
    .input{
        border: none
    }
</style>
