import { NextApiResponse } from "next";
import withSession from "../../lib/session";
import { ApiResult } from "../../types/gobal";

export default withSession(async (req, res: NextApiResponse<ApiResult>) => {
    await req.session.destroy();
    res.json({success: false})
})