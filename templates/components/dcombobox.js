import { html, setContext, useContext, useInsert, useValidateComponent, $state } from "pawajs"
import { cn } from "./utils"

const comboboxContext = setContext()

export const Dcombobox = ({ children, onValueChange, value, asChild }) => {
    const isOpen = $state(false)
    const search = $state('')

    const close = () => {
        isOpen.value = false
        search.value = ''
    }

    const toggle = () => isOpen.value = !isOpen.value

    const select = (val) => {
        if (onValueChange()) onValueChange()(val)
        close()
    }

    comboboxContext.setValue({ isOpen, search, select, value, close, toggle })

    const Element = asChild() ? 'as-child' : 'div';

    return html`
        <${Element} class="relative inline-block w-full">
            ${children}
        </${Element}>
    `
}

export const DcomboboxTrigger = ({ children, className, asChild }) => {
    const { toggle, isOpen } = useContext(comboboxContext)
    
    const classActive = () => cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50",
        className()
    )

    const Element = asChild() ? 'as-child' : 'button';

    useInsert({ classActive, toggle, open: () => isOpen.value })

    return html`
        <button type="button" class="@{classActive()}" on-click="toggle()" aria-expanded="@{open()}">
            ${children}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2 h-4 w-4 shrink-0 opacity-50"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
        </button>
        </${Element}>
    `
}

export const DcomboboxContent = ({ children, className, asChild }) => {
    const { isOpen, close } = useContext(comboboxContext)

    const classActive = () => cn(
        "absolute z-50 mt-2 min-w-[8rem] w-full overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md animate-in fade-in-0 zoom-in-95",
        className()
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ isOpen: () => isOpen.value, classActive, close })

    return html`
        <${Element} if="isOpen()" class="@{classActive()}" out-click.self="close()">
            ${children}
        </${Element}>
    `
}

export const DcomboboxInput = ({ placeholder, asChild }) => {
    const { search } = useContext(comboboxContext)
    
    const Element = asChild() ? 'as-child' : 'div';



    const onInput = (e) => search.value = e.target.value
    
    useInsert({ onInput, placeholder, val: () => search.value })

    return html`
        <div class="flex items-center border-b px-3" -- >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4 shrink-0 opacity-50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input class="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50" placeholder="@{placeholder()}" on-input="onInput(e)" value="@{val()}" />
        </${Element}>
    `
}

export const DcomboboxItem = ({ children, value: itemValue, label, asChild }) => {
    const { select, value: selectedValue, search } = useContext(comboboxContext)

    const isVisible = () => {
        if (!search() || search() === '') return true
        return label().toLowerCase().includes(search().toLowerCase())
    }

    const isSelected = () => selectedValue() === itemValue()
    const onClick = () => select()(itemValue())

    const classActive = () => cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 data-[selected=true]:bg-gray-100",
    )

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ classActive, onClick, isSelected, isVisible })

    return html`
        <${Element} if="isVisible()" class="@{classActive()}" on-click="onClick()" data-selected="@{isSelected()}" -- >
            <svg if="isSelected()" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><path d="M20 6 9 17l-5-5"/></svg>
            <div class="${isSelected() ? '' : 'ml-6'}">${children}</div>
        </${Element}>
    `
}

useValidateComponent(Dcombobox, {
    onValueChange: { type: Function, default: () => {} }, 
    value: { type: String, default: '' },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DcomboboxTrigger, { className: { type: String, default: '' }, asChild: { type: Boolean, default: false } })
useValidateComponent(DcomboboxContent, { className: { type: String, default: '' }, asChild: { type: Boolean, default: false } })
useValidateComponent(DcomboboxInput, { placeholder: { type: String, default: 'Search...' }, asChild: { type: Boolean, default: false } })
useValidateComponent(DcomboboxItem, { value: { type: String, strict: true }, label: { type: String, strict: true }, asChild: { type: Boolean, default: false } })