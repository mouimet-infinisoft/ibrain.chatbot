import { generateUUID } from "./id";

// Fonction pour créer un cookie
export function setCookie(cookieName, name) {
    const id = generateUUID();
    const value = `${id}:${name}`;
    // document.cookie = `${cookieName}=${value};path=/;max-age=31536000`; // max-age est pour un an
}

// Fonction pour obtenir la valeur du cookie
export function getCookie(cookieName) {
    // const cookieArray = document.cookie.split(';');
    // for(let cookie of cookieArray) {
    //     if (cookie.trim().startsWith(`${cookieName}=`)) {
    //         const value = cookie.trim().substring(cookieName.length + 1);
    //         const [id, name] = value.split(':');
    //         return { id, name };
    //     }
    // }
    return null; // retourne null si le cookie n'est pas trouvé
}
