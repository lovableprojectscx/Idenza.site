import { motion } from 'framer-motion';

const HolographicGlobe = () => {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
            {/* 
        REALISTIC EARTH BACKGROUND
        Simulating the original photo's scale but with animated rotation.
        We make it HUGE so the curvature matches the "horizon" look of the original photo.
      */}
            <div className="relative w-[140vw] h-[140vw] md:w-[120vw] md:h-[120vw] opacity-80" style={{ top: '20%' }}>

                {/* ATMOSPHERE GLOW - Adjusted for Blue/Realistic look */}
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-[120px]" />

                {/* THE PLANET SPHERE CONTAINER */}
                <div className="absolute inset-0 rounded-full overflow-hidden shadow-[inset_-100px_-100px_200px_rgba(0,0,0,0.95),inset_20px_20px_100px_rgba(59,130,246,0.3)]">

                    {/* REALISTIC ROTATING TEXTURE LAYER 
              Using specific Earth at Night texture for that "city lights" look from the original photo.
          */}
                    <motion.div
                        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/The_earth_at_night.jpg/2560px-The_earth_at_night.jpg')] bg-repeat-x bg-cover will-change-transform transform-gpu"
                        style={{
                            backgroundSize: "auto 100%"
                        }}
                    />

                    {/* REALISTIC SHADING / DAY-NIGHT TERMINATOR
              Heavy shadow on bottom-right to mimic deep space.
           */}
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.3)_40%,rgba(0,0,0,0.95)_85%)]" />
                </div>
            </div>
        </div>
    );
};

export default HolographicGlobe;
