import { html, setContext, useContext, useInsert, useValidateComponent, $state } from "pawajs"
import { cn } from "./utils"

const dropdownContext = setContext()

export const Ddropdown = ({ children, asChild }) => {
    const isOpen = $state(false)
    const close = () => isOpen.value = false
    const toggle = () => isOpen.value = !isOpen.value

    dropdownContext.setValue({ isOpen, close, toggle })

    const Element = asChild() ? 'as-child' : 'div';

    return html `
        <${Element} class="relative inline-block text-left">
            ${children}
        </${Element}>
    `
}

export const DdropdownTrigger = ({ children, asChild }) => {
    const { toggle } = useContext(dropdownContext)

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ toggle })
    return html `
        <${Element} class="inline-flex w-full justify-center" on-click="toggle()">
            ${children}
        </${Element}>
    `
}

export const DdropdownContent = ({ children, className, align, asChild }) => {
    const { isOpen } = useContext(dropdownContext)

    const alignments = () => ({
        left: "left-0",
        right: "right-0",
        center: "left-1/2 -translate-x-1/2"
    })

    const classActive = () => cn(
        "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-border bg-background p-1 text-foreground shadow-md animate-in fade-in-0 zoom-in-95 text-accent-foreground",
        alignments()[align()] || alignments().left,
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ isOpen: () => isOpen.value, classActive,close:()=>isOpen.value=!isOpen.value })

    return html `
        <${Element} class="@{classActive()}" if="isOpen()" out-click.self="close()">
            ${children}
        </${Element}>
    `
}

export const DdropdownItem = ({ children, className, onClick, asChild }) => {
    const { close } = useContext(dropdownContext)

    const Element = asChild() ? 'as-child' : 'div';



    const handleClick = (e) => {
        if (onClick()) onClick()(e)
        close()
    }

    const classActive = () => cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 text-accent-foreground",
        className()
    )

    useInsert({ classActive, handleClick })

    return html `
        <${Element} class="@{classActive()}" on-click="handleClick()" -- >
            ${children}
        </${Element}>
    `
}

export const DdropdownLabel = ({ children, className, asChild }) => {
    const classActive = () => cn("px-2 py-1.5 text-sm font-semibold text-accent-foreground", className())
    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ classActive })
    return html `<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DdropdownSeparator = ({ className, asChild }) => {
    const classActive = () => cn("-mx-1 my-1 h-px bg-border", className())
    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}"></${Element}>`
}

useValidateComponent(Ddropdown, { asChild: { type: Boolean, default: false } })
useValidateComponent(DdropdownTrigger, { asChild: { type: Boolean, default: false } })
useValidateComponent(DdropdownContent, {
    className: { default: '', type: String },
    align: { default: 'left', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DdropdownItem, {
    className: { default: '', type: String },
    onClick: { default: () => {}, type: Function },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DdropdownLabel, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DdropdownSeparator, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})