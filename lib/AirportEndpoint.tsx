// pages/api/airports.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(
      'https://api.aviationstack.com/v1/airports?access_key=3aa6ce0efc925722eab6d7bb62d4f219'
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch airports" });
  }
}
