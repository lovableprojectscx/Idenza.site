import { useEffect, useRef } from 'react';

const SpotlightBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const targetRef = useRef({ x: -1000, y: -1000 });
    const currentRef = useRef({ x: -1000, y: -1000 });
    const isHoveringRef = useRef(false);
    const lastInteractionTimeRef = useRef(0);
    const lastMouseMoveRef = useRef(0);
    const lastFrameTimeRef = useRef(0);
    const frameCountRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        // Use larger spacing on mobile to reduce dot count
        const isMobile = window.innerWidth < 768;
        const spacing = isMobile ? 70 : 50;
        const spotlightRadius = 300;
        const baseColor = 'rgba(148, 163, 184, 0.02)';
        const lerpFactor = 0.1;
        // Cap to ~30fps: only draw every other frame
        const FPS_LIMIT = 30;
        const FRAME_MIN_MS = 1000 / FPS_LIMIT;

        const resizeCanvas = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                if (currentRef.current.x === -1000) {
                    currentRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
                }
            }
        };

        const draw = (timestamp: number) => {
            // FPS cap: skip frame if too early
            const elapsed = timestamp - lastFrameTimeRef.current;
            if (elapsed < FRAME_MIN_MS) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }
            lastFrameTimeRef.current = timestamp;
            frameCountRef.current++;

            if (!ctx || !canvas) return;

            time += 0.005;
            const now = Date.now();
            const timeSinceInteraction = now - lastInteractionTimeRef.current;
            const isIdle = timeSinceInteraction > 2000;

            if (!isHoveringRef.current && isIdle) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radiusX = canvas.width * 0.35;
                const radiusY = canvas.height * 0.3;
                targetRef.current = {
                    x: centerX + Math.sin(time * 0.8) * radiusX,
                    y: centerY + Math.cos(time * 0.5) * radiusY,
                };
            }

            currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerpFactor;
            currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerpFactor;

            const { x: spotX, y: spotY } = currentRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cols = Math.ceil(canvas.width / spacing);
            const rows = Math.ceil(canvas.height / spacing);
            // Only paint base (out-of-spotlight) dots every 3 frames to save perf
            const paintBase = frameCountRef.current % 3 === 0;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing;
                    const y = j * spacing;

                    const dx = x - spotX;
                    const dy = y - spotY;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < spotlightRadius * spotlightRadius) {
                        const dist = Math.sqrt(distSq);
                        const intensity = 1 - Math.pow(dist / spotlightRadius, 2);
                        const size = 1 + intensity * 1.5;

                        if (intensity > 0.6) {
                            ctx.fillStyle = `rgba(94, 234, 212, ${intensity * 0.8})`;
                            if (Math.random() > 0.995) {
                                ctx.fillRect(x - 10, y, 20, 1);
                                ctx.fillRect(x, y - 10, 1, 20);
                            }
                        } else {
                            ctx.fillStyle = `rgba(94, 234, 212, ${intensity * 0.4})`;
                        }

                        ctx.beginPath();
                        ctx.arc(x, y, size, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (paintBase) {
                        // Base dots: only repaint every 3 frames (virtually static)
                        ctx.fillStyle = baseColor;
                        ctx.beginPath();
                        ctx.arc(x, y, 1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            // Glow
            const gradient = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotlightRadius);
            gradient.addColorStop(0, 'rgba(94, 234, 212, 0.05)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationFrameId = requestAnimationFrame(draw);
        };

        // Throttled mousemove — only update target every 16ms max
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            if (now - lastMouseMoveRef.current < 16) return;
            lastMouseMoveRef.current = now;
            targetRef.current = { x: e.clientX, y: e.clientY };
            isHoveringRef.current = true;
            lastInteractionTimeRef.current = now;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) {
                targetRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                isHoveringRef.current = true;
                lastInteractionTimeRef.current = Date.now();
            }
        };

        const handleInteractionEnd = () => {
            isHoveringRef.current = false;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleInteractionEnd);
        window.addEventListener('mouseleave', handleInteractionEnd);

        resizeCanvas();
        animationFrameId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleInteractionEnd);
            window.removeEventListener('mouseleave', handleInteractionEnd);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] w-full h-full pointer-events-none"
        />
    );
};

export default SpotlightBackground;
