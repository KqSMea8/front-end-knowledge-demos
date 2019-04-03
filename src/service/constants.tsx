function getApi() {
    let env = "alpha";
    let url = "";
    if (window && (window as any).CONFIG) { // tslint:disable-line
        env = (window as any).CONFIG.ENV as string;  // tslint:disable-line
        console.log("SuperVisor ENV: ", (window as any).CONFIG.ENV);   // tslint:disable-line
    }
    env = "prod";
    switch (env) {
        case "test":
            url = "https://trace-monitor.alpha.elenet.me";
            break;
        case "alpha":
            url = "https://trace-monitor.alpha.elenet.me";
            break;
        case "beta":
            url = "https://trace-monitor.alta.elenet.me";
            break;
        case "prod":
            url = "https://trace-monitor.elenet.me";
            break;
        default:
            url = "https://trace-monitor.elenet.me";
    }
    return url;
}
export const GetApi = getApi();