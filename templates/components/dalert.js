import { forwardProps, html, useInsert, useValidateComponent } from "pawajs"
import { cn } from "./utils"
 
export const Dalert = ({ children, variant, className, asChild, ...props }) => {
    forwardProps(props)
    
    const variants = {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-success/50 text-success dark:border-success [&>svg]:text-success",
        warning: "border-warning/50 text-warning dark:border-warning [&>svg]:text-warning",
        info: "border-info/50 text-info dark:border-info [&>svg]:text-info",
    }

    const classActive = () => cn(
        "relative w-full rounded-lg border p-4 [&>svg~div]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
        variants[variant()] || variants.default,
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ classActive })

    return html`
        <${Element} class="@{classActive()}" role="alert" -- >
            ${children}
        </${Element}>
    `
}

export const DalertTitle = ({ children, className, asChild }) => {
    const classActive = () => cn("mb-1 font-medium leading-none tracking-tight", className())
    const Element = asChild() ? 'as-child' : 'h5';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DalertDescription = ({ children, className, asChild }) => {
    const classActive = () => cn("text-sm [&_p]:leading-relaxed", className())
    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

useValidateComponent(Dalert, {
    className: { default: '', type: String },
    variant: { default: 'default', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DalertTitle, { 
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DalertDescription, { 
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})