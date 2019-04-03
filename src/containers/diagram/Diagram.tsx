import * as React from "react";
import {autobind} from "core-decorators";
import Graph from "react-graph-vis";
import "./diagram.css";
import {Router, withRouter} from "react-router-dom";
import StoreManager from "../../store/StoreManager";
import {observer} from "mobx-react";
import {toJS} from "mobx";

interface DiagramProps {
    history: any;
}

interface DiagramState {
    data: any;
    currentNum: number;
    showPage: boolean;
}

@observer
export default class Diagram extends React.Component<DiagramProps, DiagramState> {
    diagramInterval;
    diagramStore;
    showContact = false;
    showNoDataContact = false;
    error;
    nodePoints = ["Collector", "Kafka", "LinDB", "Shaka", "Zookeeper", "ERROR"];
    private network;

    constructor(props: DiagramProps) {
        super(props);
        this.diagramStore = StoreManager.diagramStore;
        this.state = {
            data: null,
            currentNum: 10,
            showPage: false, // solve the problem that the initial load has no data to display without data content
        };
    }

    componentDidMount() {
        this.getData();
        this.diagramInterval = setInterval(this.getData, 10000);
        setInterval(this.getCurrentNum, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.diagramInterval);
    }

    @autobind
    async getData() {
        await this.diagramStore.getData();
        this.setState({showPage: true});
    }

    @autobind
    getCurrentNum() {
        if (this.state.currentNum > 1) {
            this.setState({currentNum: this.state.currentNum - 1});
        } else {
            this.setState({currentNum: 10});
        }
    }

    @autobind
    initNetworkInstance(networkInstance: any) {
        this.network = networkInstance;
        this.network.redraw();
    }

