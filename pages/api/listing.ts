// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { I_Item } from "../../components/Item";

const query = `
      {
        items {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<I_Item[]>
) {
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
