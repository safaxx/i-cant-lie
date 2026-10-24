import type ApiResponse from "@/types/ApiResponse";

export function apiResponse(
  body: ApiResponse,
  status = 200,
): Response {
  return Response.json(body, { status });
}
