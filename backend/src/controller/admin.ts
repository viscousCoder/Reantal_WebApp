import { Request, Response } from "express";
import { getConnection } from "../database/db.config";
import { User } from "../entities/Users";
import { Owner } from "../entities/Owner";
import { AuthenticatedRequest } from "../types/requestTypes";

/**
 * @function getUsers
 * @description it basaically gets all the users from the database
 */
export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    const userType = req.headers["x-users"]?.toString().toLowerCase();

    if (!userType) {
      res.status(400).json({ error: "Missing x-users header" });
      return;
    }

    const AppDataSource = await getConnection();

    let result;

    switch (userType) {
      case "tenant":
        result = await AppDataSource.getRepository(User).find({
          relations: ["bookings", "bookings.property"],
          order: { created_at: "DESC" },
        });
        break;

      case "owner":
        result = await AppDataSource.getRepository(Owner).find({
          where: { userRole: "owner" },
          relations: [
            "properties",
            "properties.photos",
            "properties.description",
            "properties.policies",
          ],
          order: { created_at: "DESC" },
        });
        break;

      case "admin":
        result = await AppDataSource.getRepository(Owner).find({
          where: { userRole: "admin" },
          order: { created_at: "DESC" },
        });
        break;

      default:
        res.status(400).json({ error: "Invalid x-users header value" });
        return;
    }

    res.status(200).json({ users: result });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * @function updateUser
 * @description it updates the user in the database basiaclly block or unblock the user
 */
export async function updateUser(req: Request, res: Response): Promise<void> {
  const { userId, userRole, block } = req.body;

  try {
    const AppDataSource = await getConnection();
    if (!userId || !userRole) {
      res.status(400).json({ message: "Missing userId or userRole" });
      return;
    }

    let repository =
      userRole === "tenant"
        ? AppDataSource.getRepository(User)
        : AppDataSource.getRepository(Owner);

    const user = await repository.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.block = block;

    if (userRole === "tenant") {
      await AppDataSource.getRepository(User).save(user as User);
    } else {
      await AppDataSource.getRepository(Owner).save(user as Owner);
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * @function deleteUser
 * @description it deletes the user from the database
 */
export async function deleteUser(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { userId, userRole } = req.body;

    if (!userId || !userRole) {
      res
        .status(400)
        .json({ errors: { general: "User ID and role are required." } });
      return;
    }

    const AppDataSource = await getConnection();

    if (userRole === "tenant") {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id: userId } });

      if (!user) {
        res.status(404).json({ errors: { general: "User not found" } });
        return;
      }

      await userRepo.remove(user);
    } else {
      const ownerRepo = AppDataSource.getRepository(Owner);
      const owner = await ownerRepo.findOne({ where: { id: userId } });

      if (!owner) {
        res.status(404).json({ errors: { general: "Owner not found" } });
        return;
      }

      await ownerRepo.remove(owner);
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ errors: { server: "Internal server error" } });
  }
}

/**
 * @function getSelectedAdminUser
 * @description it gets the selected admin user from the database
 */
export async function getSelectedAdminUser(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.headers["x-userid"] as string;
    const userRole = req.headers["x-userrole"] as string;

    if (!userId || !userRole) {
      res.status(400).json({ error: "Missing userId or userRole in headers" });
      return;
    }

    const AppDataSource = await getConnection();
    let user: User | Owner | null = null;

    if (userRole === "tenant") {
      const userRepo = AppDataSource.getRepository(User);
      user = await userRepo.findOne({
        where: { id: userId },
        relations: ["bookings", "bookings.property"],
      });
    } else if (userRole === "owner" || userRole === "admin") {
      const ownerRepo = AppDataSource.getRepository(Owner);
      user = await ownerRepo.findOne({
        where: { id: userId },
        relations: [
          "properties",
          "properties.photos",
          "properties.description",
          "properties.policies",
        ],
      });
    } else {
      res.status(400).json({ error: "Invalid user role" });
      return;
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching selected user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
