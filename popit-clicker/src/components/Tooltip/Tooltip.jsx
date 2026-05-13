import { cloneElement, useState } from "react";
import {
    useFloating,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    useTransitionStyles,
    offset,
    flip,
    shift,
    arrow,
    FloatingPortal,
    FloatingArrow,
} from "@floating-ui/react";
import { useRef } from "react";
import "./Tooltip.css";



export function Tooltip({ children, content, placement = "top", delay = 1000 }) {
    const [open, setOpen] = useState(false);
    const arrowRef = useRef(null);

    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        placement,
        transform: false,  // ← вот это
        middleware: [
            offset(10),
            flip({ padding: 8 }),
            shift({ padding: 8 }),
            arrow({ element: arrowRef }),
        ],
    });

    const hover = useHover(context, { delay: { open: delay, close: 0 }, move: false });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "tooltip" });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover, focus, dismiss, role,
    ]);

    const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
        duration: { open: 150, close: 100 },
        initial: { opacity: 0, transform: "scale(0.95)" },
    });

    return (
        <>
            {cloneElement(children, {
                ref: refs.setReference,
                ...getReferenceProps(),
            })}
            {isMounted && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={{ ...floatingStyles, ...transitionStyles }}
                        className="tooltip"
                        {...getFloatingProps()}
                    >
                        {content}
                        <FloatingArrow ref={arrowRef} context={context} className="tooltip-arrow" />
                    </div>
                </FloatingPortal>
            )}
        </>
    );
}