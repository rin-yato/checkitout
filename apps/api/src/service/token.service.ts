import { db, takeFirst, takeFirstOrThrow } from "@/lib/db";
import { nanoid } from "@/lib/id";
import { redis } from "@/lib/redis";
import { withRetry } from "@/lib/retry";
import { omit } from "@/lib/transform";
import { err, ok, unwrap, type Result } from "@justmiracle/result";
import { TB_token } from "@repo/db/table";
import { and, eq, isNull, sql } from "drizzle-orm";

const genKey = (key: string) => `token:${key}`;

type Token = { token: string; userId: string };

class TokenService {
  async create(userId: string, tokenName: string) {
    const key = `token_${nanoid(32)}`;

    const exist = await db
      .select()
      .from(TB_token)
      .where(
        and(
          eq(TB_token.name, tokenName),
          eq(TB_token.userId, userId),
          isNull(TB_token.deletedAt),
        ),
      )
      .execute()
      .then(takeFirst)
      .then(ok)
      .catch(err);

    if (exist.error) return exist;
    if (exist.value) return err("Token name already exists");

    const dbToken = await db
      .insert(TB_token)
      .values({ token: key, name: tokenName, userId })
      .returning()
      .then(takeFirstOrThrow)
      .then(ok)
      .catch(err);
    if (dbToken.error) return dbToken;

    withRetry(() => this.setToken(key, userId).then(unwrap));

    return dbToken;
  }

  async findOne(key: string): Promise<Result<undefined | Token>> {
    const _token = await redis.get(genKey(key)).then(ok).catch(err);
    if (_token.error) return _token;

    // if found in cache just return it
    if (_token.value) return ok({ token: key, userId: _token.value });

    // otherwise check the db
    const tokenInDb = await db
      .select()
      .from(TB_token)
      .where(eq(TB_token.token, key))
      .execute()
      .then(takeFirst)
      .then(ok)
      .catch(err);
    if (tokenInDb.error) return tokenInDb;

    if (tokenInDb.value) {
      // set the token in cache
      this.setToken(key, tokenInDb.value.userId);
    }

    return tokenInDb;
  }

  findMany(userId: string) {
    return db.query.TB_token.findMany({
      where: and(eq(TB_token.userId, userId), isNull(TB_token.deletedAt)),
      columns: {
        name: true,
        token: false,
        createdAt: true,
      },
      extras: {
        token: sql`CONCAT(LEFT(token, 8), REPEAT('*', 12), RIGHT(token, 2))`.as("token"),
      },
    })
      .execute()
      .then(ok)
      .catch(err);
  }

  async delete(tokenName: string, userId: string) {
    const deleted = await db
      .update(TB_token)
      .set({ deletedAt: new Date() })
      .where(and(eq(TB_token.name, tokenName), eq(TB_token.userId, userId)))
      .returning()
      .then(takeFirstOrThrow)
      .then(ok)
      .catch(err);
    if (deleted.error) return deleted;

    const deletedFromRedis = await redis.del(deleted.value.token).then(ok).catch(err);
    if (deletedFromRedis.error) return deletedFromRedis;

    return ok(omit(deleted.value, ["token"]));
  }

  protected async setToken(key: string, userId: string, expiration?: number) {
    if (!expiration) return redis.set(genKey(key), userId).then(ok).catch(err);
    return redis.set(genKey(key), userId, "EX", expiration).then(ok).catch(err);
  }
}

export const tokenService = new TokenService();
