import { NextApiResponse } from "next";
import withSession from "../../../lib/session";
import { ApiResult } from "../../../types/global";
import {useRouter} from "next/router";

export default withSession(async (req, res: NextApiResponse<ApiResult>) => {
    await req.session.destroy();
    res.redirect('/')
})