// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SERVER } from '@/constants'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  bi_plot_pca_sorted: []
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const { bi_plot_pca_sorted } = await (
        await axios.get(`${SERVER.hostname}:${SERVER.port}/get_bi_plot_data?di=${req.query.di}`)
    ).data;
    res.status(200).json(bi_plot_pca_sorted);
}
