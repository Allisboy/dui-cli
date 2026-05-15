import { html, useInsert, useValidateComponent, forwardProps } from "pawajs"
import { cn } from "./utils"

export const DfloatButton = ({ children, className, variant, position, asChild, strategy, ...props }) => {
    forwardProps(props)
    
    const positions = {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
    }

    const variants = {
        default: "bg-primary text-primary-foreground shadow-lg hover:opacity-90",
        secondary: "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground shadow-lg hover:opacity-90",
        outline: "border border-border bg-background hover:bg-accent text-foreground shadow-sm",
    }

    const classActive = () => cn(
" z-50 flex h-14 w-14 items-center justify-center rounded-full overflow-hidden transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        positions[position()] || positions["bottom-right"],
        variants[variant()] || variants.default,
        strategy(),
        className()
    )

    const Element = asChild() ? 'as-child' : 'button';

    useInsert({ classActive })

    return html`
        <${Element} 
            class="@{classActive()}" 
            type="button" -- >
            <div class="flex items-center justify-center w-full h-full pointer-events-none">
                ${children}
            </div>
        </${Element}>
    `
}

useValidateComponent(DfloatButton, {
    className: { default: '', type: String },
    variant: { 
        default: 'default', 
        type: String 
    },
    position: { 
        default: 'bottom-right', 
        type: String 
    },
    strategy: {
        default: 'fixed',
        type: String
    },
    asChild: { 
        type: Boolean, 
        default: false 
    }
})