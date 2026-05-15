import { html, setContext, useContext, useInsert, useValidateComponent, $state, forwardProps } from "pawajs"
import { cn } from "./utils"

const popoverContext = setContext()

export const Dpopover = ({ children, asChild, ...props }) => {
    forwardProps(props)
    const isOpen = $state(false)
    const close = () => isOpen.value = false

    popoverContext.setValue({ isOpen, close })

    const Element = asChild() ? 'as-child' : 'div';
    const classActive = () => cn("relative inline-block", isOpen.value ? "z-50" : "")
    useInsert({ classActive })

    return html`
        <${Element} class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `
}

export const DpopoverTrigger = ({ children, asChild, ...props }) => {
    forwardProps(props)
    const { isOpen } = useContext(popoverContext)

    const Element = asChild() ? 'as-child' : 'div';



    const toggle = (e) => {
        // Prevent propagation to avoid immediate closing if outside-click logic is added later
        if (e) e.stopPropagation()
        isOpen.value = !isOpen.value
    }

    useInsert({ toggle })

    return html`
        <${Element} class="inline-block" on-click="toggle()" -- >
            ${children}
        </${Element}>
    `
}

export const DpopoverOverlay = ({ className, asChild, ...props }) => {
    forwardProps(props)
    const { isOpen, close } = useContext(popoverContext)
    const classActive = () => cn("fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in-0", className())
    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ isOpen: () => isOpen.value, classActive, close })

    return html `<${Element} if="isOpen()" class="@{classActive()}" on-click.self="close()" -- >
    </${Element}>`
}

export const DpopoverContent = ({ children, className, side, asChild, ...props }) => {
    forwardProps(props)
    const { isOpen, close } = useContext(popoverContext)

    const sides = () => ({
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2"
    })

    const classes = () => cn(
        "absolute z-50 w-72 rounded-md border border-border bg-background p-4 text-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95",
        sides()[side()] || sides().bottom,
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ isOpen: () => isOpen.value, classes, close })

    return html`
        <${Element} 
            if="isOpen()" 
            class="@{classes()}"
            out-click.self="close()"
            --
        >
            ${children}
        </${Element}>
    `
}

useValidateComponent(Dpopover, { asChild: { type: Boolean, default: false } })
useValidateComponent(DpopoverTrigger, { asChild: { type: Boolean, default: false } })
useValidateComponent(DpopoverOverlay, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DpopoverContent, {
    className: { default: '', type: String },
    side: { 
        default: 'bottom', 
        type: String 
    },
    asChild: { type: Boolean, default: false }
})