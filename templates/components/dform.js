import { html, setContext, useContext, useInsert, useValidateComponent } from "pawajs"
import { cn } from "./utils"

export const formItemContext = setContext()


let idCounter = 0
export const DformItem = ({ children, className, asChild }) => {
    // Generate a unique ID for this specific form item instance
    if(idCounter >= 10000) idCounter = 0 // Reset counter if it gets too high to prevent overflow
    const id = `pawa-ui-${++idCounter}`
    
    formItemContext.setValue({ id })

    const classActive = () => cn("space-y-2", className())
    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ classActive })

    return html`
        <${Element} class="@{classActive()}">
            ${children}
        </${Element}>
    `
}

export const Dlabel = ({ children, className, asChild, required }) => {
    const { id } = useContext(formItemContext) || {}
    
    const classActive = () => cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className()
    )

    const Element = asChild() ? 'as-child' : 'label';

    useInsert({ classActive })

    return html`
        <${Element} 
            class="@{classActive()}" 
            for="${id}"
            --
        >
            ${children}
            ${required() ? html`<span class="text-destructive ml-1">*</span>` : ''}
        </${Element}>
    `
}

export const DformDescription = ({ children, className, asChild, variant }) => {
    const variants = {
        default: "text-muted-foreground",
        info: "text-info",
        warning: "text-warning",
        success: "text-success",
        destructive: "text-destructive"
    }

    const classActive = () => cn(
        "text-[0.8rem]",
        variants[variant()] || variants.default, className())
    const Element = asChild() ? 'as-child' : 'p';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`
}

export const DformMessage = ({ children, className, asChild, variant }) => {
    const variants = {
        default: "text-muted-foreground",
        destructive: "text-destructive",
        success: "text-success",
        warning: "text-warning",
        info: "text-info"
    }

    const classActive = () => cn(
        "text-[0.8rem] font-medium", 
        variants[variant()] || variants.destructive, 
        className())
    const Element = asChild() ? 'as-child' : 'p';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`
}

useValidateComponent(DformItem, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(Dlabel, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false },
    required: { type: Boolean, default: false }
})

useValidateComponent(DformMessage, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false },
    variant: { default: 'destructive', type: String }
})

useValidateComponent(DformDescription, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false },
    variant: { default: 'default', type: String }
})