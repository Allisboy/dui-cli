import { html, useContext, useInsert, useValidateComponent } from "pawajs"
import { cn } from "./utils"
import { formItemContext } from "./dform"

export const Dswitch = ({ className, checked, onCheckedChange, disabled, asChild }) => {
    const { id } = useContext(formItemContext) || {}

    const containerClass = () => cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked() ? "bg-black" : "bg-gray-200",
        className()
    )

    const thumbClass = () => cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
        checked() ? "translate-x-4" : "translate-x-0"
    )

    const toggle = () => {
        if (disabled()) return
        // Call the change handler with the toggled value
        if (onCheckedChange()) onCheckedChange()(!checked())
    }

    const Element = asChild() ? 'as-child' : 'button';

    useInsert({ 
        containerClass, 
        thumbClass, 
        toggle, 
        inputId: () => id || '', 
        isChecked: () => !!checked(),
        disabled: () => !!disabled()
    })

    return html`
        <${Element}
            type="button"
            role="switch"
            aria-checked="@{isChecked()}"
            id="@{inputId()}"
            class="@{containerClass()}"
            on-click="toggle()"
            --
        >
            <span class="@{thumbClass()}"></span>
        </${Element}>
    `
}

useValidateComponent(Dswitch, {
    className: { default: '', type: String },
    checked: { default: false, type: Boolean },
    // onCheckedChange expects a function like (val) => state.value = val
    onCheckedChange: { default: () => {}, type: Function },
    disabled: { default: false, type: Boolean }
    ,
    asChild: {
        type: Boolean, default: false
    },
})