import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
    // Mouse Position Values
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth Spring Physics for the "Trailer"
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Context State
    const [cursorState, setCursorState] = useState<'default' | 'pointer' | 'text'>('default');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Event Listeners for Mouse Movement
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseDown = () => setCursorState('pointer'); // Simple press effect
        const handleMouseUp = () => setCursorState('default'); // Reset

        // Context Awareness Checkers
        const CheckHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check if clickable (Button, Link, or explicitly pointer)
            const isClickable =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') !== null ||
                target.closest('a') !== null;

            // Check if text (Input, Paragraph, Header) - Optional refinement
            const isText =
                target.tagName === 'P' ||
                target.tagName === 'H1' ||
                target.tagName === 'H2' ||
                target.tagName === 'H3' ||
                target.tagName === 'SPAN' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA';

            if (isClickable) {
                setCursorState('pointer');
            } else if (isText) {
                setCursorState('text');
            } else {
                setCursorState('default');
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', CheckHover); // Check on hover enter

        // Hide on leave window
        document.body.addEventListener('mouseleave', () => setIsVisible(false));
        document.body.addEventListener('mouseenter', () => setIsVisible(true));

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', CheckHover);
            document.body.removeEventListener('mouseleave', () => setIsVisible(false));
            document.body.removeEventListener('mouseenter', () => setIsVisible(true));
        };
    }, [mouseX, mouseY, isVisible]);

    // Don't render on mobile (touch devices)
    // We check via capability, simpler than media query for React render
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return null;

    return (
        <>
            {/* Main "Dot" Cursor (Instant Tracking) */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-screen"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0
                }}
            />

            {/* "Trailer" Cursor (Smooth Follow) */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998] border border-primary/50 rounded-full flex items-center justify-center mix-blend-screen"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0
                }}
                animate={{
                    width: cursorState === 'pointer' ? 60 : cursorState === 'text' ? 4 : 40,
                    height: cursorState === 'pointer' ? 60 : cursorState === 'text' ? 40 : 40,
                    backgroundColor: cursorState === 'pointer' ? 'rgba(59, 130, 246, 0.05)' : 'transparent', // Subtle fill on click
                    borderColor: cursorState === 'pointer' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.3)',
                    borderRadius: cursorState === 'text' ? '4px' : '9999px', // Becomes bar on text
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
                {/* Tech Crosshair/Cornermarks inside Trailer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: cursorState === 'pointer' ? 1 : 0 }}
                    className="absolute inset-0"
                >
                    {/* Top Crosshair */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary/60" />
                    {/* Bottom Crosshair */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary/60" />
                    {/* Left Crosshair */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-primary/60" />
                    {/* Right Crosshair */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-primary/60" />
                </motion.div>
            </motion.div>
        </>
    );
};

export default CustomCursor;
