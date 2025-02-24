import { PrismaClient } from "@prisma/client";
import NextAuth, { User } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

const handler = NextAuth({
    providers: [
        Github({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async jwt(
            {token} : {token : JWT}
        ) {
            return token;
        },
    },
});

export { handler as GET, handler as POST };