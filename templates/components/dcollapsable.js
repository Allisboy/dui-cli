import { $state, html, setContext, useContext, useInsert, useValidateComponent } from "pawajs"
import { cn } from "./utils"

const collapseContext=setContext()
export const Dcollapsable=({className,children})=>{
    const { asChild } = props;
    const isOpen = $state(false)
    collapseContext.setValue({ isOpen })
    const createStyle=()=>cn('w-full ',className())

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({createStyle})
    return html `
    <${Element} class="@{createStyle()}">
        ${children}
    </${Element}>
    `
}

export const DcollapseTrigger=({className,children,asChild})=>{
    const { isOpen } = useContext(collapseContext)
    const toggle = () => isOpen.value = !isOpen.value
    const createStyle = () => cn('w-full flex flex-row items-center justify-between cursor-pointer', className())
    
    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ toggle, createStyle, open: () => isOpen.value })
    
    return html `
    <div class="@{createStyle()}" on-click="toggle()" aria-expanded="@{open()}">
        ${children}
    </div>
    `
}

export const DcollapsableContent = ({ className, children, asChild }) => {
    const { isOpen } = useContext(collapseContext)
    const createStyle = () => cn('overflow-hidden text-sm transition-all', className())
    
    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ createStyle, open: () => isOpen.value })
    
    return html `
    <${Element} if="open()" class="@{createStyle()}" -- >
        ${children}
    </${Element}>
    `
}

useValidateComponent(Dcollapsable, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DcollapseTrigger, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DcollapsableContent, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})