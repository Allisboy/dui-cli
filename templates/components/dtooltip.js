import { html, setContext, useContext, useInsert, useValidateComponent, $state } from "pawajs"
import { cn } from "./utils"

const tooltipContext = setContext()

export const Dtooltip = ({ children, asChild }) => {
    const isVisible = $state(false)
    
    tooltipContext.setValue({ isVisible })

    const Element = asChild() ? 'as-child' : 'div';

    return html`
        <${Element} class="relative inline-block">
            ${children}
        </${Element}>
    `
}

export const DtooltipTrigger = ({ children, asChild }) => {
    const { isVisible } = useContext(tooltipContext)

    const Element = asChild() ? 'as-child' : 'div';



    const show = () => isVisible.value = true
    const hide = () => isVisible.value = false

    useInsert({ show, hide })

    return html`
        <${Element} 
            class="inline-block" 
            on-mouseenter="show()" 
            on-mouseleave="hide()"
            on-focus="show()" 
            on-blur="hide()"
        >
            ${children}
        </${Element}>
    `
}

export const DtooltipContent = ({ children, className, asChild }) => {
    const { isVisible } = useContext(tooltipContext)

    const classActive = () => cn(
        "absolute z-50 overflow-hidden rounded-md bg-black px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95",
        "bottom-full left-1/2 -translate-x-1/2 mb-2", // Positions tooltip above the trigger
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ isVisible:()=>isVisible.value, classActive })

    return html`
        <${Element} 
          class="@{classActive()}"
            if="isVisible()" 
            role="tooltip" 
            --
        >
            ${children}
        </${Element}>
    `
}

useValidateComponent(Dtooltip, { asChild: { type: Boolean, default: false } })
useValidateComponent(DtooltipTrigger, { asChild: { type: Boolean, default: false } })
useValidateComponent(DtooltipContent, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})