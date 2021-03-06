import { authenticatedAction } from "../../../../utils/api";
import { initDatabase } from "../../../../utils/mongodb";
import { getGroupInfo } from "../getGroupInfo/[code]";

export async function getGroupFreeTime(code) {
  const client = await initDatabase();
  const events = client.collection("events");

  let groupData = await getGroupInfo(code);

  const query = {
    userid: { $in: groupData[0].members },
  };

  return await events.find(query).toArray();
}

async function performAction(req, user) {
  const { code } = req.query;

  switch (req.method) {
    case "GET":
      return getGroupFreeTime(code);
  }
  throw { status: 405 };
}

export default authenticatedAction(performAction);
