import { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  limit: 17, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  handler: (req: Request, res: Response) => {
    console.error("Too many request, sloow down");

    res.status(500).json({
      status: 429,
      payload: "Too many request, sloow down",
    });
  },
});
