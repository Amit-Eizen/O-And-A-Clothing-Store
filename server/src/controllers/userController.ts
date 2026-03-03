import { Request, Response } from "express";
import { BaseController } from "./baseController";
import userService from "../services/userService";
import { UPLOADS_PATH } from "../middleware/uploadMiddleware";

interface AuthRequest extends Request {
    userId?: string;
}

class UserController extends BaseController {
    constructor() {
        super(userService);
    }

    async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const user = await userService.getProfile(req.userId!);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Error retrieving profile" });
        }
    }

    async updateProfile(req: AuthRequest, res: Response): Promise<void> {
       try {
            const profileImage = req.file
                ? `${UPLOADS_PATH}/${req.file.filename}`
                : undefined;

            const user = await userService.updateProfile(req.userId!, {
                ...req.body,
                profileImage
            });

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Error updating profile" });
        }
    }

    async getProfileNameAndImage(req: Request, res: Response): Promise<void> {
        try {
            const user = await userService.getProfileNameAndImage(String(req.params.id));
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: "Error retrieving profile" });
        }
    }
}

export default new UserController();