import axios from "axios";
import { Log } from "logging_middleware";

const BASE_URL = "/api";

const AUTH_PAYLOAD = {
  email: "rc2443@srmist.edu.in",
  name: "rajat chattopadhyay",
  rollNo: "ra2311027010057",
  accessCode: "QkbpxH",
  clientID: "6abd4145-37d7-4dbf-8f54-16e290b1e8ba",
  clientSecret: "vmmfGsfzfgETsmGB",
  gitversion: "20.10.20",
};

let token: string | null = null;

export async function getToken(): Promise<string> {
  if (token) return token;
  const res = await axios.post(`${BASE_URL}/auth`, AUTH_PAYLOAD);
  token = res.data.access_token;
  Log("frontend", "info", "api", "auth token fetched successfully");
  return token!;
}

export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function scoreNotification(n: Notification): number {
  const ageInSeconds =
    (Date.now() - new Date(n.Timestamp).getTime()) / 1000;
  return TYPE_WEIGHT[n.Type] * 1000 + 1 / (ageInSeconds + 1);
}

export async function fetchNotifications(): Promise<Notification[]> {
  try {
    const t = await getToken();
    const res = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    Log("frontend", "info", "api", "notifications fetched successfully");
    return res.data.notifications;
  } catch (err) {
    Log("frontend", "error", "api", "failed to fetch notifications");
    throw err;
  }
}

export function getPriorityInbox(
  notifications: Notification[],
  n: number = 10
): Notification[] {
  return [...notifications]
    .sort((a, b) => scoreNotification(b) - scoreNotification(a))
    .slice(0, n);
}