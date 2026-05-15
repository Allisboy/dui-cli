import { html, setContext, useContext, useInsert, useValidateComponent, $state, runEffect, forwardProps, useRef } from "pawajs"
import { cn } from "./utils"

const dropdownContext = setContext()
const subContext = setContext()

export const Ddropdown = ({ children, asChild }) => {
    const isOpen = $state(false)
    const activeIndex = $state(-1)
    const items = $state([])
    const count=useRef()
    count.value=0
    const close = () => {
        isOpen.value = false
        activeIndex.value = -1
    }
    const toggle = () => isOpen.value = !isOpen.value;
    

    dropdownContext.setValue({ isOpen, close, toggle, activeIndex, items,count })

    const Element = asChild() ? 'as-child' : 'div';

    return html `
        <${Element} class="relative inline-block text-left" -- >
            ${children}
        </${Element}>
    `
}

export const DdropdownTrigger = ({ children, asChild }) => {
    const { toggle, isOpen } = useContext(dropdownContext)

    const Element = asChild() ? 'as-child' : 'div';

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (!isOpen.value) toggle()
        }
    }

    useInsert({ toggle, onKeyDown })
    return html `
        <${Element} class="inline-flex w-full justify-center" on-click="toggle()" on-keydown="onKeyDown(e)" -- >
            ${children}
        </${Element}>
    `
}

export const DdropdownContent = ({ children, className, align, asChild,...props }) => {
    forwardProps(props)
    const { isOpen, close, items, activeIndex } = useContext(dropdownContext)

    const alignments = () => ({
        left: "left-0",
        right: "right-0",
        center: "left-1/2 -translate-x-1/2"
    })

    const classActive = () => cn(
        "absolute z-50 mt-2 min-w-[8rem] rounded-md border border-border bg-background p-1 text-foreground shadow-md animate-in fade-in-0 zoom-in-95 text-accent-foreground",
        alignments()[align()] || alignments().left,
        className()
    )

    const onKeyDown = (e) => {
        if (!isOpen.value) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            activeIndex.value = (activeIndex.value + 1) % items.value.length
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            activeIndex.value = (activeIndex.value - 1 + items.value.length) % items.value.length
        } else if (e.key === 'Escape') {
            e.preventDefault()
            close()
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (activeIndex.value >= 0) {
                const item = items.value[activeIndex.value]
                if (item) item.action(e)
            }
        }
    }

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ isOpen: () => isOpen.value, classActive, close, onKeyDown })

    return html `
        <${Element} class="@{classActive()}" if="isOpen()" out-click.self="close()" on-keydown="onKeyDown(e)" tabindex="-1" -- >
            ${children}
        </${Element}>
    `
}

export const DdropdownItem = ({ children, className, onClick, asChild }) => {
    const { close, items, activeIndex,count } = useContext(dropdownContext)

    const Element = asChild() ? 'as-child' : 'div';

    const handleClick = (e) => {
        if (onClick()) onClick()(e)
        close()
    }
    const id=count.value
    const itemRef = { action: handleClick,id:id}
    count.value++

    runEffect(() => {
        items.value = [...items.value, itemRef]
        return () => items.value = items.value.filter(i => i.id !== itemRef.id)
    })

    const isActive = () => items.value[activeIndex.value]?.id === id

    const classActive = () => cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 text-accent-foreground",
        isActive() ? "bg-accent text-accent-foreground" : "",
        className()
    )

    useInsert({ classActive, handleClick })

    return html `
        <${Element} class="@{classActive()}" on-click="handleClick(e)" -- >
            ${children}
        </${Element}>
    `
}

export const DdropdownMenu = ({ children, className }) => {
    const classActive = () => cn("flex flex-col", className())
    useInsert({ classActive })
    return html`<div class="@{classActive()}">${children}</div>`
}

export const DdropdownSub = ({ children }) => {
    const subOpen = $state(false)
    const open = () => subOpen.value = true;
    
    const close = () => subOpen.value=false 

    subContext.setValue({ subOpen, open, close })

    return html`<div class="relative">${children}</div>`
}

export const DdropdownSubTrigger = ({ children, className, asChild }) => {
    const { items, activeIndex,count } = useContext(dropdownContext)
    const { open, subOpen: isSubOpen } = useContext(subContext)
    const id=count.value
    count.value++
    const Element = asChild() ? 'as-child' : 'div';

    const itemRef = { 
        action: () => open(), 
        open, 
        isSub: true ,
        id:id
    }

    runEffect(() => {
        items.value = [...items.value, itemRef]
        return () => items.value = items.value.filter(i => i.id !== itemRef.id)
    })

    const isActive = () => items.value[activeIndex.value]?.id === itemRef.id

    const classActive = () => cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent text-accent-foreground",
        isActive() ? "bg-accent text-accent-foreground" : "",
        className()
    )

    useInsert({ classActive, open,isSubOpen, state: () => isSubOpen.value ? 'open' : 'closed' })

    return html `
        <${Element} 
            class="@{classActive()}" 
            on-click="isSubOpen.value=true;
            " 
            on-mouseenter="isSubOpen.value=true;
            "
            data-state="@{isSubOpen.value ? 'open' : 'closed'}"
            -- 
        >
            ${children}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-auto h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>
        </${Element}>
    `
}

export const DdropdownSubContent = ({ children, className, asChild }) => {
    const { subOpen:isOpen, close } = useContext(subContext)

    const classActive = () => cn(
        "absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-background p-1 text-foreground shadow-lg animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className()
    )

    const onKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault()
            console.log('left ');
            close()
        }
    }

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ isOpen: () => isOpen.value, classActive, onKeyDown })

    return html`
        <${Element} 
            if="isOpen()" 
            class="@{classActive()}" 
            on-keydown="onKeyDown(e)"
            out-click.self="close()"
            -- 
        >
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
useValidateComponent(DdropdownMenu, { className: { default: '', type: String } })
useValidateComponent(DdropdownSub, {})
useValidateComponent(DdropdownSubTrigger, { className: { default: '', type: String }, asChild: { type: Boolean, default: false } })
useValidateComponent(DdropdownSubContent, { className: { default: '', type: String }, asChild: { type: Boolean, default: false } })
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