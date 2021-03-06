<template>
  <div
    :class="{
      'el-input': true,
      'has-prefix': hasPrefix,
      'has-suffix': hasSuffix || clearable,
      'is-focus': isFocus
    }"
  >
    <input
      type="text"
      class="el-input__inner"
      :value="modelValue"
      @input="inputHandler"
      @focus="focusHandler"
      @blur="blurHandler"
      @change="changeHandler"
    />
    <div v-if="hasPrefix" class="el-input__prefix">
      <slot name="prefix">
        {{ prefix }}
      </slot>
    </div>
    <div v-if="hasSuffix" class="el-input__suffix">
      <slot name="suffix">
        {{ suffix }}
      </slot>
    </div>
    <div
      v-else-if="clearable"
      v-show="modelValue"
      class="el-input__suffix el-input__suffix--close"
      @click="clearHandler"
    >
      <IconXCircleFill />
    </div>
  </div>
</template>
<script lang="ts">
import { propTypes } from 'src/utils/PropTypes'
import { App, computed, defineComponent, reactive, ref } from 'vue'
import { IconXCircleFill } from '@elenext/icons'
const EInput = defineComponent({
  name: 'EInput',
  components: {
    IconXCircleFill
  },
  props: {
    modelValue: propTypes.string(),
    prefix: propTypes.string(),
    suffix: propTypes.string(),
    clearable: propTypes.boolean(),
    disabled: propTypes.boolean()
  },
  emits: ['update:modelValue', 'input', 'focus', 'blur', 'change'],
  setup(props, { attrs, slots, emit }) {
    const hasPrefix = computed(() => slots.prefix || props.prefix)
    const hasSuffix = computed(() => slots.suffix || props.suffix)
    const isFocus = ref(false)

    const inputHandler = (event: Event) => {
      const { value } = event.target as HTMLInputElement
      emit('update:modelValue', value)
      emit('input', value)
    }
    const focusHandler = (event: any) => {
      isFocus.value = true
      emit('focus', event)
    }
    const blurHandler = (event: any) => {
      isFocus.value = false
      emit('blur', event)
    }

    const changeHandler = (event: any) => {
      emit('change', event)
    }
    const clearHandler = (event: any) => {
      emit('update:modelValue', '')
    }
    return {
      hasPrefix,
      hasSuffix,
      isFocus,
      inputHandler,
      focusHandler,
      blurHandler,
      changeHandler,
      clearHandler
    }
  }
})
EInput.install = (app: App): void => {
  app.component(EInput.name, EInput)
}
export default EInput
</script>
