

import session from 'express-session';

// Extensão da interface Session para incluir o campo 'user'
declare module 'express-session' {
    interface Session {
        user?: string;
    }
}
