import { users } from "../drizzle/schema";
import { InferSelectModel } from "drizzle-orm";

export type UserType = InferSelectModel<typeof users>;