import { setContext, html, useValidateComponent, forwardProps } from "pawajs"

export const globalConfigContext = setContext();

export const Dprovider = ({ 
    children, 
    button, 
    card, 
    input, 
    asChild,
    ...props 
}) => {
    forwardProps(props);

    // This context will store default variants/sizes for various components
    globalConfigContext.setValue({
        button: (button && button()) || {},
        card: (card && card()) || {},
        input: (input && input()) || {}
    });

    return html`
        <${asChild() ? 'as-child' : 'div'} -- >
            ${children}
        </${asChild() ? 'as-child' : 'div'}>
    `;
};

useValidateComponent(Dprovider, {
    button: { type: Object, default: {} },
    card: { type: Object, default: {} },
    input: { type: Object, default: {} },
    asChild: { type: Boolean, default: false }
})