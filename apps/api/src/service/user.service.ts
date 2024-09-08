import { db, takeFirstOrThrow } from "@/lib/db";
import { type Result, err, ok } from "@justmiracle/result";
import type { User, UserInsert } from "@repo/db/schema";
import { TB_user } from "@repo/db/table";
import { eq } from "drizzle-orm";

export class UserService {
  async findByGoogleId(googleId: string): Promise<Result<User | undefined>> {
    return db.query.TB_user.findFirst({
      where: eq(TB_user.googleId, googleId),
    })
      .execute()
      .then(ok)
      .catch(err);
  }

  async findById(id: string) {
    return db.query.TB_user.findFirst({
      where: eq(TB_user.id, id),
    })
      .execute()
      .then(ok)
      .catch(err);
  }

  async create(userInsert: UserInsert): Promise<Result<User>> {
    return db
      .insert(TB_user)
      .values(userInsert)
      .returning()
      .then(takeFirstOrThrow)
      .then(ok)
      .catch(err);
  }

  async update(id: string, userUpdate: Partial<UserInsert>) {
    return db
      .update(TB_user)
      .set(userUpdate)
      .where(eq(TB_user.id, id))
      .returning()
      .then(takeFirstOrThrow)
      .then(ok)
      .catch(err);
  }

  async softDelete(id: string) {
    return db
      .update(TB_user)
      .set({ deletedAt: new Date() })
      .where(eq(TB_user.id, id))
      .returning()
      .then(takeFirstOrThrow)
      .then(ok)
      .catch(err);
  }
}

export const userService = new UserService();
