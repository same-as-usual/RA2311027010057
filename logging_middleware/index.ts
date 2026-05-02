import axios from "axios";

type Stack = "frontend" | "backend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
  | "api" | "component" | "hook" | "page" | "state" | "style"
  | "auth" | "config" | "middleware" | "utils" | "cache"
  | "controller" | "cron_job" | "db" | "domain" | "handler"
  | "repository" | "route" | "service";

const LOG_API = "http://20.207.122.201/evaluation-service/logs";
const AUTH_API = "http://20.207.122.201/evaluation-service/auth";

const AUTH_PAYLOAD = {
  email: "rc2443@srmist.edu.in",
  name: "rajat chattopadhyay",
  rollNo: "ra2311027010057",
  accessCode: "QkbpxH",
  clientID: "6abd4145-37d7-4dbf-8f54-16e290b1e8ba",
  clientSecret: "vmmfGsfzfgETsmGB",
  gitversion: "20.10.20"
};

let cachedToken: string | null = null;

async function getToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  const res = await axios.post(AUTH_API, AUTH_PAYLOAD);
  cachedToken = res.data.access_token;
  return cachedToken!;
}

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  try {
    const token = await getToken();
    await axios.post(
      LOG_API,
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Logging failed:", error);
  }
}