import { db, takeFirst } from "@/lib/db";
import { nanoid } from "@/lib/id";
import { withRetry } from "@/lib/retry";
import { err, ok, unwrap, type Result } from "@justmiracle/result";
import { TB_token } from "@repo/db/table";
import { eq } from "drizzle-orm";
import { Redis } from "ioredis";

const redis = new Redis();

const genKey = (key: string) => `token:${key}`;

const DAY = 60 * 60 * 24;
const MONTH = DAY * 30;

const EXPIRATION = {
  "3M": MONTH * 3,
  "1Y": MONTH * 12,
  FOREVER: undefined,
};

type Expiration = keyof typeof EXPIRATION;

type Token = { token: string; userId: string };

class TokenService {
  async create(userId: string, expiration: Expiration = "FOREVER") {
    const key = `token_${nanoid(26)}`;
    const ttl = EXPIRATION[expiration];

    const redisToken = await this.setToken(key, userId, ttl);
    if (redisToken.error) return redisToken;

    const dbToken = await db
      .insert(TB_token)
      .values({ token: key, userId, ttl })
      .execute()
      .then(ok)
      .catch(err);
    if (dbToken.error) {
      // rollback redis key with 3 retries
      withRetry(() => redis.del(genKey(key)));
      return dbToken;
    }

    return ok({ token: key, userId });
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
    if (!tokenInDb.value) return ok(undefined);

    // check if token is expired
    const ttl = tokenInDb.value.ttl;

    // if there is no expiration time, set it in cache and return
    if (!ttl) {
      withRetry(async () => {
        if (!tokenInDb.value) return;
        await this.setToken(genKey(key), tokenInDb.value.userId).then(unwrap);
      });

      return ok({ token: key, userId: tokenInDb.value.userId });
    }

    const expiresAt = new Date(tokenInDb.value.createdAt).getTime() + ttl * 1000;

    // if token is not expired, set it in cache and return
    if (expiresAt < Date.now()) {
      withRetry(async () => {
        if (!tokenInDb.value) return;
        await this.setToken(genKey(key), tokenInDb.value.userId).then(unwrap);
      });

      return ok({ token: key, userId: tokenInDb.value.userId });
    }

    // if token is expired, delete it from db and cache
    withRetry(async () => {
      if (!tokenInDb.value) return;
      await db.delete(TB_token).where(eq(TB_token.token, key)).execute();
      await this.deleteToken(genKey(key)).then(unwrap);
    });

    return ok(undefined);
  }

  protected async setToken(key: string, userId: string, expiration?: number) {
    if (!expiration) return redis.set(genKey(key), userId).then(ok).catch(err);
    return redis.set(genKey(key), userId, "EX", expiration).then(ok).catch(err);
  }

  protected async deleteToken(key: string) {
    return redis.del(genKey(key)).then(ok).catch(err);
  }
}

export const tokenService = new TokenService();
