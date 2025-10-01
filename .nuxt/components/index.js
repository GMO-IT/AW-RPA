export { default as DsFilter } from '../../components/DsFilter.vue'
export { default as Location } from '../../components/Location.vue'
export { default as Vfa } from '../../components/Vfa.vue'
export { default as Auth } from '../../components/auth.vue'
export { default as Staff } from '../../components/staff.vue'
export { default as RequestFormCreateCopy2909 } from '../../components/requestForm/Create-copy-2909.vue'
export { default as RequestFormCreate } from '../../components/requestForm/Create.vue'
export { default as RequestFormDetailCopy } from '../../components/requestForm/Detail-copy.vue'
export { default as RequestFormDetail } from '../../components/requestForm/Detail.vue'
export { default as RequestFormEdit } from '../../components/requestForm/Edit.vue'
export { default as RequestFormPrint } from '../../components/requestForm/Print.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
