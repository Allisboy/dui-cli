import { html, setContext, useContext, useInsert, useValidateComponent } from "pawajs"
import { cn } from "./utils"

const tabContext = setContext()

export const Dtab = ({ className, variant, onTab, active, children, asChild, orientation }) => {
    // Pass the function reference, not the result of the call
    tabContext.setValue({ active, onTab, variant, orientation })
    
    const isVertical = () => orientation() === 'vertical'
    const classActive = () => cn(
        isVertical() ? "flex flex-row gap-4" : "w-full", 
        className()
    )
    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ classActive })
    
    return html`
        <${Element} class="@{classActive()}" -- >${children}</${Element}>
    `
}

export const DtabHeader = ({ children, className, asChild }) => {
    const { variant, orientation } = useContext(tabContext)

    const Element = asChild() ? 'as-child' : 'div';
    const isVertical = () => orientation() === 'vertical'

    const variants = () => ({
        primary: cn('inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', isVertical() ? 'flex-col h-auto w-fit' : 'h-10 flex-row'),
        outline: cn('flex items-center', isVertical() ? 'flex-col border-r border-border h-full' : 'flex-row w-full border-b border-border'),
        pills: cn('inline-flex items-center justify-center rounded-full bg-muted p-1 text-muted-foreground', isVertical() ? 'flex-col h-auto w-fit' : 'h-10 flex-row'),
        ghost: cn('inline-flex items-center justify-center rounded-md p-1 text-muted-foreground', isVertical() ? 'flex-col w-fit' : 'flex-row')
    })
    
    const classActive = () => {
        const v = variants()[variant()] || variants().primary
        return cn(
            v, 
            "flex-nowrap whitespace-nowrap overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            className()
        )
    }
    
    useInsert({ classActive })
    return html`<${Element} role="tablist" class="@{classActive()}" -- >${children}</${Element}>`
}

export const DtabItem = ({ className, key, children, asChild }) => {
    const { active, onTab, variant, orientation } = useContext(tabContext)
    const isVertical = () => orientation() === 'vertical'
    
    const variants = () => ({
        primary: `inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isVertical() ? 'w-full justify-start' : ''} ${key() === active() ? 'bg-background text-foreground shadow-sm' : 'hover:text-foreground'}`,
        outline: `inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isVertical() ? 'border-r-2 -mr-px w-full justify-start' : 'border-b-2 -mb-px'} ${key() === active() ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`,
        pills: `inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isVertical() ? 'w-full justify-start' : ''} ${key() === active() ? 'bg-background text-foreground shadow-sm' : 'hover:text-foreground'}`,
        ghost: `inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isVertical() ? 'w-full justify-start' : ''} ${key() === active() ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50 hover:text-foreground'}`
    })

    const onTabChange = () => {
        if (onTab()) onTab()(key())
    }

    const classActive = () => {
        const c = variants()[variant()] || variants().primary;
        return cn("transition-all duration-100 cursor-pointer flex-nowrap shrink-0", c, className())
    }

    const Element = asChild() ? 'as-child' : 'button';

    useInsert({ classActive, onTabChange, isSelected: () => key() === active() })
    return html`
        <${Element} role="tab" aria-selected="@{isSelected()}" class="@{classActive()}" on-click="onTabChange()" type="button" -- >
            ${children}
        </${Element}>
    `
}
export const DtabContent = ({ className, key, children, asChild }) => {
    const { active } = useContext(tabContext)
    
    // Only render children if the key matches the active state
    const shouldRender = () => key() === active()
    const classActive = () => cn("w-full mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className())
    const Element = asChild() ? 'as-child' : 'div';
    
    useInsert({ shouldRender, classActive })
    
    return html`
        <${Element} if="shouldRender()" role="tabpanel" class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `
}

// --- Validations ---

useValidateComponent(Dtab, {
    className: { default: '', type: String },
    active: { default: '1', type: String },
    onTab: { default: () => {}, type: Function },
    variant: { default: 'primary', type: String },
    asChild: { type: Boolean, default: false },
    orientation: { default: 'horizontal', type: String }
})

useValidateComponent(DtabHeader, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DtabItem, {
    className: { default: '', type: String }, 
    key: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DtabContent, {
    className: { default: '', type: String }, 
    key: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})