import { html, useInsert, useValidateComponent, forwardProps } from "pawajs";
import { cn } from "./utils";

export const Dskeleton = ({ className, asChild, children, ...props }) => {
    forwardProps(props);

    const classActive = () => cn(
        "animate-pulse rounded-md bg-muted", 
        className()
    );

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ classActive });

    return html`
        <${Element} class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `;
};

useValidateComponent(Dskeleton, {
    className: { type: String, default: '' },
    asChild: {
        type: Boolean, default: false
    },
});