import { getCompName } from 'src/utils'
import { App, cloneVNode, defineComponent, PropType, ref, Ref, VNode, watchEffect } from 'vue'

function setRootDomHook(vNodes: VNode[], ref: Ref<Element>): [vNodes: VNode[], hasEl: boolean] {
  // TODO: 内置组件判断
  // __isTeleport
  // __isSuspense
  // __isFragment
  let hasEl: boolean = false
  const newVNodes = vNodes.map(node => {
    if (hasEl) {
      return cloneVNode(node)
    }
    if (typeof node.type === 'string') {
      hasEl = true
      return cloneVNode(node, { ref: ref })
    } else if (typeof node.type === 'object') {
      // const nodeName = (node.type as Component).name
      hasEl = true
      return cloneVNode(node, {
        ref: (arg: any) => {
          ref.value = arg?.$el || null
        }
      })
    } else if (typeof node.type === 'symbol') {
      if (Array.isArray(node.children)) {
        const dynamicIndexArray = node.dynamicChildren.map(child => (node.children as VNode[]).indexOf(child))
        // @ts-ignore
        const [_vnodes, _hasEl] = setRootDomHook(node.children, ref)
        node.children = _vnodes
        node.dynamicChildren = dynamicIndexArray.map(i => _vnodes[i])
        hasEl = _hasEl
        return cloneVNode(node)
      }
    }
    return cloneVNode(node)
  })
  return [newVNodes, hasEl]
}

const EDomSlot = defineComponent({
  name: getCompName('EDomSlot'),
  // inheritAttrs: false,
  props: {
    init: {
      type: Function as PropType<(el: Element | null) => void>,
      default: undefined
    }
  },
  setup(props, { slots }) {
    const elRef = ref(null)
    watchEffect(() => {
      props.init?.(elRef.value || null)
    })
    return () => {
      if (!props.init) {
        return slots.default?.() || []
      }
      const defaults = slots.default?.() || []
      const [vNodes] = setRootDomHook(defaults, elRef)
      return vNodes
    }
  }
})

EDomSlot.install = (app: App): void => {
  app.component(EDomSlot.name, EDomSlot)
}

export default EDomSlot
