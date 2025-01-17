import { describe, beforeEach, expect, it } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import MSButton from '@/components/MSButton.vue'

describe('MSButton', () => {
  let wrapper: VueWrapper<InstanceType<typeof MSButton>>

  beforeEach(() => {
    wrapper = mount(MSButton, {
      props: {
        icon: 'bi-star',
      },
    })
  })

  it('should be mounted', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should be native button', () => {
    expect(wrapper.element.nodeName).toBe('BUTTON')
  })

  it('should have icon with given class', () => {
    const icon = wrapper.find('i')

    expect(icon.isVisible()).toBeTruthy()
    expect(icon.classes('bi-star')).toBeTruthy()
  })

  describe('when prop label given', () => {
    beforeEach(async () => {
      await wrapper.setProps({ label: 'label' })
    })

    it('should have label', () => {
      const label = wrapper.find('label')

      expect(label.text()).toBe('label')
    })
  })

  describe('when prop disabled given', () => {
    beforeEach(async () => {
      await wrapper.setProps({ disabled: true })
    })

    it('should set disabled attribute', () => {
      expect(wrapper.element.disabled).toBe(true)
    })
  })

  describe('when prop mini given', () => {
    beforeEach(async () => {
      await wrapper.setProps({ mini: true })
    })

    it('should set mini class', () => {
      expect(wrapper.classes('mini')).toBeTruthy()
    })
  })

  describe('when prop type given', () => {
    beforeEach(async () => {
      await wrapper.setProps({ type: 'primary' })
    })

    it('should set mini class', () => {
      expect(wrapper.classes('primary')).toBeTruthy()
    })
  })
})
