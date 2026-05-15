import { html, useInsert, useValidateComponent, forwardProps } from "pawajs"
import { cn } from "./utils"

export const Dempty = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const classActive = () => cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-md border border-dashed border-border p-8 text-center animate-in fade-in-50",
        className()
    )
    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`
}

export const DemptyIcon = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const classActive = () => cn("mb-4 text-muted-foreground", className())
    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`
}

export const DemptyTitle = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const classActive = () => cn("text-lg font-semibold text-foreground", className())
    const Element = asChild() ? 'as-child' : 'h3';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`
}

export const DemptyDescription = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const classActive = () => cn("mb-6 mt-1 text-sm text-muted-foreground max-w-xs mx-auto", className())
    const Element = asChild() ? 'as-child' : 'p';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`
}

useValidateComponent(Dempty, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DemptyIcon, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DemptyTitle, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DemptyDescription, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})