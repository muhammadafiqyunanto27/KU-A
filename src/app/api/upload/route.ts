import { type NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionProfile } from "@/lib/auth";
import type { Role } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

const ALLOWED_ROLES: Role[] = ["super_admin", "ketua_kelas"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
];

export async function POST(request: NextRequest) {
  const session = await getSessionProfile();
  if (!session?.profile || !ALLOWED_ROLES.includes(session.profile.role)) {
    return NextResponse.json(
      { error: "Anda tidak berhak mengunggah foto." },
      { status: 403 },
    );
  }

  const body = (await request.formData()) as unknown as HandleUploadBody;

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("background/")) {
          throw new Error("Path upload tidak valid.");
        }
        return {
          allowedContentTypes: IMAGE_TYPES,
          maximumSizeInBytes: MAX_SIZE_BYTES,
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload gagal." },
      { status: 500 },
    );
  }
}