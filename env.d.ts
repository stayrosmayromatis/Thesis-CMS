/// <reference types="vite/client" />
import 'vite/client';
interface ImportMetaEnv{
    readonly VITE_APP_TITLE:string;
    readonly VITE_BASE_URI:string;
    readonly VITE_REDIRECT_URI:string;
    readonly NODE_ENV:string;
    readonly VITE_APP_USERNAME:string;
    readonly VITE_CLIENT_ID:string;
    readonly VITE_CLIENT_SECRET:string;
    readonly VITE_BACKEND_BASE_URI:string
}

interface ImportMeta {
    readonly env:ImportMetaEnv;
}
