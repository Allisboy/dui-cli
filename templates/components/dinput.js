import { html, useContext, useInsert, useValidateComponent, forwardProps, setContext, $state } from "pawajs"
import { cn } from "./utils"
import { formItemContext } from "./dform"
import { buttonGroupContext } from "./dbutton-group"
import { globalConfigContext } from "./dprovider"

const inputGroupContext = setContext()

export const DinputGroup = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const hasLeftIcon = $state(false)
    const hasRightIcon = $state(false)

    inputGroupContext.setValue({ hasLeftIcon, hasRightIcon })

    const Element = asChild() ? 'as-child' : 'div';

    const classActive = () => cn("relative flex w-full items-center", className())
    useInsert({ classActive })

    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`
}

export const DinputIcon = ({ children, side, className, asChild, ...props }) => {
    forwardProps(props)
    const ctx = useContext(inputGroupContext)
    
    const Element = asChild() ? 'as-child' : 'div';

    // Signal to the input that it needs padding
    if (side() === 'left') ctx.hasLeftIcon.value = true
    if (side() === 'right') ctx.hasRightIcon.value = true

    const classActive = () => cn(
        "absolute top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-foreground transition-colors",
        side() === 'left' ? "left-3" : "right-3",
        className()
    )
    useInsert({ classActive })

    return html `<${Element} class="@{classActive()}" -- >${children}</${Element}>`
}

export const Dinput = ({ className, type, size, error, asChild, ...props }) => {
    forwardProps(props)
    const { id } = useContext(formItemContext) || {}
    const groupCtx = useContext(buttonGroupContext) || {}
    const iconCtx = useContext(inputGroupContext)

    const baseStyles = "flex w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-accent-foreground"
    
    const sizes = () => ({
        sm: 'h-8 text-xs',
        md: 'h-9',
        lg: 'h-10 text-base'
    })

    const finalSize = () => groupCtx?.isInGroup ? groupCtx.size() : size()

    const Element = asChild() ? 'as-child' : 'input';

    const classActive = () => {
        const s = sizes()[finalSize()] || sizes().sm
        const err = error() ? 'border-red-500 focus-visible:ring-red-500' : ''
        
        // Add padding if icons are present
        const iconPadding = cn(
            iconCtx?.hasLeftIcon?.value ? "pl-10" : "",
            iconCtx?.hasRightIcon?.value ? "pr-10" : ""
        )
        
        return cn(baseStyles, s, err, iconPadding, "peer", className())
    }

    useInsert({ classActive, type, inputId: () => id || '' })

    return html`
        <${Element} 
            class="@{classActive()}"
            ${id ? `id="${id}"`:''}
            -- 
        />
    `
}

useValidateComponent(Dinput, {
    className: {
        default: '',
        type:String,
    },
    type: {
        default: 'text',
        type:String
    },
    size: {
        default: 'sm',
        type:String
    },
    error: {
        default: false,
        type: Boolean
    }
    ,
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DinputGroup, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DinputIcon, {
    side: { default: 'left', type: String }, 
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})