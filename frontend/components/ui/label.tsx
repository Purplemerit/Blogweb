import * as React from "react"
import { mergeStyles } from "@/lib/utils"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ style, ...props }, ref) => (
    <label
      ref={ref}
      style={mergeStyles({
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1,
      }, style)}
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Label }
