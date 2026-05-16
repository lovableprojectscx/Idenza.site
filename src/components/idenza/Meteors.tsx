import { useRef, useMemo } from "react";
import { motion } from "framer-motion";

export const Meteors = ({ number = 20 }: { number?: number }) => {
    const meteors = useMemo(() => {
        return new Array(number).fill(true).map(() => ({
            left: Math.floor(Math.random() * 100) + "%",
            delay: Math.random() * 0.6 + 0.2 + "s",
            duration: Math.floor(Math.random() * 8 + 2) + "s", // slower duration
        }));
    }, [number]);

    return (
        <>
            {meteors.map((meteor, idx) => (
                <span
                    key={"meteor" + idx}
                    style={{
                        top: -5,
                        left: meteor.left,
                        animationDelay: meteor.delay,
                        animationDuration: meteor.duration,
                    }}
                    className="animate-meteor-effect absolute h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg] before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent"
                />
            ))}
        </>
    );
};

export default Meteors;
