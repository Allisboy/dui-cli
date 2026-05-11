import { html, useInsert, useValidateComponent, forwardProps } from "pawajs";
import { cn } from "./utils";

export const Dlist = ({ children, className, asChild, ...props }) => {
    forwardProps(props);
    const classActive = () => cn("w-full space-y-1 list-none p-0 m-0", className());
    const Element = asChild() ? 'as-child' : 'ul';
    useInsert({ classActive });
    return html`
        <${Element} class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `;
};

export const DlistHeader = ({ children, className, asChild, ...props }) => {
    forwardProps(props);
    const classActive = () => cn("px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)] tracking-tight", className());
    const Element = asChild() ? 'as-child' : 'div';
    useInsert({ classActive });
    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`;
};

export const DlistItem = ({ children, className, asChild, ...props }) => {
    forwardProps(props);
    const classActive = () => cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] cursor-default select-none",
        className()
    );
    const Element = asChild() ? 'as-child' : 'li';
    useInsert({ classActive });
    return html`
        <${Element} class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `;
};

export const DlistDescription = ({ children, className, asChild, ...props }) => {
    forwardProps(props);
    const classActive = () => cn("text-xs text-[var(--muted-foreground)] leading-relaxed", className());
    const Element = asChild() ? 'as-child' : 'p';
    useInsert({ classActive });
    return html`<${Element} class="@{classActive()}" -- >${children}</${Element}>`;
};

useValidateComponent(Dlist, {
    className: { type: String, default: "" },
    asChild: { type: Boolean, default: false }
});
useValidateComponent(DlistHeader, {
    className: { type: String, default: "" },
    asChild: { type: Boolean, default: false }
});
useValidateComponent(DlistItem, {
    className: { type: String, default: "" },
    asChild: { type: Boolean, default: false }
});
useValidateComponent(DlistDescription, {
    className: { type: String, default: "" },
    asChild: { type: Boolean, default: false }
});