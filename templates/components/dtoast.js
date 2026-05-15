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
    console.log(title);
    
    toastState.value = [...toastState.value, newToast]

    if (duration > 0) {
        setTimeout(() => {
            toastState.value = toastState.value.filter(t => t.id !== id)
        }, duration)
    }
    return id
}

export const DtoastViewport = ({ position = 'bottom' }) => {
    const isTop = () => position() === 'top'
    const classContainer = () => cn(
        "fixed z-[100] flex max-h-screen w-full p-4 md:max-w-[420px] sm:right-0",
        isTop() ? "top-0 flex-col" : "bottom-0 flex-col-reverse"
    )
    
    useInsert({ toasts: () => toastState.value, classContainer })
    return html`
        <div class="@{classContainer()}">
            <div for-each="t in toasts()" for-key="{{t.id}}">
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
        default: "bg-background text-foreground border-border",
        destructive: "border-destructive bg-destructive text-destructive-foreground",
        success: "border-green-600 bg-green-600 text-white",
        warning: "border-amber-500 bg-amber-500 text-white",
        info: "border-blue-600 bg-blue-600 text-white",
    }

    const icons = {
        success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11"/></svg>`,
        destructive: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
        warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`
    }

    const classActive = () => cn(
        "group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-md border border-border p-4 shadow-lg transition-all animate-in fade-in slide-in-from-right-full mb-2",
        variants[variant()] || variants.default,
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ classActive })

    return html`
        <${Element} class="@{classActive()}">
            ${icons[variant()]?`<div  class="shrink-0 opacity-90">${icons[variant()]}</div>`:''}
            <div class="flex-1">${children}</div>
        </${Element}>
    `
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

useValidateComponent(DtoastViewport, {
    position: { default: 'bottom', type: String }
})
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
