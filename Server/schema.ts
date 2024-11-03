import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    boolean,
    pgEnum,
  } from "drizzle-orm/pg-core"
  import type { AdapterAccount } from "next-auth/adapters"
  import {createId} from '@paralleldrive/cuid2'

export const RoleEnum = pgEnum("role", ["user", "admin"])
export const users = pgTable("user", {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    password: text("password"),
    twoFactorEnabled: boolean("twoFactorEnabled").default(false),
    role: RoleEnum("role").default('user'),
  })
   
  export const accounts = pgTable(
    "account",
    {
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccount["type"]>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
    },
    (account) => ({
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    })
  )

  export const emailTokens = pgTable(
    "email_token",
    {
      id: text("id").notNull().$defaultFn(()=> createId()),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
      email: text('email').notNull()
    },
    (emailToken) => ({
      compositePk: primaryKey({
        columns: [emailToken.id, emailToken.token],
      }),
    })
  )

  export const passwordResetTokens = pgTable(
    "password_reset_token",
    {
      id: text("id").notNull().$defaultFn(()=> createId()),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
      email: text('email').notNull()
    },
    (emailToken) => ({
      compositePk: primaryKey({
        columns: [emailToken.id, emailToken.token],
      }),
    })
  )

  export const TwoFactorTokens = pgTable(
    "two_factor_token",
    {
      id: text("id").notNull().$defaultFn(()=> createId()),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
      email: text('email').notNull()
    },
    (emailToken) => ({
      compositePk: primaryKey({
        columns: [emailToken.id, emailToken.token],
      }),
    })
  )

  



   