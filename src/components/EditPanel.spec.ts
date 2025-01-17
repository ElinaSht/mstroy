import { describe, beforeEach, expect, it } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import EditPanel from '@/components/EditPanel.vue'

describe('EditPanel', () => {
  let wrapper: VueWrapper<InstanceType<typeof EditPanel>>

  beforeEach(() => {
    wrapper = mount(EditPanel, {
      props: {
        canUndo: true,
        canRedo: true,
        editing: false,
      },
    })
  })

  it('should be mounted', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should have edit button', () => {
    const button = wrapper.findComponent('[data-testid="edit-button"]')

    expect(button.isVisible()).toBeTruthy()
    expect(button.props('icon')).toBe('bi-pencil-square')
  })

  it('should have mode label', () => {
    const label = wrapper.find('[data-testid="mode"]')

    expect(label.isVisible()).toBeTruthy()
    expect(label.text()).toBe('просмотр')
  })

  describe('when editing is true', () => {
    beforeEach(async () => {
      await wrapper.setProps({ editing: true })
    })

    it('should change mode label', () => {
      const label = wrapper.find('[data-testid="mode"]')

      expect(label.text()).toBe('редактирование')
    })

    it('should change edit button icon', () => {
      const button = wrapper.findComponent('[data-testid="edit-button"]')

      expect(button.props('icon')).toBe('bi-floppy')
    })

    it('should have undo and redo buttons', () => {
      const undoButton = wrapper.findComponent('[data-testid="undo-button"]')
      const redoButton = wrapper.findComponent('[data-testid="redo-button"]')

      expect(undoButton.isVisible()).toBeTruthy()
      expect(redoButton.isVisible()).toBeTruthy()
    })
  })
})
