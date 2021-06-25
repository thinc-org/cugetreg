import React, { useState, useRef, useEffect, useCallback } from 'react'
import Measure, { ContentRect } from 'react-measure'

export interface RenderOnIntersectProps {
  id: string
  initialHeight: number
  children: React.ReactElement<React.RefAttributes<HTMLDivElement>>
}

const heightCache: Record<string, number> = {}

const RenderOnIntersect: React.FC<RenderOnIntersectProps> = ({ id, initialHeight, children }) => {
  const [intersecting, setIntersecting] = useState(false)
  const dummyBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (intersecting) {
      return
    }

    const target = dummyBoxRef.current
    if (target === null) {
      return
    }

    const options: IntersectionObserverInit = {
      rootMargin: '200px',
      threshold: 0,
    }

    const callback: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting) {
        setIntersecting(true)
      }
    }

    const observer = new IntersectionObserver(callback, options)
    observer.observe(target)

    return () => observer.unobserve(target)
  }, [intersecting])

  const onResize = useCallback(
    (contentRect: ContentRect) => {
      heightCache[id] = contentRect.bounds!.height
    },
    [id]
  )

  return intersecting ? (
    <Measure bounds onResize={onResize}>
      {({ measureRef }) =>
        React.cloneElement(children, {
          ref: measureRef,
        })
      }
    </Measure>
  ) : (
    <div ref={dummyBoxRef} style={{ height: heightCache[id] || initialHeight }} />
  )
}

export { RenderOnIntersect }
