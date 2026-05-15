import { html, setContext, useContext, useInsert, useValidateComponent, $state, forwardProps } from "pawajs"
import { cn } from "./utils"

const hoverCardContext = setContext()

export const DhoverCard = ({ children, asChild, ...props }) => {
    forwardProps(props)
    const isOpen = $state(false)
    let openTimeout = null
    let closeTimeout = null

    const open = () => {
        if (closeTimeout) clearTimeout(closeTimeout)
        if (isOpen.value) return
        openTimeout = setTimeout(() => {
            isOpen.value = true
        }, 400) // Standard delay to avoid accidental triggers
    }

    const close = () => {
        if (openTimeout) clearTimeout(openTimeout)
        closeTimeout = setTimeout(() => {
            isOpen.value = false
        }, 300) // Grace period to move mouse from trigger to content
    }

    hoverCardContext.setValue({ isOpen, open, close })

    const Element = asChild() ? 'as-child' : 'div';

    return html`
        <${Element} class="relative inline-block" -- >
            ${children}
        </${Element}>
    `
}

export const DhoverCardTrigger = ({ children, asChild, ...props }) => {
    forwardProps(props)
    const { open, close } = useContext(hoverCardContext)

    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ open, close })

    return html`
        <${Element} 
            class="inline-block cursor-pointer" 
            on-mouseenter="open()" 
            on-mouseleave="close()"
            -- 
        >
            ${children}
        </${Element}>
    `
}

export const DhoverCardContent = ({ children, className, side, asChild, ...props }) => {
    forwardProps(props)
    const { isOpen, open, close } = useContext(hoverCardContext)

    const sides = () => ({
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2"
    })

    const classes = () => cn(
        "absolute z-50 w-64 rounded-md border border-border bg-background p-4 text-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95",
        sides()[side()] || sides().bottom,
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ isOpen: () => isOpen.value, classes, open, close })

    return html`
        <${Element} 
            if="isOpen()" 
            class="@{classes()}"
            on-mouseenter="open()"
            on-mouseleave="close()"
            --
        >
            ${children}
        </${Element}>
    `
}

useValidateComponent(DhoverCard, { asChild: { type: Boolean, default: false } })
useValidateComponent(DhoverCardTrigger, { asChild: { type: Boolean, default: false } })
useValidateComponent(DhoverCardContent, {
    className: { default: '', type: String },
    side: { default: 'bottom', type: String },
    asChild: { type: Boolean, default: false }
})