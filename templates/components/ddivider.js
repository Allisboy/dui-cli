import { html, useInsert, useValidateComponent } from "pawajs"
import { cn } from "./utils"

export const Ddivider=({className, asChild, text, orientation})=>{
    const isVertical = () => orientation() === 'vertical';
    const hasText = () => !!text();

    const baseClasses = "bg-border";

    const createStyle = () => {
        if (hasText()) {
            // When text is present, the lines are handled internally by the flex container
            return cn("flex items-center", isVertical() ? "flex-col" : "", className());
        } else {
            // Simple divider without text
            return cn(
                baseClasses,
                isVertical() ? "w-px h-full" : "h-px w-full",
                className()
            );
        }
    };

    const Element = asChild() ? 'as-child' : 'div';

    useInsert({createStyle, text, isVertical, hasText});

    if (hasText()) {
        return html`
            <${Element} class="@{createStyle()}">
                <div class="${baseClasses} ${isVertical() ? 'w-px h-full' : 'h-px flex-grow'}"></div>
                <span class="px-2 text-sm text-[var(--muted-foreground)]">@{text()}</span>
                <div class="${baseClasses} ${isVertical() ? 'w-px h-full' : 'h-px flex-grow'}"></div>
            </${Element}>
        `;
    } else {
        return html`
            <${Element} class="@{createStyle()}"></${Element}>
        `;
    }
}
useValidateComponent(Ddivider, {
    className:{type:String,default:''},
    asChild: { type: Boolean, default: false },
    text: { type: String, default: '' },
    orientation: { type: String, default: 'horizontal' } // 'horizontal' | 'vertical'
})