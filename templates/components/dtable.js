import { html, useInsert, useValidateComponent } from "pawajs"
import { cn } from "./utils"

export const Dtable = ({ children, className, asChild }) => {
    const classActive = () => cn("w-full caption-bottom text-sm", className())
    const Element = asChild() ? 'as-child' : 'table';
    useInsert({ classActive })
    return html`
        <div class="relative w-full overflow-auto">
            <${Element} class="@{classActive()}">${children}</${Element}>
        </div>
    `
}

export const DtableHeader = ({ children, className, asChild }) => {
    const classActive = () => cn("[&_tr]:border-b", className())
    const Element = asChild() ? 'as-child' : 'thead';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DtableBody = ({ children, className, asChild }) => {
    const classActive = () => cn("[&_tr:last-child]:border-0", className())
    const Element = asChild() ? 'as-child' : 'tbody';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DtableRow = ({ children, className, asChild }) => {
    const classActive = () => cn(
        "border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100",
        className()
    )
    const Element = asChild() ? 'as-child' : 'tr';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DtableHead = ({ children, className, asChild }) => {
    const classActive = () => cn(
        "h-10 px-2 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0",
        className()
    )
    const Element = asChild() ? 'as-child' : 'th';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

export const DtableCell = ({ children, className, asChild }) => {
    const classActive = () => cn("p-2 align-middle [&:has([role=checkbox])]:pr-0", className())
    const Element = asChild() ? 'as-child' : 'td';
    useInsert({ classActive })
    return html`<${Element} class="@{classActive()}">${children}</${Element}>`
}

useValidateComponent(Dtable, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DtableHeader, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DtableBody, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DtableRow, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DtableHead, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})
useValidateComponent(DtableCell, {
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
})