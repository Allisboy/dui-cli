import { html, useInsert, useValidateComponent, $state } from "pawajs"
import { cn } from "./utils"

// Global state to manage active toasts
export const toastState = $state([])

/**
 * Helper function to trigger a toast from anywhere
 */
export const toast = ({ title, description, variant = 'default', duration = 3000 }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant }
    
    toastState.value = [...toastState.value, newToast]

    if (duration > 0) {
        setTimeout(() => {
            toastState.value = toastState.value.filter(t => t.id !== id)
        }, duration)
    }
    return id
}

export const DtoastViewport = () => {
    useInsert({ toasts: () => toastState.value })
    return html`
        <div class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
            <div for-each="t in toasts">
                <d-toast :variant="t.variant">
                    <div class="grid gap-1">
                        <d-toast-title if="t.title">@{t.title}</d-toast-title>
                        <d-toast-description if="t.description">@{t.description}</d-toast-description>
                    </div>
                </d-toast>
            </div>
        </div>
    `
}

export const Dtoast = ({ children, variant, className, asChild }) => {
    const variants = {
        default: "bg-white text-gray-950 border-gray-200",
        destructive: "border-red-600 bg-red-600 text-white",
        success: "border-green-600 bg-green-600 text-white",
        warning: "border-amber-500 bg-amber-500 text-white",
        info: "border-blue-600 bg-blue-600 text-white",
    }

    const classActive = () => cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all animate-in fade-in slide-in-from-right-full mb-2",
        variants[variant()] || variants.default,
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ classActive })

    return html`<div class="@{classActive()}">${children}</div>`
}

export const DtoastTitle = ({ children, className, asChild }) => {
    const classActive = () => cn("text-sm font-semibold", className())
    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DtoastDescription = ({ children, className, asChild }) => {
    const classActive = () => cn("text-sm opacity-90", className())
    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

useValidateComponent(DtoastViewport, {})
useValidateComponent(Dtoast, {
    className: { default: '', type: String },
    variant: { default: 'default', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DtoastTitle, { 
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DtoastDescription, { 
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
