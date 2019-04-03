import * as React from "react";
import {observer} from "mobx-react";
import StoreManager from "../../store/StoreManager";
import {toJS} from "mobx";
import {Collapse, Table, Tag, Icon} from "antd";
import {get} from "lodash";
import {autobind} from "core-decorators";
import {dateToString} from "../../constants/GlobalConstants";
import "./details.css";

const Panel = Collapse.Panel;
const columns = [{
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: 200,
}, {
    title: "时间",
    key: "time",
    width: 300,
    render: record => (<span>{dateToString(new Date(record.time))}</span>)
}, {
    title: "Url",
    key: "url",
    render: record => (<span style={{color: record.status ? "green" : "red"}}>{record.url}</span>)
}, {
    title: "内容",
    dataIndex: "content",
    key: "content",
}];

interface DetailsProps {
    history?: any;
    match?: any;
    location: any;
    router: any;
}
interface DetailsStatus {

}

@observer
export default class Details extends React.Component<DetailsProps, DetailsStatus> {
    diagramStore;

    constructor(props: DetailsProps) {
        super(props);
        this.diagramStore = StoreManager.diagramStore;
        this.diagramStore.getData();
    }

    @autobind
    renderEzone(ezone: any) {
        let dataSource = [];
        ezone.clusters.map(e => {
            e.components.map( c => {
                dataSource.push(
                    {
                        key: c.url,
                        name: ezone.name + "_" + e.name,
                        url: c.url,
                        time: c.lastUpdateTimestamp,
                        content: c.content,
                        status: c.status
                    }
                );
            });
        });
        return (
            <Table columns={columns} dataSource={dataSource} pagination={false}/>
        );
    }

    render() {
        let id = get(this.props.match, "params.id", "");
        let data = toJS(this.diagramStore.diagramData);

        if (data) {
            let ezone = data[id].ezone ? data[id].ezone : [];
            if (data[id].status === false) {
                ezone.sort((a, b) => { if (a.status > b.status) {return 1; } else {return -1; } });
            }
            let url = "";
            if (window && (window as any).CONFIG) {
                url = (window as any).CONFIG[id] as string;
            }
            return (
                <div className="detail-wrap">
                    <div className="detail-header">
                        <a href={url} target="_blank" className="detail-title-link"><Icon type="link" /></a>
                        <a href={url} className="detail-title">{id}</a>
                        <Tag color="gold" className="refresh-time"> 数据刷新时间：{this.diagramStore.refreshTime}</Tag>
                    </div>
                    <div>
                        <Collapse bordered={false}>
                            {
                                ezone.map(e => {
                                    let header = <div style={{color: e.status ? "green" : "red"}}>
                                        {e.name}
                                        <span className="ezone-title">健康数：{e.healthCount}</span>
                                        <span className="ezone-title">不健康数：{e.instanceCount - e.healthCount}</span>
                                    </div>;
                                    return (
                                        <Panel
                                            key={e.name}
                                            header={header}
                                        >
                                            {
                                                this.renderEzone(e)
                                            }
                                        </Panel>
                                    );
                                })
                            }
                        </Collapse>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}