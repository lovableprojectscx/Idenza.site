import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/constants';

const WhatsAppBubble = () => {
    return (
        <motion.a
            href={getWhatsAppUrl("¡Hola! Tengo una consulta sobre Idenza.")}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-[#25D366]/40 transition-shadow"
        >
            <MessageCircle size={30} fill="currentColor" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background animate-pulse" />
        </motion.a>
    );
};

export default WhatsAppBubble;
