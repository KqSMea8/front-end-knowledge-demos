import axios, {AxiosResponse} from "axios";
import {notification} from "antd";

async function Get(url: string, options?: any) {
    let resp = await axios.get(url, {
        headers: {"Content-Type": "application/json"},
        withCredentials: true,
        params: options,
    }).then(
        (response) => {
            return response;
        }
    );
    return resp;
}

async function Post(url: string, data: any, errHandler?: any) {
    let resp = await axios.post(url, `${JSON.stringify(data)}`, {
        headers: {"Content-Type": "application/json"},
        withCredentials: true
    });
    return resp;
}

async function Put(url: string, data?: any) {
    let param: any;
    if (data) {
        param = JSON.stringify(data);
    }
    let resp = await axios.put(url, param, {
        headers: {"Content-Type": "application/json"},
        withCredentials: true
    });
    return resp;
}

async function Delete(url: string, options?: any) {
    let resp = await axios.delete(url, {
        headers: {"Content-Type": "application/json"},
        withCredentials: true,
        params: options,
    });
    return resp;
}

function _errorHandler(err: any) {
        let resp = err.response;
        if (resp) {
            notification.error({
                message: resp.status,
                description: resp.data.message,
                duration: 10
            });
        } else {
            notification.error({message: "出错啦", description: err.message, duration: 10});
        }
}

function _httpCodeHandler(resp: AxiosResponse, url: string) {
    if (!resp || (resp.status < 200 || resp.status >= 300)) {
        if (resp.status == 401) {
            let callbackUrl = window.location.href;
            // TODO set different env
            window.location.href = `http://sso.elenet.me/sso/login?from=${encodeURIComponent(callbackUrl)}`;
        }
    }
}

export {Get, Post, Put, Delete, _errorHandler};
