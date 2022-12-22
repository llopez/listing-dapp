// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { I_User } from "../../components/Item";

export interface I_Item_Resp {
  id: string;
  title: string;
  votesCount: string;
  author: I_User;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<I_Item_Resp[]>
) {
  const { page, per } = req.query;

  const skip = per * page - per;

  const query = `
  {
    items(first: ${per}, skip: ${skip}, orderBy: votesCount, orderDirection: desc) {
      id
      title
      votesCount
      author {
        id
      }
    }
  }
`;

  const body = {
    query,
  };

  const resp = await fetch(process.env.NEXT_PUBLIC_SUBGRAPH_URL || "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const {
    data: { items },
  } = await resp.json();

  res.status(200).json(items);
}
