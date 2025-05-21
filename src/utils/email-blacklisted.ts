import { HttpException, HttpStatus } from "@nestjs/common";
import axios from "axios";
import _memoize from "lodash/memoize";
import config from "../config";
import { Environments } from "../types/environments";

const blacklistedDomains =
  "https://raw.githubusercontent.com/martenson/disposable-email-domains/master/disposable_email_blocklist.conf";

export const fetchMailsBlacklist = _memoize(async () => {
  const res: { data: string; status: number } =
    await axios.get(blacklistedDomains);
  if (res.status === 200) {
    return res.data.split("\n");
  } else {
    return [];
  }
});

export async function isBlacklisted(email: string): Promise<void> {
  const authorizedBlacklistEmails = [Environments.PROD];
  if (authorizedBlacklistEmails.indexOf(config.environment as Environments))
    return;

  const emailParts = email.split("@");
  const domain = emailParts[1];
  const blackList = await fetchMailsBlacklist();
  if (blackList.includes(domain)) {
    throw new HttpException("Blacklisted domain", HttpStatus.FORBIDDEN);
  }
}
