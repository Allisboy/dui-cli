import { html, setContext, useContext, useInsert, useValidateComponent, forwardProps } from "pawajs";
import { cn } from "./utils";

// No context needed for basic breadcrumb, but kept for future expansion if needed
const breadcrumbContext = setContext(); 

export const Dbreadcrumb = ({ children, className, asChild, ...props }) => {
    forwardProps(props);
    const classActive = () => cn("flex", className());
    const Element = asChild() ? 'as-child' : 'nav';
    useInsert({ classActive });
    return html `
        <${Element} aria-label="breadcrumb" class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `;
};

export const DbreadcrumbList = ({ children, className, asChild, ...props }) => {
    forwardProps(props);
    const classActive = () => cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-[var(--muted-foreground)] sm:gap-2.5", className());
    const Element = asChild() ? 'as-child' : 'ol';
    useInsert({ classActive });
    return html `
        <${Element} class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `;
};

export const DbreadcrumbItem = ({ children, className, asChild, ...props }) => {
    forwardProps(props);
    const classActive = () => cn("inline-flex items-center gap-1.5", className());
    const Element = asChild() ? 'as-child' : 'li';
    useInsert({ classActive });
    return html `
        <${Element} class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `;
};

export const DbreadcrumbLink = ({ children, className, href, asChild, ...props }) => {
    forwardProps(props);
    const classActive = () => cn("transition-colors hover:text-[var(--foreground)]", className());
    const Element = asChild() ? 'as-child' : 'a';
    useInsert({ classActive, href });
    return html `
        <${Element} href="@{href()}" class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `;
};

export const DbreadcrumbPage = ({ children, className, asChild, ...props }) => {
    forwardProps(props);
    const classActive = () => cn("font-normal text-[var(--foreground)]", className());
    const Element = asChild() ? 'as-child' : 'span';
    useInsert({ classActive });
    return html `
        <${Element} aria-current="page" class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `;
};

export const DbreadcrumbSeparator = ({ children, className, asChild, ...props }) => {
    forwardProps(props);
    const classActive = () => cn("text-[var(--muted-foreground)]", className());
    const Element = asChild() ? 'as-child' : 'li';
    useInsert({ classActive });
    return html `
        <${Element} role="presentation" aria-hidden="true" class="@{classActive()}" -- >
            ${children || '/'}
        </${Element}>
    `;
};

export const DbreadcrumbEllipsis = ({ className, asChild, ...props }) => {
    forwardProps(props);
    const classActive = () => cn("flex h-9 w-9 items-center justify-center", className());
    const Element = asChild() ? 'as-child' : 'span';
    useInsert({ classActive });
    return html `
        <${Element} role="presentation" aria-hidden="true" class="@{classActive()}" -- >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            <span class="sr-only">More pages</span>
        </${Element}>
    `;
};

useValidateComponent(Dbreadcrumb, { className: { type: String, default: '' }, asChild: { type: Boolean, default: false } });
useValidateComponent(DbreadcrumbList, { className: { type: String, default: '' }, asChild: { type: Boolean, default: false } });
useValidateComponent(DbreadcrumbItem, { className: { type: String, default: '' }, asChild: { type: Boolean, default: false } });
useValidateComponent(DbreadcrumbLink, {
    className: { type: String, default: '' },
    href: { type: String, strict: true },
    asChild: { type: Boolean, default: false }
});
useValidateComponent(DbreadcrumbPage, { className: { type: String, default: '' }, asChild: { type: Boolean, default: false } });
useValidateComponent(DbreadcrumbSeparator, { className: { type: String, default: '' }, asChild: { type: Boolean, default: false } });
useValidateComponent(DbreadcrumbEllipsis, { className: { type: String, default: '' }, asChild: { type: Boolean, default: false } });