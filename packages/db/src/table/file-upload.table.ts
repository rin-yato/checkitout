import { relations } from "drizzle-orm";
import { column, table } from "../utils";
import { TB_user } from "./user.table";
import { genId } from "../utils/id";

export type TB_FileUpload = typeof TB_fileUpload;

export const TB_fileUpload = table("file_upload", {
  id: column.id.$defaultFn(genId("file")),

  userId: column
    .text("user_id")
    .references(() => TB_user.id)
    .notNull(),

  name: column.text("name").notNull(),
  url: column.text("url").notNull(),
  hash: column.text("hash").notNull(),
  type: column.text("type").notNull(),
  size: column.int("size").notNull(),

  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const fileUploadsRelations = relations(TB_fileUpload, ({ one }) => ({
  user: one(TB_user, {
    fields: [TB_fileUpload.userId],
    references: [TB_user.id],
  }),
}));
