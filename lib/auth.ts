import { betterAuth } from "better-auth"
import { createAuthMiddleware } from "better-auth/api"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db("JobSeekerBD")

export const ROLES = ["seeker", "recruiter", "admin"] as const
export type Role = (typeof ROLES)[number]

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: true,
        defaultValue: "seeker" satisfies Role,
      },
    },
  },
  // সুরক্ষিত এবং সঠিক উপায়ে বডি চেক ও রোল হ্যান্ডেল করা
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email" && ctx.body) {
        // Better Auth অনেক সময় সরাসরি body-তেই ফিল্ডগুলো রাখে
        const body = ctx.body
        const role = body.role || body.user?.role

        if (!role || !ROLES.includes(role as Role)) {
          body.role = "seeker"
          if (body.user) {
            body.user.role = "seeker"
          }
        } else {
          // রুল নিশ্চিত করা যাতে ডাটাবেসে প্রপারলি পাস হয়
          body.role = role
          if (body.user) {
            body.user.role = role
          }
        }
      }
    }),
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
})
