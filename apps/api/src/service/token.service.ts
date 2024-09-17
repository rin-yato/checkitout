import { db, takeFirst } from "@/lib/db";
import { nanoid } from "@/lib/id";
import { withRetry } from "@/lib/retry";
import { err, ok, unwrap, type Result } from "@justmiracle/result";
import { TB_token } from "@repo/db/table";
import { eq } from "drizzle-orm";
import { Redis } from "ioredis";

const redis = new Redis();

const genKey = (key: string) => `token:${key}`;

type Token = { token: string; userId: string };

class TokenService {
  async create(userId: string, tokenName: string) {
    const key = `token_${nanoid(26)}`;

    const redisToken = await this.setToken(key, userId);
    if (redisToken.error) return redisToken;

    const dbToken = await db
      .insert(TB_token)
      .values({ token: key, name: tokenName, userId })
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

    if (tokenInDb.value) {
      // set the token in cache
      this.setToken(key, tokenInDb.value.userId);
    }

    return tokenInDb;
  }

  findMany(userId: string) {}

  protected async setToken(key: string, userId: string, expiration?: number) {
    if (!expiration) return redis.set(genKey(key), userId).then(ok).catch(err);
    return redis.set(genKey(key), userId, "EX", expiration).then(ok).catch(err);
  }

  protected async deleteToken(key: string) {
    return redis.del(genKey(key)).then(ok).catch(err);
  }
}

export const tokenService = new TokenService();
