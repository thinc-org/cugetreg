import { prisma } from "@/db/clients.js";
import { mapDayOfWeek } from "@/utils/enumMapper.js";

import type {
  CreateActivityBodySchema,
  UpdateActivityBodySchema,
} from "@cugetreg/zod-schemas/activity";

import { LexoRankService } from "./lexorank.service.js";

export const activityService = {
  createActivity: async (userId: string, data: CreateActivityBodySchema) => {
    return prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({ where: { id: data.cartId } });

      if (!cart) {
        throw new Error("CART_NOT_FOUND");
      }
      if (cart.userId !== userId) {
        throw new Error("NOT_CART_OWNER");
      }

      const lastActivity = await tx.activity.findFirst({
        where: { cartId: data.cartId },
        orderBy: { cartOrder: "desc" },
      });

      const nextOrder = LexoRankService.getNextRank(lastActivity?.cartOrder);

      return tx.activity.create({
        data: {
          cartId: data.cartId,
          title: data.title,
          description: data.description,
          dayOfWeek: mapDayOfWeek(data.dayOfWeek),
          periodStart: data.periodStart,
          periodEnd: data.periodEnd,
          color: data.color,
          hidden: data.hidden ?? false,
          cartOrder: nextOrder,
        },
      });
    });
  },

  updateActivity: async (
    userId: string,
    activityId: string,
    updatedData: UpdateActivityBodySchema,
  ) => {
    return prisma.$transaction(async (tx) => {
      const targetActivity = await tx.activity.findUnique({
        where: { id: activityId },
        include: { cart: true },
      });

      if (!targetActivity) {
        throw new Error("ACTIVITY_NOT_FOUND");
      }
      if (targetActivity.cart.userId !== userId) {
        throw new Error("NOT_CART_OWNER");
      }

      const { prevId, nextId, dayOfWeek, ...rest } = updatedData;
      const dataToUpdate: Omit<
        UpdateActivityBodySchema,
        "prevId" | "nextId" | "dayOfWeek"
      > & {
        dayOfWeek?: ReturnType<typeof mapDayOfWeek>;
        cartOrder?: string;
      } = { ...rest };

      if (dayOfWeek !== undefined) {
        dataToUpdate.dayOfWeek = mapDayOfWeek(dayOfWeek);
      }

      if (prevId !== undefined || nextId !== undefined) {
        const [prevActivity, nextActivity] = await Promise.all([
          prevId ? tx.activity.findUnique({ where: { id: prevId } }) : null,
          nextId ? tx.activity.findUnique({ where: { id: nextId } }) : null,
        ]);
        dataToUpdate.cartOrder = LexoRankService.getBetweenRank(
          prevActivity?.cartOrder,
          nextActivity?.cartOrder,
        );
      }

      return tx.activity.update({
        where: { id: activityId },
        data: dataToUpdate,
      });
    });
  },

  deleteActivity: async (userId: string, activityId: string) => {
    await prisma.$transaction(async (tx) => {
      const targetActivity = await tx.activity.findUnique({
        where: { id: activityId },
        include: { cart: true },
      });

      if (!targetActivity) {
        throw new Error("ACTIVITY_NOT_FOUND");
      }
      if (targetActivity.cart.userId !== userId) {
        throw new Error("NOT_CART_OWNER");
      }

      await tx.activity.delete({ where: { id: activityId } });
    });
  },
};
