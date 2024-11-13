import NextAuth, { type DefaultSession } from 'next-auth';

export type ExtendUser = DefaultSession['user'] & {
    id: string,
    role: string,
    twoFactorEnabled: boolean,
    image: string | null
    isOAuth: boolean
}

declare module 'next-auth' {
    interface Session {
        user: ExtendUser
    }
}
