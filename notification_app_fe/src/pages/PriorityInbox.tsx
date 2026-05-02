import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Slider,
} from "@mui/material";
import { fetchNotifications, getPriorityInbox, type Notification } from "../api/notifications.ts";
import { Log } from "logging_middleware";

const TYPE_COLORS: Record<string, "success" | "warning" | "info"> = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};

function PriorityInbox() {
  const [all, setAll] = useState<Notification[]>([]);
  const [topN, setTopN] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNotifications()
      .then((data) => {
        setAll(data);
        Log("frontend", "info", "page", "priority inbox page loaded");
      })
      .catch(() => {
        Log("frontend", "error", "page", "failed to load priority inbox");
      })
      .finally(() => setLoading(false));
  }, []);

  const priority = getPriorityInbox(all, topN);

  function handleView(id: string) {
    setViewed((prev) => new Set(prev).add(id));
    Log("frontend", "info", "page", `priority notification ${id} viewed`);
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={1}>
        Priority Inbox
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Showing top {topN} notifications ranked by type priority and recency.
      </Typography>

      <Box sx={{ mb: 4, maxWidth: 400 }}>
        <Typography variant="body2" mb={1}>
          Show top {topN} notifications
        </Typography>
        <Slider
          min={5}
          max={20}
          step={5}
          value={topN}
          onChange={(_, val) => setTopN(val as number)}
          marks={[
            { value: 5, label: "5" },
            { value: 10, label: "10" },
            { value: 15, label: "15" },
            { value: 20, label: "20" },
          ]}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {priority.map((n, index) => (
            <Card
              key={n.ID}
              variant="outlined"
              onClick={() => handleView(n.ID)}
              sx={{
                cursor: "pointer",
                opacity: viewed.has(n.ID) ? 0.6 : 1,
                borderLeft: viewed.has(n.ID)
                  ? "4px solid #ccc"
                  : "4px solid #1976d2",
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      variant="caption"
                      sx={{
                        background: "#1976d2",
                        color: "#fff",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Typography fontWeight={viewed.has(n.ID) ? 400 : 600}>
                      {n.Message}
                    </Typography>
                  </Box>
                  <Chip
                    label={n.Type}
                    color={TYPE_COLORS[n.Type]}
                    size="small"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                  {new Date(n.Timestamp).toLocaleString()}
                  {viewed.has(n.ID) ? "  · viewed" : "  · new"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default PriorityInbox;