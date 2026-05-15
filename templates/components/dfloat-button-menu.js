import { html, setContext, useContext, useInsert, useValidateComponent, $state, forwardProps } from "pawajs"
import { cn } from "./utils"
import { DfloatButton } from "./dfloatbutton"

const floatButtonMenuContext = setContext()

export const DfloatButtonMenu = ({ children, className, position, direction, spacing, mainIcon, asChild,strategy, ...props }) => {
    forwardProps(props)
    const isOpen = $state(false)

    const toggleMenu = () => {
        isOpen.value = !isOpen.value
    }

    floatButtonMenuContext.setValue({ isOpen, direction, spacing })

    const positions = {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
    }

    const classActive = () => cn(
        "z-50",strategy(),
        positions[position()] || positions["bottom-right"],
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ classActive, toggleMenu, isOpen, mainIcon,strategy })

    return html`
        <${Element} class="@{classActive()}"  >
            <div if="isOpen.value">${children}</div>
            <d-float-button on-click="toggleMenu()" class="z-10" strategy="strategy" >
                ${mainIcon() || html`
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300 @{isOpen.value ? 'rotate-45' : ''}">
                        <path d="M5 12h14"/><path d="M12 5v14"/>
                    </svg>
                `}
            </d-float-button>
        </${Element}>
    `
}

export const DfloatButtonMenuItem = ({ children, className, asChild,index, ...props }) => {
    forwardProps(props)
    const { isOpen, direction, spacing } = useContext(floatButtonMenuContext)

    const getTransform = (indexs) => {
        const s = spacing() || 16; // Default spacing in px
        const offset = (indexs + 1) * s;
        switch (direction()) {
            case 'up': return `translateY(-${offset}px)`;
            case 'down': return `translateY(${offset}px)`;
            case 'left': return `translateX(-${offset}px)`;
            case 'right': return `translateX(${offset}px)`;
            default: return `translateY(-${offset}px)`; // Default to 'up'
        }
    }

    const classActive = () => cn(
        "absolute transition-all duration-300 ease-in-out",
        isOpen.value ? "opacity-100 visible" : "opacity-0 invisible",
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ classActive, getTransform, isOpen,index:index() })

    return html`
        <${Element} class="@{classActive()}" style="transform: @{getTransform(index)};" -- >
            ${children}
        </${Element}>
    `
}

useValidateComponent(DfloatButtonMenu, {
    className: { default: '', type: String },
    position: { default: 'bottom-right', type: String },
    strategy: { default: 'fixed', type: String },
    direction: { default: 'up', type: String }, // 'up', 'down', 'left', 'right'
    spacing: { default: 16, type: Number }, // Spacing between items in px
    mainIcon: { type:String ,default:''}, // Custom icon for the main button
    asChild: { type: Boolean, default: false }
})

useValidateComponent(DfloatButtonMenuItem, {
    className: { default: '', type: String },
    index: { default: 0, type: Number },
    asChild: { type: Boolean, default: false }
})