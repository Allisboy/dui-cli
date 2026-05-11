import { html, setContext, useContext, useInsert, useValidateComponent, $state, forwardProps } from "pawajs"
import { cn } from "./utils"

const navigationMenuContext = setContext()

export const DnavigationMenu = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const activeValue = $state(null)
    
    navigationMenuContext.setValue({ 
        activeValue, 
        onValueChange: (val) => activeValue.value = val 
    })

    const classActive = () => cn("relative z-10 flex w-full items-center justify-center", className())
    const Element = asChild() ? 'as-child' : 'nav';

    useInsert({ classActive,activeValue })

    return html`
        <${Element} class="@{classActive()}" dir="ltr" on-mouseleave="activeValue.value = null">
            ${children}
        </${Element}>
    `
}

export const DnavigationMenuList = ({ children, className, asChild }) => {
    const classActive = () => cn("group flex flex-row list-none items-center justify-center space-x-1", className())
    const Element = asChild() ? 'as-child' : 'ul';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DnavigationMenuItem = ({ children, className, asChild }) => {
    const Element = asChild() ? 'as-child' : 'li';
    const classActive = () => cn("relative flex-shrink-0", className());
    useInsert({ classActive });
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DnavigationMenuTrigger = ({ children, className, value, asChild }) => {
    const { activeValue, onValueChange } = useContext(navigationMenuContext)
    
    const isSelected = () => activeValue.value === value()

    const classActive = () => cn(
        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        isSelected() ? "bg-accent/50" : "",
        className()
    )

    const Element = asChild() ? 'as-child' : 'button';

    useInsert({ 
        classActive, 
        onEnter: () => onValueChange(value()),
        isSelected
    })

    return html`
        <${Element} 
            class="@{classActive()}" 
            on-mouseenter="onEnter()" 
            aria-expanded="@{isSelected()}"
            type="button"
        >
            ${children}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-hover:rotate-180" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </${Element}>
    `
}

export const DnavigationMenuContent = ({ children, className, value, asChild, align }) => {
    const { activeValue } = useContext(navigationMenuContext)
    const isVisible = () => activeValue.value === value()

    const alignments = () => ({
        center: "left-1/2 -translate-x-1/2",
        start: "left-0",
        end: "right-0"
    })

    const classActive = () => cn(
        "absolute top-full z-50 w-[calc(100vw-5rem)] md:w-max  animate-in fade-in-0 zoom-in-95 mt-2",
        alignments()[align()] || alignments().center,
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ isVisible, classActive })

    return html`
        <${Element} if="isVisible()" class="@{classActive()}">
            ${children}
        </${Element}>
    `
}

export const DnavigationMenuLink = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const classActive = () => cn(
        "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className()
    )
    const Element = asChild() ? 'as-child' : 'a';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`
}

export const DnavigationMenuViewport = ({ className }) => {
    const { activeValue } = useContext(navigationMenuContext)
    const isVisible = () => activeValue.value !== null

    const classActive = () => cn(
        "origin-top-center relative mt-1.5 h-auto w-full overflow-hidden rounded-md border border-border bg-background text-foreground shadow-lg animate-in zoom-in-90 md:w-auto",
        className()
    )

    useInsert({ classActive, isVisible })

    return html`
        <div class="absolute left-0 right-0 top-full flex justify-center">
            <div if="isVisible()" class="@{classActive()}"></div>
        </div>
    `
}

useValidateComponent(DnavigationMenu, {
    className: { type: String, default: '' },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DnavigationMenuList, {
    className: { type: String, default: '' },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DnavigationMenuTrigger, {
    value: { type: String, strict: true },
    className: { type: String, default: '' },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DnavigationMenuContent, {
    value: { type: String, strict: true },
    className: { type: String, default: '' },
    asChild: { type: Boolean, default: false },
    align: { type: String, default: 'center' }
})

useValidateComponent(DnavigationMenuLink, {
    className: { type: String, default: '' },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DnavigationMenuItem, { className: { type: String, default: '' }, asChild: { type: Boolean, default: false }})