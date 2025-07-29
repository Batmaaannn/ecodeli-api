import { NextFunction, Request, Response } from "express";
import { UAParser } from "ua-parser-js";

export async function RouteLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on("close", () => {
    const duration = Date.now() - start;
    const userAgent = UAParser(req.headers["user-agent"]);
    const os =
      userAgent.os.name || userAgent.os.version
        ? `${userAgent.os.name} ${userAgent.os.version}`
        : "Mobile";
    const device = userAgent.device.type || "";
    const browser = userAgent.browser.name || "";

    console.log(
      `${os} ${device} ${browser} : ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
}
