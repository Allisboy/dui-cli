import { forwardProps, html, useInsert, useValidateComponent, setContext, useContext, $state } from "pawajs"
import { cn } from "./utils"

const drawerContext = setContext()

export const Ddrawer = ({ children, asChild,defaultOpen,...props }) => {
    const isOpen = $state(()=>defaultOpen(),[defaultOpen])
    const close = () => isOpen.value = false
    const toggle = () => isOpen.value = !isOpen.value

    drawerContext.setValue({ isOpen, close, toggle })

    const Element = asChild?.() ? 'as-child' : 'div';

    return html`<${Element}>${children}</${Element}>`
}

export const DdrawerTrigger = ({ children, className,asChild,onClick,...props}) => {
    forwardProps(props)
    const element=asChild?.()?'as-child':'div'
    const { toggle } = useContext(drawerContext)
    
    useInsert({ toggle:(e)=>{
        if (onClick) {
            onClick?.(e)
        }
        toggle()
    }, className: className() })
    return html `
        <${element} class="inline-flex cursor-pointer @{className}" on-click="toggle()" -- >
            ${children}
        </${element}>
    `
}

export const DdrawerClose = ({ children, className, asChild, onClick, close: closeProp, ...props }) => {
    forwardProps(props)
    const element = asChild?.() ? 'as-child' : 'div'
    const { close: internalClose } = useContext(drawerContext)

    useInsert({
        close: (e) => {
            if (onClick()) onClick()(e)
            
            const customClose = closeProp?.()
            if (typeof customClose === 'function') {
                customClose(e, internalClose)
            } else {
                internalClose(e)
            }
        },
        className: className()
    })
    return html`
        <${element} class="inline-flex cursor-pointer @{className}" on-click="close()" -- >
            ${children}
        </${element}>
    `
}

export const DdrawerContent = ({ children, className, side, asChild, ...props }) => {
    forwardProps(props)
    const { isOpen, close } = useContext(drawerContext)

    const sides = () => ({
        top: "inset-x-0 top-0 border-b animate-in slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t animate-in slide-in-from-bottom",
        left: "inset-y-0 left-0 h-screen w-3/4 border-r animate-in slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-screen w-3/4 border-l animate-in slide-in-from-right sm:max-w-sm"
    })

    const classActive = () => cn(
        "fixed z-1000 gap-4 bg-background p-6 shadow-lg transition ease-in-out duration-300 border-border",
        sides()[side()] || sides().right,isOpen.value?'opacity-100':'opacity-0',
        className()
    )

    useInsert({ 
        isOpen: () => isOpen.value, 
        classActive, 
        close 
    })

    const Element = asChild?.() ? 'as-child' : 'div';

    return html`
        <div class="@{isOpen() ?'opacity-100':'opacity-0'}">
        <div if="isOpen()" class="fixed inset-0 z-1000 bg-black/80 backdrop-blur-sm animate-in fade-in" on-click.self.prevent="close()">
            <${Element} class="@{classActive()}" -- >
                <button 
                    on-click="close()"
                    class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    <span class="sr-only">Close</span>
                </button>
                ${children}
            </div>
        </div>
        </div>
    `
}

export const DdrawerHeader = ({ children, className }) => {
    const classActive = () => cn("flex flex-col space-y-2 text-center sm:text-left", className())
    useInsert({ classActive })
    return html`<div class="@{classActive()}">${children}</div>`
}

export const DdrawerFooter = ({ children, className }) => {
    const classActive = () => cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className())
    useInsert({ classActive })
    return html`<div class="@{classActive()}">${children}</div>`
}

export const DdrawerTitle = ({ children, className,asChild }) => {
    const element=asChild?.()?'as-child':'h2'
    const classActive = () => cn("text-lg font-semibold text-foreground", className())
    useInsert({ classActive })
    return html`<${element} class="@{classActive()}" -- >${children}</${element}>`
}

export const DdrawerDescription = ({ children, className,asChild }) => {
    const element=asChild?.()?'as-child':'p'
    const classActive = () => cn("text-sm text-muted-foreground", className())
    useInsert({ classActive })
    return html`<${element} class="@{classActive()}" -- >${children}</${element}>`
}

useValidateComponent(Ddrawer, {
    asChild:{default:false,type:Function},
    defaultOpen:{default:false,type:Boolean}
})
useValidateComponent(DdrawerTrigger, {
    className: { default: '', type: String },
    onClick:{default:()=>{},type:Function},
    asChild:{default:false,type:Boolean}
})
useValidateComponent(DdrawerClose, {
    className: { default: '', type: String },
    onClick: { default: () => { }, type: Function },
    asChild: { default: false, type: Boolean },
    close: { type: Function }
})
useValidateComponent(DdrawerContent, {
    className: { default: '', type: String },
    side: { default: 'right', type: String }
})
useValidateComponent(DdrawerHeader, {
    className: { default: '', type: String }
})
useValidateComponent(DdrawerFooter, {
    className: { default: '', type: String }
})
useValidateComponent(DdrawerTitle, {
    className: { default: '', type: String },
    asChild:{default:false,type:Boolean}
})
useValidateComponent(DdrawerDescription, {
    className: { default: '', type: String },
    asChild: { default: false, type: Boolean }
})