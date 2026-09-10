import { type NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionProfile } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const ALLOWED_EXT = ["jpg", "png", "webp", "avif"];

export async function POST(request: NextRequest) {
  const session = await getSessionProfile();
  if (!session) {
    return NextResponse.json(
      { error: "Silakan masuk terlebih dahulu." },
      { status: 401 },
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json(
      { error: "Body request tidak valid." },
      { status: 400 },
    );
  }

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("certificate/")) {
          throw new Error("Path upload tidak valid.");
        }
        const ext = (pathname.split(".").pop() ?? "jpg").toLowerCase();
        const safeExt = ALLOWED_EXT.includes(ext) ? ext : "jpg";
        return {
          allowedContentTypes: IMAGE_TYPES,
          maximumSizeInBytes: MAX_SIZE_BYTES,
          pathname: `certificate/${session.user.id}/${crypto.randomUUID()}.${safeExt}`,
          addRandomSuffix: false,
        };
      },
    });
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload gagal." },
      { status: 500 },
    );
  }
}