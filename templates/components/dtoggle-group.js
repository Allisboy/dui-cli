import { html, setContext, useContext, useInsert, useValidateComponent, forwardProps } from "pawajs";
import { cn } from "./utils";

const toggleGroupContext = setContext();

export const DtoggleGroup = ({
    children,
    type , // 'single' | 'multiple'
    value,
    onValueChange,
    className,
    orientation ,
    size,
    variant ,
    asChild,
    ...props
}) => { // size and variant are functions here
    forwardProps({variant,size,...props});

    const toggle = (itemValue) => {
        const current = value();
        const callback = onValueChange();
        
        if (type() === 'single') {
            // In single mode, toggle off if same, otherwise set new
            callback?.(current === itemValue ? "" : itemValue);
        } else {
            // In multiple mode, add or remove from array
            const next = Array.isArray(current) ? [...current] : [];
            const index = next.indexOf(itemValue);
            if (index > -1) next.splice(index, 1);
            else next.push(itemValue);
            callback?.(next);
        }
    };

    toggleGroupContext.setValue({ value, toggle, size, variant, type });
    useInsert({ orientation });

    const Element = asChild() ? 'as-child' : 'd-button-group';

    return html `
        <${Element}
            :orientation="orientation()"
            -- 
        >
            ${children}
        </${Element}>
    `;
};

export const DtoggleGroupItem = ({
    children,
    value: itemValue,
    className,
    ...props
}) => {
    forwardProps(props);
    const { value, toggle } = useContext(toggleGroupContext);

    const isPressed = () => {
        const current = value();
        return Array.isArray(current) ? current.includes(itemValue()) : current === itemValue();
    };

    const handleClick = () =>{
        toggle(itemValue());
        } 

    useInsert({ handleClick, isPressed, });
 
    return html `
        <d-button
            :variant="isPressed() ? 'secondary' : 'ghost'"
            on-click="handleClick()"
            aria-pressed="@{isPressed()}"
            --
        >
            ${children}
        </d-button>
    `;
};
useValidateComponent(DtoggleGroupItem, {
    value: { type: String, strict: true },
    className: { default: '', type: String },
    asChild: { type: Boolean, default: false }
});

useValidateComponent(DtoggleGroup, {
    type: { default: 'single', type: String },
    value: { type: [String, Array], strict: true },
    onValueChange: { type: Function },
    className: { default: '', type: String },
    orientation: { default: 'horizontal', type: String },
    size: { default: 'default', type: String },
    variant: { default: 'default', type: String },
    asChild: { type: Boolean, default: false }
});

useValidateComponent(DtoggleGroupItem, {
    value: { type: String, strict: true },
    className: { default: '', type: String }
});