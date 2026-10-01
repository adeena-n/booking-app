import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
import { AppDataSource } from "../config/data-source.js";
import { AppError } from "../utils/AppError.js";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function getAuthUser(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) throw new AppError(401, "UNAUTHENTICATED", "Missing token");

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    throw new AppError(401, "UNAUTHENTICATED", "Invalid or expired token");
  }
  return data.user;
}

// Only checks the token (used by /auth/me)
export async function authenticateToken(req, res, next) {
  req.authUser = await getAuthUser(req);
  next();
}

// Checks the token AND loads the profile with role (used everywhere else)
export async function authenticate(req, res, next) {
  const authUser = await getAuthUser(req);
  const profile = await AppDataSource.getRepository("UserProfile")
    .findOneBy({ authUserId: authUser.id });
  if (!profile) throw new AppError(403, "NO_PROFILE", "User profile not found");

  req.user = profile;
  next();
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    throw new AppError(403, "FORBIDDEN", "You are not allowed to do this");
  }
  next();
};