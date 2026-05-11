import { html, useInsert, useValidateComponent, forwardProps, setContext, useContext } from "pawajs";
import { cn } from "./utils";

export const buttonGroupContext = setContext();


export const DbuttonGroup = ({
    children,
    className,
    orientation,
    size ,
    variant,
    asChild,
    ...props
}) => {
    forwardProps(props);

    buttonGroupContext.setValue({
        size: size, // Pass the function reference
        variant: variant, // Pass the function reference
        isInGroup: true,
        orientation: orientation()
    });

    const isVertical = () => orientation() === 'vertical';

    const groupClasses = () => cn(
        "inline-flex isolate text-accent-foreground ",
        isVertical() ? "flex-col -space-y-px" : "flex-row -space-x-px items-center ",

        // Fixed rounding with better specificity
        isVertical()
            ? "[&>*:first-child]:rounded-t-xl [&>*:last-child]:rounded-b-xl [&>*]:rounded-none"
            : "[&>*:first-child]:rounded-l-xl [&>*:last-child]:rounded-r-xl [&>*]:rounded-none",

        className()
    );

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({ groupClasses });

    return html `
        <${Element} 
            class="@{groupClasses()}" 
            role="group"
            aria-orientation="${isVertical() ? 'vertical' : 'horizontal'}"
            --
        >
            ${children}
        </${Element}>
    `;
};
useValidateComponent(DbuttonGroup, {
    className: { type: String, default: '' },
    orientation: { 
        type: String, 
        default: 'horizontal',
    },
    size: { 
        type: String, 
        default: 'sm' 
    },
    variant: { 
        type: String, 
        default: 'outline'
    },
    asChild: {
        type: Boolean, default: false
    }
});

export const DbuttonGroupSeparator = ({ className }) => {
    const { orientation } = useContext(buttonGroupContext);

    const classActive = () => cn(
        "bg-[var(--border)]",
        orientation === 'vertical' 
            ? "h-px w-full my-0.5"
            : "w-px h-8 my-auto mx-0.5",

        className()
    );

    useInsert({ classActive });

    return html`
        <div class="@{classActive()}"></div>
    `;
};

useValidateComponent(DbuttonGroupSeparator, {
    className: { type: String, default: '' }
});