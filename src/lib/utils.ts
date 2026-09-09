export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateInput(value: string): string {
  return value.slice(0, 10);
}

export function initialsOf(fullName?: string | null): string {
  if (!fullName) return "?";
  return fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function socialHandle(url?: string | null): string {
  if (!url) return "";
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace("www.", "");
  } catch {
    const cleaned = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
    return cleaned.split("/")[0] || cleaned;
  }
}

export function slugify(name?: string | null): string {
  return (name ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function profileSlug(member: {
  full_name?: string | null;
  id: string;
}): string {
  return slugify(member.full_name) || slugify(member.id);
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function getInitialsAvatarColor(name?: string | null): string {
  const hue = name
    ? name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360
    : 0;
  return `hsl(${hue}, 28%, 42%)`;
}