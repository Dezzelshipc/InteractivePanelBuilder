import { ref } from 'vue'

export type ResizeDirection =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'

export function useResize(options: {
  widgetId: string
  onResizeStart?: (direction: ResizeDirection, e: MouseEvent) => void
  onResizeMove?: (direction: ResizeDirection, dx: number, dy: number, e: MouseEvent) => void
  onResizeEnd?: (direction: ResizeDirection, e: MouseEvent) => void
}) {
  const isResizing = ref(false)
  const currentDirection = ref<ResizeDirection | null>(null)
  const startX = ref(0)
  const startY = ref(0)

  const handleMouseDown = (direction: ResizeDirection, e: MouseEvent) => {
    if (e.button !== 0) return

    e.preventDefault()
    e.stopPropagation()

    isResizing.value = true
    currentDirection.value = direction
    startX.value = e.clientX
    startY.value = e.clientY

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    document.body.style.userSelect = 'none'
    document.body.style.cursor = getCursor(direction)

    options.onResizeStart?.(direction, e)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.value || !currentDirection.value) return
    const dx = e.clientX - startX.value
    const dy = e.clientY - startY.value
    options.onResizeMove?.(currentDirection.value, dx, dy, e)
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (!isResizing.value || !currentDirection.value) return
    const direction = currentDirection.value
    isResizing.value = false
    currentDirection.value = null

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''

    options.onResizeEnd?.(direction, e)
  }

  function getCursor(direction: ResizeDirection): string {
    const map: Record<ResizeDirection, string> = {
      'top-left': 'nw-resize',
      top: 'n-resize',
      'top-right': 'ne-resize',
      right: 'e-resize',
      'bottom-right': 'se-resize',
      bottom: 's-resize',
      'bottom-left': 'sw-resize',
      left: 'w-resize',
    }
    return map[direction] || 'default'
  }

  return {
    isResizing,
    currentDirection,
    handleMouseDown,
  }
}
