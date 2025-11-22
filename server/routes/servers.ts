import { RequestHandler } from "express";
import { getServersList } from "../utils/r2-storage";
import { ServersResponse } from "@shared/api";

export const handleGetServers: RequestHandler = async (req, res) => {
  try {
    const servers = await getServersList();
    servers.sort();

    const response: ServersResponse = { servers };
    res.json(response);
  } catch (error) {
    console.error("Error getting servers:", error);
    res.status(500).json({ error: "Failed to retrieve servers" });
  }
};
