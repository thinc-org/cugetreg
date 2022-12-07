import { ReactElement, forwardRef } from 'react'

interface CapturePropsProps<P> {
  children: (props: P) => ReactElement<P>
}

function CapturePropsComp<P>({ children, ...props }: CapturePropsProps<P> & P, ref: unknown) {
  return children({ ref, ...props } as unknown as P)
}

export const CaptureProps = forwardRef(CapturePropsComp) as <P>(
  p: CapturePropsProps<P> & { ref?: unknown }
) => ReactElement
