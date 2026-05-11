import { html, setContext, useContext, useInsert, useValidateComponent, $state } from "pawajs"
import { cn } from "./utils"

const menuContext=setContext()
const subMenuContext = setContext()

export const Dmenu = ({ children, inline, className, asChild }) => {
    const places={
        inline: 'flex-row items-center space-x-1',
        block: 'flex-col space-y-1'
    }
    
    const classActive = () => cn(
        "relative p-1.5 w-full flex",
        inline() ? places.inline : places.block,
        className()
    )

    useInsert({ classActive })

    return html `
        <div class="@{classActive()}">
            ${children}
        </div>
    `
}

export const DmenuItem = ({ children, className, active }) => {
    const classActive = () => cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        active() ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        className()
    )

    useInsert({ classActive })

    return html`<div class="@{classActive()}">${children}</div>`
}

export const DmenuLabel = ({ children, className }) => {
    const classActive = () => cn("px-3 py-2 text-sm font-semibold text-muted-foreground", className())
    useInsert({ classActive })
    return html`<div class="@{classActive()}">${children}</div>`
}

export const DmenuSub = ({ children }) => {
    const isOpen = $state(false)
    const show = () => isOpen.value = true
    const hide = () => isOpen.value = false

    subMenuContext.setValue({ isOpen, show, hide })

    return html`
        <div class="relative" on-mouseleave="hide()">
            ${children}
        </div>
    `
}

export const DmenuSubTrigger = ({ children, className }) => {
    const { show } = useContext(subMenuContext)
    const classActive = () => cn(
        "relative flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-muted-foreground",
        className()
    )
    useInsert({ classActive, show })
    return html`
        <div class="@{classActive()}" on-mouseenter="show()">
            ${children}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-auto h-4 w-4 opacity-60"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
    `
}

export const DmenuSubContent = ({ children, className }) => {
    const { isOpen } = useContext(subMenuContext)
    const classActive = () => cn(
        "absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-background text-foreground shadow-md animate-in fade-in-0 zoom-in-95 ml-1",
        className()
    )
    useInsert({ classActive, isOpen: () => isOpen.value })
    return html`
        <div if="isOpen()" class="@{classActive()}">
            ${children}
        </div>
    `
}

export const DmenuSeparator = ({ className }) => {
    const classActive = () => cn("-mx-1 my-1 h-px bg-border", className())
    useInsert({ classActive })
    return html`<div class="@{classActive()}"></div>`
}

export const DmenuShortcut = ({ children, className }) => {
    const classActive = () => cn("ml-auto text-xs tracking-widest text-muted-foreground", className())
    useInsert({ classActive })
    return html`<span class="@{classActive()}">${children}</span>`
}

useValidateComponent(Dmenu, {
    inline: { type: Boolean, default: false },
    className: { type: String, default: '' }
})
useValidateComponent(DmenuItem, {
    className: { default: '', type: String },
    active: { type: Boolean, default: false }
})
useValidateComponent(DmenuLabel, {
    className: { default: '', type: String }
})
useValidateComponent(DmenuSeparator, {
    className: { default: '', type: String }
})
useValidateComponent(DmenuShortcut, {
    className: { default: '', type: String }
})
useValidateComponent(DmenuSub, {})
useValidateComponent(DmenuSubTrigger, {
    className: { default: '', type: String }
})
useValidateComponent(DmenuSubContent, {
    className: { default: '', type: String }
})
