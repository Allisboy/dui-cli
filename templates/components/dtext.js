import { forwardProps, html, useInsert, useValidateComponent } from "pawajs"

export const Dtext=({children,className,variant,asChild,...props})=>{
    forwardProps(props) 
    const varaints={
        body:{el:'p',style:'p-1 text-sm spacing-2 text-accent-foreground'},
        heading:{el:'h1',style:'text-4xl font-bold py-2 text-accent-foreground'},
        display: { el: 'h1', style: 'text-6xl font-bold text-accent-foreground' },
        subheading: { el: 'h2', style: 'text-2xl font-semibold text-accent-foreground' },
        caption: { el: 'span', style: 'text-xs text-muted-foreground' },
        error: { el: 'p', style: 'text-destructive text-sm' },
        success: { el: 'p', style: 'text-success text-sm' },
        muted: { el: 'p', style: 'text-muted-foreground'}
    }
    const classActive=()=>{
        const v=varaints[variant()]?.style || varaints.body.style
        return `leading-7 ${v} ${className()}`
    }

    const Element = asChild() ? 'as-child' : (varaints[variant()]?.el || varaints.body.el);

    useInsert({classActive})
    return html `
    <${Element} class="@{classActive()}" -- >${children}</${Element}>
    `
}
useValidateComponent(Dtext, {
    className:{
        default:'',
        type:String,
    },
    variant:{
        default:'body',
        type:String,
    },
    asChild: {
        type: Boolean, default: false
    },
})