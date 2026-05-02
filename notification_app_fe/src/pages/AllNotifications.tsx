import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Chip,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
} from "@mui/material";
import { fetchNotifications, type Notification } from "../api/notifications.ts";
import { Log } from "logging_middleware";

const TYPE_COLORS: Record<string, "success" | "warning" | "info"> = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};

function AllNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNotifications()
      .then((data) => {
        setNotifications(data);
        Log("frontend", "info", "page", "all notifications page loaded");
      })
      .catch(() => {
        Log("frontend", "error", "page", "failed to load all notifications");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "All"
      ? notifications
      : notifications.filter((n) => n.Type === filter);

  function handleView(id: string) {
    setViewed((prev) => new Set(prev).add(id));
    Log("frontend", "info", "page", `notification ${id} marked as viewed`);
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        All Notifications
      </Typography>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, val) => val && setFilter(val)}
        sx={{ mb: 3 }}
        size="small"
      >
        {["All", "Placement", "Result", "Event"].map((type) => (
          <ToggleButton key={type} value={type}>
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.map((n) => (
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
                  <Typography fontWeight={viewed.has(n.ID) ? 400 : 600}>
                    {n.Message}
                  </Typography>
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

export default AllNotifications;