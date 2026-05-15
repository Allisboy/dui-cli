import { html, setContext, useContext, useInsert, useValidateComponent, $state, forwardProps, runEffect } from "pawajs"
import { cn } from "./utils"

const carouselContext = setContext()

export const Dcarousel = ({ children, asChild, autoplay, interval, ...props }) => {
    forwardProps(props)
    const activeSlide = $state(0) // 0-indexed
    const totalSlides = $state(0)

    const next = () => {
        activeSlide.value = (activeSlide.value + 1) % totalSlides.value
    }

    const previous = () => {
        activeSlide.value = (activeSlide.value - 1 + totalSlides.value) % totalSlides.value
    }

    const goTo = (index) => {
        activeSlide.value = index
    }

    runEffect(() => {
        if (!autoplay() || totalSlides.value <= 1) return;
        const timer = setInterval(next, interval() || 3000);
        return () => clearInterval(timer);
    }, [autoplay, interval, totalSlides]);

    carouselContext.setValue({ activeSlide, totalSlides, next, previous, goTo })

    const Element = asChild() ? 'as-child' : 'div';

    return html`
        <${Element} class="relative overflow-hidden" -- >
            ${children}
        </${Element}>
    `
}

export const DcarouselContent = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const { activeSlide } = useContext(carouselContext)

    // This will be used to translate the content horizontally
    const transformStyle = () => `transform: translateX(-${activeSlide.value * 100}%)`

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ transformStyle })

    return html`
        <${Element} class="flex transition-transform duration-500 ease-in-out" style="@{transformStyle()}" -- >
            ${children}
        </${Element}>
    `
}

export const DcarouselItem = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const { totalSlides } = useContext(carouselContext)

    // Register the item and update totalSlides
    runEffect(() => {
        totalSlides.value = totalSlides.value + 1
        return () => {
            totalSlides.value = totalSlides.value - 1
        }
    })

    const Element = asChild() ? 'as-child' : 'div';

    const classActive = () => cn("min-w-0 flex-shrink-0 w-full", className())

    useInsert({ classActive })

    return html`
        <${Element} class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `
}

export const DcarouselPrevious = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const { previous, activeSlide } = useContext(carouselContext)

    const Element = asChild() ? 'as-child' : 'button';

    const isDisabled = () => activeSlide.value === 0

    const classActive = () => cn(
        "absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed",
        className()
    )

    useInsert({ previous, isDisabled, classActive })

    return html`
        <${Element} 
            class="@{classActive()}" 
            on-click="previous()" 
            disabled="@{isDisabled()}"
            -- 
        >
            ${children || `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`}
        </${Element}>
    `
}

export const DcarouselNext = ({ children, className, asChild, ...props }) => {
    forwardProps(props)
    const { next, activeSlide, totalSlides } = useContext(carouselContext)

    const Element = asChild() ? 'as-child' : 'button';

    const isDisabled = () => activeSlide.value === totalSlides.value - 1

    const classActive = () => cn(
        "absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed",
        className()
    )

    useInsert({ next, isDisabled, classActive })

    return html`
        <${Element} 
            class="@{classActive()}" 
            on-click="next()" 
            disabled="@{isDisabled()}"
            -- 
        >
            ${children || `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`}
        </${Element}>
    `
}

export const DcarouselDots = ({ className, asChild, ...props }) => {
    forwardProps(props)
    const { activeSlide, totalSlides, goTo } = useContext(carouselContext)
    
    const dotsArray = () => Array.from({ length: totalSlides.value }, (_, i) => i)
    const classActive = () => cn("flex justify-center gap-2 mt-4", className())
    
    useInsert({ dotsArray, activeSlide, classActive, goTo })
    
    return html`
        <div class="@{classActive()}" -- >
            <button 
                for-each="i in dotsArray()" 
                for-key="{{i}}"
                on-click="goTo(i)"
                class="h-2 w-2 rounded-full transition-all @{activeSlide.value === i ? 'bg-foreground w-4' : 'bg-muted'}"
                aria-label="Go to slide @{i + 1}"
            ></button>
        </div>
    `
}

useValidateComponent(Dcarousel, { 
    asChild: { type: Boolean, default: false },
    autoplay: { type: Boolean, default: false },
    interval: { type: Number, default: 3000 }
})
useValidateComponent(DcarouselContent, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DcarouselItem, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DcarouselDots, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DcarouselPrevious, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DcarouselNext, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})