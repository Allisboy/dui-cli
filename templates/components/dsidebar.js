import { html, setContext, useContext, useInsert, useValidateComponent, $state, forwardProps, runEffect } from "pawajs"
import { cn } from "./utils"

const sidebarContext = setContext()

export const DsidebarProvider = ({ children, className, defaultOpen, ...props }) => {
    forwardProps(props)
    const open = $state(()=>{
    return defaultOpen()
    },[defaultOpen])
    const isMobile = $state(false)

    const toggleSidebar = () => open.value = !open.value
    const setOpen = (val) => open.value = val

    // Handle responsive state
    runEffect(() => {
        const checkMobile = () => isMobile.value = window.innerWidth < 768
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    })

    sidebarContext.setValue({ open, setOpen, toggleSidebar, isMobile })

    const classActive = () => cn(
        "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-background",
        className()
    )

    useInsert({ classActive })

    return html `
        <div class="@{classActive()}" -- >
            ${children}
        </div>
    `
}

export const Dsidebar = ({ children, className, side, variant, collapsible, asChild, ...props }) => {
    forwardProps(props)
    const { open, isMobile } = useContext(sidebarContext)

    const classActives = () => cn(
        "group peer hidden md:block text-foreground",
        variant() === "inset" ? "bg-background" : "bg-muted/50",
        className()
    )

    // CSS Variables for dynamic width
    const sidebarStyles = () => `
        --sidebar-width: 16rem;
        --sidebar-width-icon: 3rem;
    `

    const innerClass = () => cn(
        "duration-300 relative h-full bg-background border-r border-border transition-[width,ml,mr] ease-in-out overflow-hidden",
        open.value ? "w-[var(--sidebar-width)]" : (collapsible() === 'icon' ? "w-[var(--sidebar-width-icon)]" : "w-[var(--sidebar-width)]"),
        side() === "left" ? "left-0" : "right-0",
        collapsible() === "offcanvas" && !open.value ? (side() === "left" ? "-ml-[var(--sidebar-width)]" : "-mr-[var(--sidebar-width)]") : ""
    )

    const Element = asChild?.() ? 'as-child' : 'aside';
    const otherClass=()=>cn(open.value ? 'w-[var(--sidebar-width)]' :( collapsible() === 'icon' ? 'w-[var(--sidebar-width-icon)]' : 'w-0'))
    useInsert({ classActives, innerClass, sidebarStyles,open,otherClass })

    return html `
        <div class="@{classActives()}" style="@{sidebarStyles()}">
            <div class="duration-300 relative h-full transition-[width] ease-in-out overflow-hidden @{otherClass()}">
            <${Element} class="@{innerClass()}" -- >
                <div class="flex h-full w-full flex-col">
                    ${children}
                </div>
            </${Element}>
            </div>
        </div>
    `
}

export const DsidebarTrigger = ({ className, asChild, ...props }) => {
    forwardProps(props)
    const { toggleSidebar } = useContext(sidebarContext)
    const classActives = () => cn("h-7 w-7", className())
    const Element = asChild?.() ? 'as-child' : 'd-button';

    useInsert({ classActives, toggleSidebar })

    return html `
        <${Element} variant="ghost" size="icon" class="@{classActives()}" on-click="toggleSidebar()" -- >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>
            <span class="sr-only">Toggle Sidebar</span>
        </${Element}>
    `
}

export const DsidebarHeader = ({ children, className, ...props }) => {
    forwardProps(props)
    const classActive = () => cn("flex flex-col gap-2 p-2", className())
    useInsert({ classActive })
    return html`<div class="@{classActive()}" -- >${children}</div>`
}

export const DsidebarFooter = ({ children, className, ...props }) => {
    forwardProps(props)
    const classActive = () => cn("flex flex-col gap-2 p-2", className())
    useInsert({ classActive })
    return html`<div class="@{classActive()}" -- >${children}</div>`
}

