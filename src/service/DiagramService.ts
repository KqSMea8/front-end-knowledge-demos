import * as API from "../utils/api";
import {GetApi} from "./constants";
import {notification} from "antd";

export async function getDiagramData() {
    let url = GetApi + "/applications/all";
    try {
        let resp = await API.Get(url);
        return resp.data;
    } catch (e) {
        API._errorHandler(e);
        notification.error({message: "结果返回异常，请联系李尊 17621860274", duration: 15});
    }
}