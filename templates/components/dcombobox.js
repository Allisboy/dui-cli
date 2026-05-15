import { html, setContext, useContext, useInsert, useValidateComponent, $state, runEffect, forwardProps } from "pawajs"
import { cn } from "./utils"

const comboboxContext = setContext()

export const Dcombobox = ({ children, onValueChange, value, asChild, multiple }) => {
    const isOpen = $state(false)
    const search = $state('')
    const visibleCount = $state(0)
    const activeIndex = $state(0)
    const visibleItems = $state([])

    const close = () => {
        isOpen.value = false
        search.value = ''
    }

    const toggle = () => isOpen.value = !isOpen.value

    runEffect(() => {
        activeIndex.value = 0
    },[search])

    const select = (val) => {
        if (multiple()) {
            const current = value()
            const arr = Array.isArray(current) ? current : (current ? [current] : [])
            const index = arr.indexOf(val)
            
            if (index > -1) {
                arr.splice(index, 1)
            } else {
                arr.push(val)
            }
            
            if (onValueChange()) onValueChange()(arr)
        } else {
            if (onValueChange()) onValueChange()(val)
            close()
        }
    }

    comboboxContext.setValue({ isOpen, search, select: () => select, value, close, toggle, visibleCount, activeIndex, visibleItems })

    const Element = asChild() ? 'as-child' : 'div';
    return html`
        <${Element} class="relative inline-block w-full">
            ${children}
        </${Element}>
    `
}

export const DcomboboxTrigger = ({ children, className, asChild,...props }) => {
    forwardProps(props)
    const { toggle, isOpen,value } = useContext(comboboxContext)
    
    const classActives = () => cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className()
    )

    const Element = asChild() ? 'as-child' : 'button';
    const isArray=$state([])
    runEffect(() => {
        if (Array.isArray(value())) {
            isArray.value=[...value()]
        }
        
        },[value])
    useInsert({ classActives, toggle, open: () => isOpen.value ,value,isArray})

    return html `
        <${Element} type="button" class="@{classActives()}" on-click="toggle()" aria-expanded="@{open()}" -- >
        <div class="flex items-center">
            ${Array.isArray(value()) ?
                `
                <div if="value().length > 0" class="flex flex-wrap gap-1">
                    <span for-each="item in isArray.value" for-key="{{item}}" class="inline-flex items-center rounded-sm border-border bg-secondary px-2 py-1.5 text-xs font-medium text-secondary-foreground">
                        <span>@{item}</span>
                    </span>
                </div>
                <div else>${children}</div>
                `:`
                <span if="value() !== ''">@{value()}</span>
                <div else>${children}</div>
                `
            }
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2 h-4 w-4 shrink-0 opacity-50"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
          </div>
        </${Element}>
    `
}

export const DcomboboxContent = ({ children, className, asChild,...props }) => {
    forwardProps(props)
    const { isOpen, close } = useContext(comboboxContext)

    const classActive = () => cn(
        "absolute z-50 mt-2 min-w-[8rem] w-full overflow-hidden rounded-md border border-border bg-background p-1 text-accent-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ isOpen: () => isOpen.value, classActive, close })

    return html`
        <${Element} if="isOpen()" class="@{classActive()}" out-click.self="close()" -- >
            ${children}
        </${Element}>
    `
}

export const DcomboboxGroup = ({ children, className }) => {
    const classActives = () => cn("p-1", className())
    useInsert({ classActives })
    return html`<div class="@{classActives()}">${children}</div>`
}

export const DcomboboxEmpty = ({ children, className }) => {
    const { visibleItems } = useContext(comboboxContext)
    const classActives = () => cn("py-6 text-center text-sm text-muted-foreground", className())
    useInsert({ 
        isVisible: () => visibleItems.value.length === 0, 
        classActives 
    })
    return html`<div if="isVisible()" class="@{classActives()}">${children}</div>`
}

export const DcomboboxInput = ({ placeholder, asChild }) => {
    const { search, activeIndex, visibleItems, select } = useContext(comboboxContext)
    
    const Element = asChild() ? 'as-child' : 'div';

    const onInput = (e) => {
        search.value = e.target.value
    }

    const onKeyDown = (e) => {
        if (!visibleItems.value.length) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            activeIndex.value = (activeIndex.value + 1) % visibleItems.value.length
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            activeIndex.value = (activeIndex.value - 1 + visibleItems.value.length) % visibleItems.value.length
        } else if (e.key === 'Enter') {
            e.preventDefault()
            const currentVal = visibleItems.value[activeIndex.value]
            if (currentVal) select()(currentVal)
        }
    }

    useInsert({ onInput, onKeyDown, placeholder, val: () => search.value })

    return html `
        <${Element} class="flex items-center border-b border-border px-3" -- >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 shrink-0 opacity-50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input class="flex h-10 w-full rounded-md bg-background py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" placeholder="@{placeholder()}" on-input="onInput(e)" on-keydown="onKeyDown(e)" value="@{val()}" />
        </${Element}>
    `
}

export const DcomboboxItem = ({ children,className, value: itemValue, label, asChild,...props }) => {
    forwardProps(props)
    const { select, value: selectedValue, search, visibleItems, activeIndex } = useContext(comboboxContext)

    const isVisible = () => {
        if (!search.value || search.value === '') return true
        return label().toLowerCase().includes(search.value.toLowerCase())
    }

    runEffect(() => {
        const val = itemValue()
        if (isVisible()) {
            visibleItems.value = [...visibleItems.value, val]
            return () => {
                visibleItems.value = visibleItems.value.filter(v => v !== val)
            }
        }
    },[itemValue, search])

    const isSelected = () => {
        const current = selectedValue()
        if (Array.isArray(current)) {
            return current.includes(itemValue())
        }
        return current === itemValue()
    }

    const isActive = () => visibleItems.value[activeIndex.value] === itemValue()

    const onClick = () => select()(itemValue())

    const classStyle = () => cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        isSelected() ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
        className())
    

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ classStyle, onClick, isSelected, isVisible })

    return html`
        <${Element} if="isVisible()"  on-click="onClick()" data-selected="@{isSelected()}" class="@{classStyle()}" -- >
            <svg if="isSelected()" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><path d="M20 6 9 17l-5-5"/></svg>
            <div class="@{isSelected() ? '' : 'ml-4'}">${children}</div>
        </${Element}>
    `
}

useValidateComponent(Dcombobox, {
    onValueChange: { type: Function, default: () => {} }, 
    value: { default: '' },
    asChild: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false }
})
useValidateComponent(DcomboboxGroup, { className: { type: String, default: '' } })
useValidateComponent(DcomboboxEmpty, { className: { type: String, default: '' } })
useValidateComponent(DcomboboxTrigger, { className: { type: String, default: '' }, asChild: { type: Boolean, default: false } })
useValidateComponent(DcomboboxContent, { className: { type: String, default: '' }, asChild: { type: Boolean, default: false } })
useValidateComponent(DcomboboxInput, { placeholder: { type: String, default: 'Search...' }, asChild: { type: Boolean, default: false } })
useValidateComponent(DcomboboxItem, { value: { type: String, strict: true }, label: { type: String, strict: true }, asChild: { type: Boolean, default: false },className:{type:String,default:''} })