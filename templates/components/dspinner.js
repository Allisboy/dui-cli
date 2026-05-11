import { html, useInsert, useValidateComponent, forwardProps } from "pawajs";
import { cn } from "./utils";

export const Dspinner = ({ className, size, asChild, ...props }) => {
    forwardProps(props);

    const sizes = () => ({
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-3",
    });

    const classActive = () => cn(
        "animate-spin rounded-full border-solid border-current border-t-transparent",
        sizes()[size()] || sizes().md,
        className()
    );

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ classActive });

    return html`
        <${Element} class="@{classActive()}" role="status" -- >
            <span class="sr-only">Loading...</span>
        </${Element}>
    `;
};

useValidateComponent(Dspinner, {
    className: { type: String, default: '' },
    size: { 
        type: String, 
        default: 'md' 
    },
    asChild: {
        type: Boolean, default: false
    },
});