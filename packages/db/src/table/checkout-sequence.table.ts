import { relations } from "drizzle-orm";
import { column, table } from "../utils";
import { genId } from "../utils/id";
import { TB_user } from "./user.table";

export const TB_checkoutSequence = table("checkout_sequence", {
  id: column.id.$defaultFn(genId("chs")),
  userId: column
    .text("user_id")
    .notNull()
    .references(() => TB_user.id),
  sequence: column.int("sequence").notNull().default(1000),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const checkoutSequenceRelations = relations(TB_checkoutSequence, ({ one }) => ({
  user: one(TB_user, {
    fields: [TB_checkoutSequence.userId],
    references: [TB_user.id],
  }),
}));
