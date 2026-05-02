import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const AUTH_PAYLOAD = {
  email: "rc2443@srmist.edu.in",
  name: "rajat chattopadhyay",
  rollNo: "ra2311027010057",
  accessCode: "QkbpxH",
  clientID: "6abd4145-37d7-4dbf-8f54-16e290b1e8ba",
  clientSecret: "vmmfGsfzfgETsmGB",
  gitversion: "20.10.20",
};

const BASE_URL = "http://20.207.122.201/evaluation-service";

let cachedToken: string | null = null;

async function getToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  const res = await axios.post(`${BASE_URL}/auth`, AUTH_PAYLOAD);
  cachedToken = res.data.access_token;
  return cachedToken!;
}

app.get("/notifications", async (req, res) => {
  try {
    const token = await getToken();
    const { limit, page, notification_type } = req.query;

    const response = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit, page, notification_type },
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});