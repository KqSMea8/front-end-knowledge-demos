import {observable} from "mobx";
import * as DiagramService from "../service/DiagramService";
import {dateToString} from "../constants/GlobalConstants";

export class DiagramStore {
    @observable public diagramData: any;
    @observable public refreshTime: any;

    public async getData() {
        let data = await DiagramService.getDiagramData();
        this.refreshTime = dateToString(new Date());
        if (data) {
           this.diagramData = data;
        }
    }
}