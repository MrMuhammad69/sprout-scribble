import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/Server/auth";
import { db } from "@/Server";
import { eq } from "drizzle-orm";
import { users } from "@/Server/schema";

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Get user authentication
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");

      // Return user id for use in onUploadComplete
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // Update user's image in database
        await db.update(users)
          .set({ image: file.url })
          .where(eq(users.id, metadata.userId));

        return { uploadedBy: metadata.userId, url: file.url };
      } catch (error) {
        console.error("Error updating user image:", error);
        throw new Error("Failed to update user image");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;