export const DsidebarContent = ({ children, className, ...props }) => {
    forwardProps(props)
    const classActive = () => cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto", className())
    useInsert({ classActive })
    return html`<div class="@{classActive()}" -- >${children}</div>`
}

export const DsidebarGroup = ({ children, className, ...props }) => {
    forwardProps(props)
    const classActive = () => cn("relative flex w-full min-w-0 flex-col p-2", className())
    useInsert({ classActive })
    return html`<div class="@{classActive()}" -- >${children}</div>`
}

export const DsidebarGroupLabel = ({ children, className, ...props }) => {
    forwardProps(props)
    const { open } = useContext(sidebarContext)
    const classActive = () => cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted-foreground outline-none transition-[margin,opacity] ease-linear",
        !open.value ? "-ml-8 opacity-0" : "",
        className()
    )
    useInsert({ classActive })
    return html`<div class="@{classActive()}" -- >${children}</div>`
}

export const DsidebarMenu = ({ children, className, ...props }) => {
    forwardProps(props)
    const classActive = () => cn("flex w-full min-w-0 flex-col gap-1", className())
    useInsert({ classActive })
    return html`<ul class="@{classActive()}" -- >${children}</ul>`
}

export const DsidebarMenuItem = ({ children,active, className, ...props }) => {
    forwardProps(props)
    const classActive = () => cn("group/menu-item relative",active() ? "bg-accent text-accent-foreground" : "text-foreground", className())
    useInsert({ classActive })
    return html`<li class="@{classActive()}" -- >${children}</li>`
}

export const DsidebarMenuButton = ({ children, className, active, asChild, ...props }) => {
    forwardProps(props)
    const { open} = useContext(sidebarContext)

    const classActive = () => cn(
        "peer flex w-full items-center overflow-hidden rounded-md text-left text-sm outline-none ring-ring transition-all ease-in-out hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:bg-accent active:text-accent-foreground group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 whitespace-nowrap [&>svg]:shrink-0",
        
        open.value 
            ? "gap-2 p-2 justify-start" 
            : "p-0 h-9 w-9 justify-center mx-auto",

        active() ? "bg-accent text-accent-foreground font-medium" : "",
        className()
    )

    const Element = asChild?.() ? 'as-child' : 'button';

    useInsert({ classActive, open: () => open.value, })

    return html`
        <${Element} class="@{classActive()}" -- >
            <div class="flex items-center w-full [&>svg]:shrink-0  @{open() ? '' : 'justify-center [&>span]:hidden'}">
                ${children}
            </div>
        </${Element}>
    `
}

// Validations
useValidateComponent(DsidebarProvider, {
    className: { default: '', type: String },
    defaultOpen: { default: true, type: Boolean }
})

useValidateComponent(Dsidebar, {
    className: { default: '', type: String },
    side: { default: 'left', type: String },
    variant: { default: 'sidebar', type: String },
    collapsible: { default: 'offcanvas', type: String },
    asChild: { default: false, type: Boolean }
})

useValidateComponent(DsidebarTrigger, {
    className: { default: '', type: String },
    asChild: { default: false, type: Boolean }
})

useValidateComponent(DsidebarMenuButton, {
    className: { default: '', type: String },
    active: { default: false, type: Boolean },
    asChild: { default: false, type: Boolean }
})

useValidateComponent(DsidebarHeader, { className: { default: '', type: String } })
useValidateComponent(DsidebarFooter, { className: { default: '', type: String } })
useValidateComponent(DsidebarContent, { className: { default: '', type: String } })
useValidateComponent(DsidebarGroup, { className: { default: '', type: String } })
useValidateComponent(DsidebarGroupLabel, { className: { default: '', type: String } })
useValidateComponent(DsidebarMenu, { className: { default: '', type: String } })
useValidateComponent(DsidebarMenuItem, { className: { default: '', type: String },active:{ default: false, type: Boolean } })