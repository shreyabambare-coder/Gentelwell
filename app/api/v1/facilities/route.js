import { NextResponse } from "next/server";
import { FACILITIES } from "@/lib/setuData";
import { formatApiResponse, shapePayload } from "@/lib/apiHelper";

export async function GET(req) {
  const url = new URL(req.url);
  const district = url.searchParams.get("district");
  const type = url.searchParams.get("type");
  const query = url.searchParams.get("q")?.toLowerCase();

  let filtered = [...FACILITIES];

  if (district && district !== "all") {
    filtered = filtered.filter((f) => f.district.toLowerCase() === district.toLowerCase());
  }

  if (type && type !== "all") {
    filtered = filtered.filter((f) => f.type.toLowerCase().includes(type.toLowerCase()));
  }

  if (query) {
    filtered = filtered.filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.district.toLowerCase().includes(query) ||
        f.services.some((s) => s.toLowerCase().includes(query))
    );
  }

  const shaped = shapePayload(filtered, req);
  return NextResponse.json(
    formatApiResponse(shaped, {
      resourceType: "Bundle",
      entryType: "Location",
      total: shaped.length,
      districtsCovered: ["Mumbai", "Pune", "Palghar", "Kolhapur", "Navi Mumbai"]
    })
  );
}
