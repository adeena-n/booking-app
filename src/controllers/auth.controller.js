import { AppDataSource } from "../config/data-source.js";
import { ROLES } from "../utils/constants.js";

export async function getMe(req, res) {
  const repo = AppDataSource.getRepository("UserProfile");
  let profile = await repo.findOneBy({ authUserId: req.authUser.id });

  // First login: create a student profile automatically
  if (!profile) {
    profile = await repo.save(
      repo.create({
        authUserId: req.authUser.id,
        email: req.authUser.email,
        name: req.authUser.user_metadata?.name || req.authUser.email.split("@")[0],
        role: ROLES.STUDENT,
      })
    );
  }

  res.json({ success: true, data: profile });
}