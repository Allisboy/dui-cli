import { html, useInsert, useValidateComponent, forwardProps, useContext } from "pawajs";
import { cn } from "./utils";
import { buttonGroupContext } from "./dbutton-group";
import { globalConfigContext } from "./dprovider";

export const Dbutton = ({
    className,
    variant,
    size,
    children,
    asChild,
    ...props
}) => {
    forwardProps(props);

    const groupCtx = useContext(buttonGroupContext);
    const globalCtx = useContext(globalConfigContext) || {}

    // Priority: 1. Local Prop (if not default) | 2. Group Context | 3. Global Config | 4. Local Prop (default)
    const finalSize = () =>
        size() !== 'default' 
            ? size() 
            : groupCtx?.isInGroup 
                ? groupCtx.size() 
                : (globalCtx?.button?.size || size());

    const finalVariant = () =>
        variant() !== 'default' 
            ? variant() 
            : groupCtx?.isInGroup 
                ? groupCtx.variant() 
                : (globalCtx?.button?.variant || variant());

    const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.985] hover:z-10 focus-visible:z-20";

    const variants = () => ({
        default: "bg-primary text-primary-foreground hover:opacity-90 focus-visible:ring-primary",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90 focus-visible:ring-destructive",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-80 focus-visible:ring-ring",
        ghost: "hover:bg-accent hover:text-accent-foreground text-primary",
        link: "text-primary underline-offset-4 hover:underline",
    });

    const sizes = () => ({
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8",
        icon: "h-10 w-10 p-2",
    });

    const classActive = () => {
        const v = variants()[finalVariant()] || variants().default;
        const s = sizes()[finalSize()] || sizes().default;
        return cn(base, v, s, className());
    };

    const Element = asChild() ? 'as-child' : 'button';

    useInsert({ classActive });

    return html`
        <${Element} class="@{classActive()}" -- >
            ${children}
        </${Element}>
    `;
};

useValidateComponent(Dbutton, {
    className: { type: String, default: '' },
    variant: { 
        type: String, 
        default: 'default',
    },
    size: { 
        type: String, 
        default: 'default',
    },
    asChild: {
        type: Boolean, default: false
    },
});