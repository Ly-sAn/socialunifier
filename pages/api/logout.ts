import { NextApiResponse } from "next";
import withSession from "../../lib/session";
import { ApiResult } from "../../types/global";

export default withSession(async (req, res: NextApiResponse<ApiResult>) => {
    await req.session.destroy();
    res.json({ success: true })
})