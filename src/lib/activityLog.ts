import { prisma } from "@/lib/prisma";

type ActivityLogInput = {
  action: string;
  entity: string;
  entityId?: number | null;
  description: string;
  userId?: number | null;
  adminName?: string | null;
  ipAddress?: string | null;
};

export async function createActivityLog(input: ActivityLogInput) {
  try {
    await prisma.activityLog.create({
      data: {
        action: input.action,
        entity: input.entity,
        entityId: input.entityId || null,
        description: input.description,
        userId: input.userId || null,
        adminName: input.adminName || null,
        ipAddress: input.ipAddress || null,
      },
    });
  } catch (error) {
    console.error("CREATE_ACTIVITY_LOG_ERROR:", error);
  }
}