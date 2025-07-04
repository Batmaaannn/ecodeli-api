import { Client, SendEmailV3_1 } from "node-mailjet";
import config from "src/config";
import { AgentType } from "src/types/user";

const mailjet = new Client({
  apiKey: config.email.key_api,
  apiSecret: config.email.key_pass || "ICI le mdp",
});

enum EmailTemplates {
  REGISTRATION_REQUEST = 5564516,
}

const DEFAULT_EMAIL = "stainvy@gmail.com";
const DEFAULT_NAME = "Ecodeli";

export const sendRegistrationRequest = async ({
  tokenRequest,
  fullName,
  agentType,
  email,
  phone,
}: {
  tokenRequest: string;
  fullName: string;
  agentType: AgentType;
  email: string;
  phone: string;
}) => {
  const data: SendEmailV3_1.Body = {
    Messages: [
      {
        From: {
          Email: DEFAULT_EMAIL,
          Name: DEFAULT_NAME,
        },
        To: [
          {
            Email: DEFAULT_EMAIL,
          },
        ],
        Subject: "Nouvelle demande d'inscription",
        TemplateID: EmailTemplates.REGISTRATION_REQUEST,
        TemplateLanguage: true,
        TemplateErrorReporting: {
          Email: DEFAULT_EMAIL,
          Name: DEFAULT_NAME,
        },
        Variables: {
          fullName,
          email,
          phone,
          agentType,
          tokenRequest,
        },
      },
    ],
  };
  try {
    await mailjet.post("send", { version: "v3.1" }).request(data);
    console.log(
      `[EMAILS]: request registration email sent with success to ${email}`
    );
  } catch (e) {
    console.error(e.response.body.errors);
  }
};
