// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { I_User } from "../../components/Item";

export interface I_Vote {
  user: I_User;
}

export interface I_Item_Resp {
  id: string;
  title: string;
  votesCount: string;
  author: I_User;
  votes: I_Vote[];
}

interface ListingApiRequest {
  query: Partial<{ [key: string]: number }>;
}

export default async function handler(
  req: ListingApiRequest,
  res: NextApiResponse<I_Item_Resp[]>
) {
  const { page, per } = req.query;

  if (page === undefined || per === undefined) {
    res.status(403).end();
    return;
  }

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
      votes {
        user { 
          id
        }
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
