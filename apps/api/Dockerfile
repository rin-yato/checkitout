FROM oven/bun:alpine AS base

FROM base AS builder

WORKDIR /app

COPY . .

RUN bun install

RUN cd apps/api && bun compile

# ? -------------------------
FROM base AS runner

RUN apk update && apk add curl
RUN apk add --update nodejs npm

WORKDIR /app

COPY --from=builder /app/apps/api/dist/main main
RUN bun add sharp --trusted --production 

ENV NODE_ENV production
CMD ["bun", "./main"]
