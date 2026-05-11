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

export const Dlabel = ({ children, className, asChild }) => {
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
        </${Element}>
    `
}

export const DformDescription = ({ children, className, asChild }) => {
    const classActive = () => cn("text-[0.8rem] text-[var(--muted-foreground)]", className())
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
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DformDescription, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})