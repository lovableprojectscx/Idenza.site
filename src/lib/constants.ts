export const WHATSAPP_NUMBER = "51921585977";
export const PROD_URL = "https://idenza.site";

export const CONTACT_EMAIL = "idenza.site@gmail.com";

// FormSubmit is the simplest solution for static sites (no account/ID needed)
export const EMAIL_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

export const getWhatsAppUrl = (message: string) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
