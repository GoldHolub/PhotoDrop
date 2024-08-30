import { pgTable, serial, text, timestamp, integer, varchar, customType, primaryKey, boolean } from 'drizzle-orm/pg-core';
import { Column, relations } from 'drizzle-orm';

const byteaType = customType<{ data: Buffer }>({
    dataType() {
        return 'bytea';
    },
    toDriver(value: Buffer) {
        return value;
    },
    fromDriver(value: unknown) {
        return value as Buffer;
    },
});

export const Photographer = pgTable('photographers', {
    id: serial('id').primaryKey(),
    username: text('username'),
    password: text('password'),
    role: varchar('role', { length: 50 }).default('photographer'),
});

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }),
    phoneNumber: varchar('phone_number', { length: 15 }).notNull().unique(),
    telegramChatId: integer('telegram_chat_id').unique(),
    selfieId: integer('selfie_id').references(() => userSelfies.id),
    role: varchar('role', { length: 50 }).default('client'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const userSelfies = pgTable('user_selfies', {
    id: serial('id').primaryKey(),
    selfie: byteaType('selfie').notNull(),
})

export const imageInfo = pgTable('image_info', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    folderId: integer('folder_id').references(() => folders.id).notNull(),
    photographerId: integer('photographer_id').references(() => Photographer.id).notNull(),
    isPurchased: boolean('is_purchased').default(false),    
    createdAt: timestamp('created_at').defaultNow(),
});

export const images = pgTable('images', {
    id: serial('id').primaryKey(),
    imageData: byteaType('imageData').notNull(),
    imageInfoId: integer('image_info_id').references(() => imageInfo.id).notNull(),
});

export const folders = pgTable('folders', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    location: varchar('location', { length: 255 }).notNull(),
    photographerId: integer('photographer_id').references(() => Photographer.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const imagesToUsers = pgTable(
    'images_to_users',
    {
        imageInfoId: integer('image_info_id').notNull().references(() => imageInfo.id),
        userId: integer('user_id').notNull().references(() => users.id),
    },
    (t) => ({
        pk: primaryKey({columns: [t.imageInfoId, t.userId]}),
    })
);

export const photographerRelations = relations(Photographer, ({ many }) => ({
    folders: many(folders),
    images: many(imageInfo),
}));

export const selfiesRelations = relations(userSelfies, ({ one }) => ({
    users: one(users, {
        fields: [userSelfies.id],
        references: [users.selfieId]
    })
}));

export const userRelations = relations(users, ({ one, many }) => ({
    images: many(imagesToUsers),
    selfies: one(userSelfies, {
        fields: [users.selfieId],
        references: [userSelfies.id]
    })
}));

export const folderRelations = relations(folders, ({ one, many }) => ({
    photographer: one(Photographer, {
        fields: [folders.photographerId],
        references: [Photographer.id],
    }),
    images: many(imageInfo),
}));

export const imageInfoRelations = relations(imageInfo, ({ one, many }) => ({
    photographer: one(Photographer, {
        fields: [imageInfo.photographerId],
        references: [Photographer.id],
    }),
    folder: one(folders, {
        fields: [imageInfo.folderId],
        references: [folders.id],
    }),
    images: one(images, {
        fields: [imageInfo.id],
        references: [images.imageInfoId],
    }),
    imagesToUsers: many(imagesToUsers),
}));

export const imageRelations = relations(images, ({ one }) => ({
    imageInfo: one(imageInfo, {
        fields: [images.imageInfoId],
        references: [imageInfo.id],
    }),
}));

export const imagesToUsersRelations = relations(imagesToUsers, ({ one }) => ({
    imageInfo: one(imageInfo, {
        fields: [imagesToUsers.imageInfoId],
        references: [imageInfo.id],
    }),
    user: one(users, {
        fields: [imagesToUsers.userId],
        references: [users.id],
    }),
}));