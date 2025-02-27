import { PrismaClient } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session:{
        strategy:"database"
    }, 
    callbacks: {
        async signIn({ user, account }) {
            if (!account) return false;

            const existingUser = await prisma.user.findUnique({
                where: { email: user.email! },
                include: { accounts: true },
            });

            if (existingUser) {
                // Se o usuário já existe, verifica se ele tem a conta vinculada
                const isLinked = existingUser.accounts.some(acc => acc.provider === account.provider);

                if (!isLinked) {
                    // Se não estiver vinculado, cria um novo registro de conta
                    await prisma.account.create({
                        data: {
                            userId: existingUser.id,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            type: account.type,
                            access_token: account.access_token ?? undefined,
                            refresh_token: account.refresh_token ?? undefined,
                            expires_at: account.expires_at ?? undefined,
                            id_token: account.id_token ?? undefined,
                            scope: account.scope ?? undefined,
                            session_state: account.session_state ?? undefined,
                        },
                    });
                }
            }

            return true;
        },
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
