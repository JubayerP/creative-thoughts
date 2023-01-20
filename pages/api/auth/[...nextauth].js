import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
    providers: [
        process.env.VERCEL_ENV === "preview"
            ? CredentialsProvider({
                name: "Credentials",
                credentials: {
                    username: {
                        label: "Username",
                        type: "text",
                        placeholder: "jsmith",
                    },
                    password: { label: "Password", type: "password" },
                },
                async authorize() {
                    return {
                        id: 1,
                        name: "J Smith",
                        email: "jsmith@example.com",
                        image: "https://i.pravatar.cc/150?u=jsmith@example.com",
                    }
                },
            })
            : GoogleProvider({
                clientId: process.env.GOOGLE_ID,
                clientSecret: process.env.GOOGLE_SECRET,
            }),
    ],
})