    @autobind
    getNodes() {
        let nodes = [];
        let data = toJS(this.diagramStore.diagramData);
        let statusArr = [];
        this.nodePoints.map(e => {
            let [x, y] = [0, -300];
            switch (e) {
                case "Collector":
                    x = -600;
                    break;
                case "Kafka":
                    x = -200;
                    break;
                case "Shaka":
                    x = 200;
                    break;
                case "LinDB":
                    x = 600;
                    break;
                case "Zookeeper":
                    x = 0;
                    y = 160;
                    break;
                case "ERROR":
                    this.error = data.ERROR ? data.ERROR.ERROR : null;
                    break;
                default:
                    break;
            }
            let node = null;
            if (e !== "ERROR") {
                if (data && data[e]) {
                    let ezoneData = data[e].ezone.sort((a, b) => {
                        if (a.name > b.name) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                    let ezoneDesc = "";
                    if (ezoneData) {
                        ezoneData.map(ezone => {
                            let unHealth = ezone.instanceCount - ezone.healthCount;
                            if (ezone.status) {
                                statusArr.push(1);
                                return ezoneDesc = ezoneDesc + ezone.name + " " +
                                    "实例数: " + ezone.instanceCount + " " +
                                    "不健康数: " + unHealth + "\n\n";
                            } else {
                                statusArr.push(-1);
                                return ezoneDesc =
                                    ezoneDesc +
                                    `<i>${ezone.name} 实例数: ${ezone.instanceCount} 不健康数: ${unHealth}</i>\n\n`;
                            }
                        });
                    }
                    let label = `<b>${e}</b>\n\n` + ezoneDesc;
                    node = {
                        x: x, y: y, id: e, label: label,
                        font: {multi: "html", color: data[e].status ? "#fff" : "#57b957"},
                        color: {
                            border: data[e].status ? "#57b957" : "red",
                            background: data[e].status ? "#57b957" : "#fff",
                        },
                    };
                    this.showContact = statusArr.indexOf(-1) > -1 ? true : false;
                    this.showNoDataContact = false;
                    nodes.push(node);
                } else {
                    let label = e;
                    node = {
                        x: x, y: y, id: e, label: label,
                        color: {
                            border:  "red" ,
                            background: "red",
                        },
                    };
                    this.showNoDataContact = true;
                    nodes.push(node);
                }
            }
        });
        return nodes;
    }

    @autobind
    getEdges() {
        let edges = [
            {from: "Kafka", to: "Zookeeper"},
            {from: "Kafka", to: "Shaka"},
            {from: "Collector", to: "Kafka"},
            {from: "Shaka", to: "LinDB"},
            {from: "Shaka", to: "Kafka"},
            {from: "LinDB", to: "Zookeeper"},
            {from: "Collector", to: "Zookeeper"},
        ];
        return edges;
    }

    @autobind
    getGraph() {
        const nodes = this.getNodes();
        const edges = this.getEdges();
        return {nodes: nodes, edges: edges};
    }

    render() {
        const options = {
            autoResize: false,
            height: "100%",
            width: "100%",
            locale: "en",
            clickToUse: true,
            edges: {
                arrows: {
                    to: {enabled: true, scaleFactor: 0.5, type: "arrow"},
                },
                color: {
                    color: "green",
                    highlight: "green",
                    hover: "green",
                }
            },
            interaction: {
                hideEdgesOnDrag: false,
                hideNodesOnDrag: false,
                hover: true,
                keyboard: {
                    enabled: true,
                    speed: {x: 10, y: 10, zoom: 0.02},
                    bindToWindow: true
                },
                navigationButtons: true,
                selectable: true,
                selectConnectedEdges: false,
                tooltipDelay: 300,
                zoomView: true
            },
            physics: {
                enabled: false,
                solver: "hierarchicalRepulsion",
            },
            nodes: {
                shape: "box",
                borderWidth: 1,
                borderWidthSelected: 2,
                widthConstraint: {
                    minimum: 200
                },
                heightConstraint: {
                    minimum: 90
                },
                font: {
                    color: "#fff",
                    ital: {
                        color: "red",
                    }
                }
            },
        };
        let events = {
            select: (event: any) => {
                let {nodes} = event;
                if (nodes[0]) {
                    this.props.history.push("/details/" + nodes[0]);
                }
            },
            hoverNode: () => {
                document.getElementsByClassName("vis-network")[0]
                    .getElementsByTagName("canvas")[0].style.cursor = "pointer";
            },
            blurNode: () => {
                document.getElementsByClassName("vis-network")[0]
                    .getElementsByTagName("canvas")[0].style.cursor = "pointer";
            }
        };

        const contacts = new Map([["Collector", {
            key: "Collector",
            component: "Collector",
            name: "朱杰",
            mobile: "15921075537"
        }], ["Shaka", {
            key: "Shaka",
            component: "Shaka",
            name: "夏天亮",
            mobile: "18202119005"
        }], ["LinDB", {
            key: "LinDB",
            component: "LinDB",
            name: "李刚",
            mobile: "18801951350"
        }], ["Zookeeper", {
            key: "Zookeeper",
            component: "Zookeeper",
            name: "李刚",
            mobile: "18801951350"
        }], ["Kafka", {
            key: "Kafka",
            component: "Kafka",
            name: "李尊",
            mobile: "17621860274"
        }], ["WatchDog", {
            key: "WatchDog",
            component: "WatchDog",
            name: "肖政",
            mobile: "17621158824"
        }]]);
        let diagramData = toJS(this.diagramStore.diagramData);

        return (
            <div className="diagram-wrap">
                <div className="diagram-title-wrap">
                    <p className="diagram-title">监控关键组件健康面板</p>
                    <div className="diagram-time-wrap">
                        后台数据每分钟刷新一次，距离下次页面刷新<span className="diagram-time">{this.state.currentNum}</span>秒
                    </div>

                    <div className="contact-wrap" style={{display: this.showContact ? "block" : "none"}}>
                        <h5 className="contact-title">出错组件联系人</h5>
                        {
                            diagramData && this.nodePoints.map(e => {
                                if (diagramData[e] && !diagramData[e].status) {
                                    if (contacts.get(e)) {
                                        let current = contacts.get(e);
                                        return (
                                            <div className="contact-item" key={current.key}>
                                                <span>{current.component}</span>
                                                <span>{current.name}</span>
                                                <span>{current.mobile}</span>
                                            </div>
                                        );
                                    }
                                }
                            })
                        }
                    </div>

                    <div className="contact-wrap" style={{display: this.showNoDataContact ? "block" : "none"}}>
                        <h5 className="contact-title-no-data">接口出错请联系:李尊 17621860274</h5>
                    </div>

                    <div className="contact-wrap" style={{display: this.error ? "block" : "none"}}>
                        <h5 className="contact-title-no-data">接口出错请联系:李尊 17621860274</h5>
                        <div>
                            {this.error}
                        </div>
                    </div>

                    <div className="clear"/>
                </div>
                <div className="diagram-graph">
                    {
                        this.state.showPage && <Graph
                            key="hasNode"
                            graph={this.getGraph()}
                            options={options}
                            events={events}
                            getNetwork={this.initNetworkInstance}
                        />
                    }
                </div>
            </div>
        );
    }
}