import { html, useInsert, useValidateComponent, $state, runEffect, forwardProps, setContext, useContext } from "pawajs"
import { cn } from "./utils"

const avatarContext = setContext()

export const Davatar = ({ className, size, children, asChild , ...props}) => {
    forwardProps(props) 
    const status = $state('idle')

    avatarContext.setValue({ status })

    const sizes = () => ({
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base"
    })

    const containerClass = () => cn(
        "relative flex shrink-0 rounded-full bg-muted",
        sizes()[size()] || sizes().md,
        className()
    )

    const Element = asChild?.() ? 'as-child' : 'div';

    useInsert({ containerClass })

    return html `
        <${Element} class="@{containerClass()}" -- >
            ${children}
        </${Element}>
    `
}

export const DavatarImage = ({ src, alt, className, ...props }) => {
    forwardProps({...props})
    const { status } = useContext(avatarContext)

    runEffect(() => {
        if (!src()) {
            status.value = 'error'
        } else {
            status.value = 'loading'
        }
    })

    const onImageLoad = () => {
        status.value = 'success'
    }

    const onImageError = () => {
        status.value = 'error'
    }

    const classActive = () => cn(
        "aspect-square h-full w-full",
        "rounded-full",
        status.value !== 'success' ? 'hidden' : '',
        className()
    )

    useInsert({ classActive, onImageLoad, onImageError,src,alt })

    return html `
        <img
            src="@{src()}"
            alt="@{alt()}"
          --
            class="@{classActive()}"
            on-load="onImageLoad()"
            on-error="onImageError()"
        />
    `
}

export const DavatarFallback = ({ children, className, ...props }) => {
    forwardProps(props)
    const { status } = useContext(avatarContext)

    const isVisible = () => status.value !== 'success'
    const isLoading = () => status.value === 'loading'

    const classActive = () => cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted font-medium uppercase text-muted-foreground",
        className()
    )

    useInsert({ classActive, isVisible, isLoading })

    return html`
        <div if="isVisible()" class="@{classActive()}">
                <d-spinner if="isLoading()" size="sm"></d-spinner>
            <span else>
                ${children}
            </span>
            
        </div>`
}

export const DavatarIndicator = ({ className, variant, ...props }) => {
    forwardProps(props)
    const variants = () => ({
        online: "bg-green-500",
        offline: "bg-slate-400",
        away: "bg-amber-500",
        busy: "bg-red-500"
    })

    const classActive = () => cn(
        "absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-background",
        variants()[variant()] || variants().online,
        className()
    )

    useInsert({ classActive })

    return html`<span class="@{classActive()}"></span>`
}

useValidateComponent(Davatar, {
    className: { default: '', type: String },
    size: { default: 'md', type: String }
    ,
    asChild: {
        type: Boolean, default: false
    },
})

useValidateComponent(DavatarImage, {
    src: { default: '', type: String },
    alt: { default: 'Avatar', type: String },
    className: { default: '', type: String },
})

useValidateComponent(DavatarFallback, {
    className: { default: '', type: String },
})

useValidateComponent(DavatarIndicator, {
    className: { default: '', type: String },
    variant: { default: 'online', type: String }
})