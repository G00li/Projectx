import { PrismaClient } from "@prisma/client";
import NextAuth, { User, NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User; }) {
            if (user) {
                let existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                    select: { id: true },
                });

                if (!existingUser) {
                    existingUser = await prisma.user.create({
                        data: {
                            name: user.name!,
                            email: user.email!,
                            image: user.image!,
                        },
                    });
                }
                token.id = existingUser.id as string;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
