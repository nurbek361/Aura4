import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(express.json());

// Placeholder health check. This service is a skeleton for the future
// cloud-sync backend described in README.md — no sync endpoints are
// implemented yet, and no user data is accepted or stored here.
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "@workspace/api-server" });
});

app.listen(port, () => {
  console.log(`api-server listening on port ${port}`);
});
