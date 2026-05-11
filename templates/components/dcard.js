import { forwardProps, html, useInsert, useValidateComponent } from "pawajs"
import { cn } from "./utils"
 
export const Dcard = ({ children, variant, className, asChild, ...props }) => {
    forwardProps(props)
    
    const variants = {
        default: 'bg-background text-foreground shadow-sm border border-border',
        elevated: 'bg-background text-foreground shadow-md border border-border',
        outlined: 'bg-background text-foreground border border-border',
        ghost: 'bg-transparent border-none shadow-none text-foreground'
    }

    const classActive = () => cn(
        "rounded-xl overflow-hidden", 
        variants[variant()] || variants.default, 
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ classActive })

    return html `
    <${Element} class="@{classActive()}" -- >
        ${children}
    </${Element}>
    `
}

export const DcardHeader = ({ children, className, asChild }) => {
    const classActive = () => cn("flex flex-col space-y-1.5 p-6", className())
    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DcardTitle = ({ children, className, asChild }) => {
    const classActive = () => cn("font-semibold leading-none tracking-tight text-xl", className())
    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DcardDescription = ({ children, className, asChild }) => {
    const classActive = () => cn("text-sm text-[var(--muted-foreground)]", className())
    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DcardContent = ({ children, className, asChild }) => {
    const classActive = () => cn("p-6 pt-0", className())
    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DcardFooter = ({ children, className, place, asChild }) => {
    const placements = () => ({
        left: 'justify-start',
        right: 'justify-end',
        center: 'justify-center',
        between: 'justify-between'
    })
    const Element = asChild() ? 'as-child' : 'div';
    const classActive = () => cn(
        "flex items-center p-6 pt-0",
        placements()[place()] || '',
        className()
    )
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

useValidateComponent(Dcard, {
    className: { default: '', type: String },
    variant: { default: 'default', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DcardHeader, { 
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DcardTitle, { 
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DcardDescription, { 
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DcardContent, { 
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DcardFooter, { 
    className: { default: '', type: String },
    place: { default: 'left', type: String },
    asChild: { type: Boolean, default: false }
})