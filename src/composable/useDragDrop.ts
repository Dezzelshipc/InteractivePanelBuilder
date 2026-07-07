import { ref } from 'vue'

export function useDragDrop(options: {
  widgetId: string
  onDragStart?: (e: DragEvent) => void
  onDrag?: (e: DragEvent, dx: number, dy: number) => void
  onDragEnd?: (e: DragEvent) => void
}) {
  const isDragging = ref(false)
  const startX = ref(0)
  const startY = ref(0)

  const handleDragStart = (e: DragEvent) => {
    if (!e.dataTransfer) return
    isDragging.value = true
    startX.value = e.clientX
    startY.value = e.clientY

    const target = e.target as HTMLElement
    const widgetId = target.dataset.widgetId
    if (widgetId) {
      e.dataTransfer.setData('text/plain', widgetId)
      e.dataTransfer.effectAllowed = 'move'
    }

    target.classList.add('dragging-source')

    options.onDragStart?.(e)
  }

  const handleDrag = (e: DragEvent) => {
    if (!isDragging.value || !e.clientX || !e.clientY) return
    const dx = e.clientX - startX.value
    const dy = e.clientY - startY.value
    options.onDrag?.(e, dx, dy)
  }

  const handleDragEnd = (e: DragEvent) => {
    isDragging.value = false
    const target = e.target as HTMLElement
    target.classList.remove('dragging-source')
    options.onDragEnd?.(e)
  }

  return {
    isDragging: isDragging,
    dragHandlers: {
      onDragstart: handleDragStart,
      onDrag: handleDrag,
      onDragend: handleDragEnd,
    },
  }
}
