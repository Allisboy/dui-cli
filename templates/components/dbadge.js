import { forwardProps, html, useInsert, useValidateComponent } from "pawajs"
import { cn } from "./utils"

export const Dbadge = ({ className, variant, children,...props }) => {
    forwardProps(props) 
    const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    
    const variants = () => ({
        default: "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-80",
        secondary: "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-80",
        destructive: "border-transparent bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-80",
        outline: "text-[var(--foreground)]",
    })

    const classActive = () => {
        const v = variants()[variant()] || variants().default
        return cn(baseStyles, v, className())
    }

    const Element = props.asChild?.() ? 'as-child' : 'div';

    useInsert({ classActive })

    return html`
        <${Element} class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `
}

useValidateComponent(Dbadge, {
    className: {
        default: '',
        type: String,
    },
    variant: {
        default: 'default',
        type: String
    },
    asChild: {
        type: Boolean, default: false
    },
})