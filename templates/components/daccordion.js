import { html, setContext, useContext, useInsert, useValidateComponent, $state, forwardProps } from "pawajs"
import { cn } from "./utils"

const accordionContext = setContext()
const accordionItemContext = setContext()

export const Daccordion = ({ type, defaultValue, className, children, asChild, ...props }) => {
    forwardProps(props)
    // Store state as a string for 'single' or an array for 'multiple'
    const activeValue = $state(defaultValue() || (type() === 'multiple' ? [] : ''))

    const toggle = (val) => {
        if (type() === 'single') {
            activeValue.value = activeValue.value === val ? '' : val
        } else {
            const current = activeValue.value || []
            activeValue.value = current.includes(val)
                ? current.filter(v => v !== val)
                : [...current, val]
        }
    }

    accordionContext.setValue({ activeValue, toggle, type })

    const Element = asChild() ? 'as-child' : 'div';

    const classActive = () => cn("w-full text-accent-foreground", className())
    useInsert({ classActive })

    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`
}

export const DaccordionItem = ({ value, className, children, asChild }) => {
    const { activeValue, type } = useContext(accordionContext)
    
    const isOpen = () => {
        if (type() === 'single') {
            return activeValue.value === value()
        }
        return (activeValue.value || []).includes(value())
    }

    accordionItemContext.setValue({ value, isOpen })

    const Element = asChild() ? 'as-child' : 'div';

    const classActive = () => cn("border-b text-accent-foreground", className())
    useInsert({ classActive })

    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DaccordionTrigger = ({ className, children, asChild }) => {
    const { toggle } = useContext(accordionContext)
    const { value, isOpen } = useContext(accordionItemContext)
    
    const handleToggle = () => toggle(value())
    
    const classActive = () => cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[aria-expanded=true]>svg]:rotate-180 text-accent-foreground",
        className()
    )

    const Element = asChild() ? 'as-child' : 'button';

    useInsert({ classActive, handleToggle, open: () => isOpen() })

    return html`
        <${Element} 
            type="button" 
            class="@{classActive()}" 
            on-click="handleToggle()" 
            aria-expanded="@{open()}"
        >
 ${children}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0 transition-transform duration-200">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </${Element}>
    `
}

export const DaccordionContent = ({ className, children, asChild }) => {
    const { isOpen } = useContext(accordionItemContext)

    const classActive = () => cn(
        "overflow-hidden text-sm text-accent-foreground transition-all animate-in fade-in-0 slide-in-from-top-1",
        className()
    )

    useInsert({ classActive, open: () => isOpen() })

    const Element = asChild() ? 'as-child' : 'div';

    return html`
        <${Element} if="open()" class="@{classActive()}">
            <div class="pb-4 pt-0">${children}</div>
        </${Element}>
    `
}

useValidateComponent(Daccordion, {
    type: { default: 'single', type: String },
    defaultValue: { default: '', type: [String, Array] },
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DaccordionItem, {
    value: { default: '', type: String, strict: true },
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DaccordionTrigger, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DaccordionContent, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})