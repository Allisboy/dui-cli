import { html, setContext, useContext, useInsert, useValidateComponent, $state, runEffect, forwardProps } from "pawajs"
import { cn } from "./utils"

const menuContext=setContext()
const subMenuContext = setContext()

export const Dmenu = ({ children, inline, orientation, className, asChild, ...props }) => {
    forwardProps(props)
    const activeIndex = $state(-1)
    const items = $state([])

    menuContext.setValue({ activeIndex, items, inline, orientation })

    const places={
        inline: 'flex-row items-center space-x-1',
        block: 'flex-col space-y-1'
    }
    
    const onBlur = () => {
        activeIndex.value = -1
    }

    const onKeyDown = (e) => {
        const isInline = inline()
        const prevKey = isInline ? 'ArrowLeft' : 'ArrowUp'
        const nextKey = isInline ? 'ArrowRight' : 'ArrowDown'

        if (e.key === nextKey) {
            e.preventDefault()
            activeIndex.value = (activeIndex.value + 1) % items.value.length
        } else if (e.key === prevKey) {
            e.preventDefault()
            activeIndex.value = (activeIndex.value - 1 + items.value.length) % items.value.length
        } else if (e.key === 'ArrowRight' && !isInline) {
            const item = items.value[activeIndex.value]
            if (item && item.isSub) {
                e.preventDefault()
                item.action(e)
            }
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (activeIndex.value >= 0) {
                const item = items.value[activeIndex.value]
                if (item && item.action) item.action(e)
            }
        }
    }

    const classActive = () => cn(
        "relative p-1.5 w-full flex outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
        inline() ? places.inline : places.block,
        className()
    )

    const Element = asChild() ? 'as-child' : 'div'

    useInsert({ classActive, onKeyDown, onBlur })

    return html `
        <${Element} class="@{classActive()}" on-keydown="onKeyDown(e)" on-blur="onBlur()" tabindex="0" -- >
            ${children}
        </${Element}>
    `
}

export const DmenuItem = ({ children, className, active, onClick, asChild, ...props }) => {
    forwardProps(props)
    const { items, activeIndex } = useContext(menuContext)
    const id = Math.random().toString(36).substring(2, 9)

    const handleClick = (e) => {
        if (onClick && onClick()) onClick()(e)
    }

    const itemRef = { id, action: handleClick }

    runEffect(() => {
        items.value = [...items.value, itemRef]
        return () => items.value = items.value.filter(i => i.id !== id)
    })

    const isKeyboardActive = () => items.value[activeIndex.value]?.id === id

    const classActive = () => cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        isKeyboardActive() ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : "",
        (active() || isKeyboardActive()) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        className()
    )

    const Element = asChild() ? 'as-child' : 'div'

    useInsert({ classActive, handleClick })

    return html`<${Element} class="@{classActive()}" on-click="handleClick(e)" -- >${children}</${Element}>`
}

export const DmenuLabel = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const classActive = () => cn("px-3 py-2 text-sm font-semibold text-muted-foreground", className())
    const Element = asChild() ? 'as-child' : 'div'
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`
}

export const DmenuSub = ({ children }) => {
    const { orientation } = useContext(menuContext)
    const isOpen = $state(false)
    const show = () => isOpen.value = !isOpen.value
    const hide = () => isOpen.value = false

    const isVertical = () => orientation?.() === 'vertical'

    subMenuContext.setValue({ isOpen, show, hide })
    useInsert({ hide, isVertical })
    return html`
        <div class="relative" on-mouseleave.debounce="!isVertical() && hide()" -- >
            ${children}
        </div>
    `
}

export const DmenuSubTrigger = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const { orientation: menuOrientation } = useContext(menuContext)
    const { items, activeIndex } = useContext(menuContext)
    const { show, isOpen } = useContext(subMenuContext)
    const id = Math.random().toString(36).substring(2, 9)

    const itemRef = { 
        id, 
        action: () => show(), 
        isSub: true 
    }

    runEffect(() => {
        items.value = [...items.value, itemRef]
        return () => items.value = items.value.filter(i => i.id !== id)
    })

    const isKeyboardActive = () => items.value[activeIndex.value]?.id === id
    const isVertical = () => menuOrientation?.() === 'vertical'

    const classActive = () => cn(
        "relative flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-muted-foreground",
        isKeyboardActive() ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : "",
        (isKeyboardActive() || isOpen.value) ? "bg-accent text-accent-foreground" : "",
        className()
    )
    
    const Element = asChild() ? 'as-child' : 'div'
    useInsert({ classActive, show, isVertical, isOpen })
    return html`
        <${Element} class="@{classActive()}" on-mouseenter="!isVertical() && isOpen.value=true" on-click="show()" -- >
            ${children}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-auto h-4 w-4 opacity-60 transition-transform duration-200 @{isVertical() && isOpen.value ? 'rotate-90' : ''}">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </${Element}>
    `
}

export const DmenuSubContent = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const { orientation } = useContext(menuContext)
    const { isOpen, hide } = useContext(subMenuContext)

    const onKeyDown = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            hide()
        }
    }

    const isVertical = () => orientation?.() === 'vertical'

    const classActive = () => cn(
        isVertical() ? "relative w-full mt-1 p-3 overflow-hidden space-y-1" : "absolute left-full top-0 z-50 min-w-[8rem] rounded-md border border-border bg-background text-foreground shadow-md ml-1",
        "overflow-hidden animate-in fade-in-0 zoom-in-95",
        className()
    )

    const Element = asChild() ? 'as-child' : 'div'

    useInsert({ classActive, isOpen: () => isOpen.value, onKeyDown })
    return html`
        <${Element} if="isOpen()" class="@{classActive()}" on-keydown="onKeyDown(e)" tabindex="-1" -- >
            ${children}
        </${Element}>
    `
}

export const DmenuSeparator = ({ className, asChild, ...props }) => {
    forwardProps(props)
    const classActive = () => cn("-mx-1 my-1 h-px bg-border", className())
    const Element = asChild() ? 'as-child' : 'div'
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}" -- ></${Element}>`
}

export const DmenuShortcut = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const classActive = () => cn("ml-auto text-xs tracking-widest text-muted-foreground", className())
    const Element = asChild() ? 'as-child' : 'span'
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`
}

useValidateComponent(Dmenu, {
    inline: { type: Boolean, default: false },
    orientation: { type: String, default: 'flyout' }, // 'flyout' | 'vertical'
    className: { type: String, default: '' },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DmenuItem, {
    className: { default: '', type: String },
    active: { type: Boolean, default: false },
    onClick: { type: Function, default: () => {} },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DmenuLabel, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DmenuSeparator, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DmenuShortcut, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DmenuSub, {})
useValidateComponent(DmenuSubTrigger, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DmenuSubContent, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
