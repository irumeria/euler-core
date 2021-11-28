import { Cell } from "./cell.js"

interface Neighbors {
    k: number
    Cell: Cell
    type: string
}
export class Masscell extends Cell {

    /**
    * calculate how the deliver content will affect concentration
    * 
    * for heat transfer , concent is temperature, deliver is heat
    * 
    * for mass transfer , both concent and deliver are mass/volumn
    * @param neighbor a neighbor cell
    * @param deliver the deliver amount
    */
    deliver_to_concent(neighbor: Neighbors, deliver: number) {
        console.log("before:",this.concent);
        this.concent -= deliver;
        neighbor.Cell.concent += deliver;
        console.log("after:",this.concent);
        // console.log("in masscell")
    }
}