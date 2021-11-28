import { Cell } from "./cell.js"
interface Neighbors { 
    k:number 
    Cell:Cell
    type:string
}
export class Heatcell extends Cell {
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

    }
}