import jwt, { type JwtPayload } from "jsonwebtoken";

type TokenPayload = JwtPayload & {
  userId?: unknown;
  email?: unknown;
};

export interface AuthenticatedUser {
  id: number;
  email: string;
}

function getBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length).trim();
}

export function getAuthenticatedUser(request: Request): AuthenticatedUser | null {
  const token = getBearerToken(request);
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, secret) as string | TokenPayload;

    if (!decoded || typeof decoded === "string") {
      return null;
    }

    const parsedUserId =
      typeof decoded.userId === "number"
        ? decoded.userId
        : Number.parseInt(String(decoded.userId), 10);

    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      return null;
    }

    return {
      id: parsedUserId,
      email: typeof decoded.email === "string" ? decoded.email : "",
    };
  } catch {
    return null;
  }
}
