import { Masscell } from "./masscell.js";
import { Cell } from "./cell.js";

/**
 * borders options
 * 
 * minmax: 1 --  max_border, 0 --- min_border
 * 
 * x,y: indicate the position of the cell (x0,y0)
 * 
 * type: type of the border
 * 1: Adiabatic 2:Thermostatic 3:Diffusion( defult:k=0.8 ) 4:Convective( default:a=0.8 )
 * 
 * option: optional parameters for border_type
 * 
 * borders like: x/x0 + y/y0 < 1(max_border) or > 1(min_border)
 */
interface border_options {
    minmax: number,
    x: number,
    y: number,
    type: number,
    option: {
        k: number, // type 3
        a: number, // type 4
        concent: number, // type 2
        concent_env: number // type 3
    }

}
export class Euler {

    // set the global variables
    /**
     * ===========================================================
     */
    MAX_CELL_NUM_X: number = 12;
    MAX_CELL_NUM_Y: number = 12;
    CELL_WIDTH: number = 1;
    CELL_HEIGHT: number = 1;
    TIME_UNIT: number = 1; // ms
    K: number = 0.8; // conductivity ( W/mC )
    TRANSFER_TYPE = "mass";

    BORDER_RULES: border_options[] = [{ "minmax": 1, "x": 1 / 10, "y": 0, "type": 3, "option": { "k": 0.04, "concent_env": 100, a: undefined, concent: undefined } }, { "minmax": 1, "x": 0, "y": 1 / 10, "type": 3, "option": { "k": 0.04, "concent_env": 100, a: undefined, concent: undefined } }];
    /**
     * ===========================================================
     */

    // mode setting
    RAMDOM: boolean = true


    cells_map: Cell[][] = []; //  the squral map of cells
    cells_chains: Cell[] = []; // the activated cells

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    lossyEqual(a, b, epsilon = 1E-05) {
        return Math.abs(a - b) < epsilon;
    }
    /**
     * 
     * @param x posotion x of the cell
     * @param y position y of the cell
     * @returns if the position is in the borders
     */
    if_in_borders(x: number, y: number): boolean {
        let ret: boolean;
        for (let i = 0; i < this.BORDER_RULES.length; i++) {
            let z = this.BORDER_RULES[i].x * x + this.BORDER_RULES[i].y * y;
            if (this.BORDER_RULES[i].minmax == 0) {
                if (z >= 1) {
                    ret = true;
                } else {
                    ret = false;
                }
            } else if (this.BORDER_RULES[i].minmax == 1) {
                if (z <= 1) {
                    ret = true;
                } else {
                    ret = false;
                }
            } else {
                console.log("error borders param0");
                ret = false;
            }
        }
        return ret;
    }

    /**
     * generate the cells in borders
     */
    generate_cells(): void {
        // pattern:
        // cells know where it is
        // cells know who their neighbors is
        for (let i = 0; i < this.MAX_CELL_NUM_X; i++) {
            this.cells_map.push([]);
            for (let j = 0; j < this.MAX_CELL_NUM_Y; j++) {

                // generate a cell
                if (this.RAMDOM) {
                    let ram_concent: number = Math.random() * 1000;
                    this.cells_map[i].push(new Cell(i, j, ram_concent));
                } else {
                    // to be continue ... 
                }

                //test if the posotion is in the borders
                if (!this.if_in_borders(i, j)) {
                    // console.log("("+i,j+") is not in border");
                    continue;
                }

                // link the cell with its neighbors
                let neighbors = [];
                if (i - 1 > 0 && this.if_in_borders(i - 1, j + 1)) {
                    neighbors.push({ "k": this.K, "Cell": this.cells_map[i - 1][j], "type": "diffusion" });
                    this.cells_map[i - 1][j].addNeighbors({ "k": this.K, "Cell": this.cells_map[i][j], "type": "diffusion" });
                }
                if (j - 1 > 0 && this.if_in_borders(i - 1, j - 1)) {
                    neighbors.push({ "k": this.K, "Cell": this.cells_map[i][j - 1], "type": "diffusion" });
                    this.cells_map[i][j - 1].addNeighbors({ "k": this.K, "Cell": this.cells_map[i][j], "type": "diffusion" });
                }
                this.cells_map[i][j].setNeighbors(neighbors);
                this.cells_chains.push(this.cells_map[i][j]);

            }
            console.log("length of cells row-" + i + ":" + this.cells_chains.length);
        }
    }

    /**
     * generate mass cells in borders
     */
    generate_mass_cells(): void {
        // pattern:
        // cells know where it is
        // cells know who their neighbors is
        for (let i = 0; i < this.MAX_CELL_NUM_X; i++) {
            this.cells_map.push([]);
            for (let j = 0; j < this.MAX_CELL_NUM_Y; j++) {

                // generate a cell
                if (this.RAMDOM) {
                    let ram_concent: number = Math.random() * 1000;
                    this.cells_map[i].push(new Masscell(i, j, ram_concent));
                } else {
                    // to be continue ... 
                }

                //test if the posotion is in the borders
                if (!this.if_in_borders(i, j)) {
                    this.cells_map[i][this.cells_map[i].length - 1].setConcent(-1);
                    // console.log("("+i,j+") is not in border");
                    continue;
                }

                // link the cell with its neighbors
                let neighbors = [];
                if (i - 1 >= 0 && this.if_in_borders(i - 1, j + 1)) {
                    neighbors.push({ "k": this.K, "Cell": this.cells_map[i - 1][j], "type": "diffusion" });
                    this.cells_map[i - 1][j].addNeighbors({ "k": this.K, "Cell": this.cells_map[i][j], "type": "diffusion" });
                }
                if (j - 1 >= 0 && this.if_in_borders(i - 1, j - 1)) {
                    neighbors.push({ "k": this.K, "Cell": this.cells_map[i][j - 1], "type": "diffusion" });
                    this.cells_map[i][j - 1].addNeighbors({ "k": this.K, "Cell": this.cells_map[i][j], "type": "diffusion" });
                }
                this.cells_map[i][j].setNeighbors(neighbors);
                this.cells_chains.push(this.cells_map[i][j]);

            }
            console.log("length of cells row-" + i + ":" + this.cells_chains.length);
        }
    }
    /**
     * execute the border rule
     */
    border_move_all() {
        for (let i = 0; i < this.BORDER_RULES.length; i++) {
            if (this.BORDER_RULES[i].type == 1) { // Adiabatic
                continue;
            } else if (this.BORDER_RULES[i].type == 2) { // Thermostatic
                for (let j = 0; j < this.cells_chains.length; j++) {
                    if (this.lossyEqual(this.BORDER_RULES[i].x * this.cells_chains[j].x + this.BORDER_RULES[i].y * this.cells_chains[j].y, 1)) {
                        this.cells_chains[j].concent = this.BORDER_RULES[i].option.concent;
                    }
                }
            } else if (this.BORDER_RULES[i].type == 3) { // Diffusion
                for (let j = 0; j < this.cells_chains.length; j++) {
                    if (this.lossyEqual(this.BORDER_RULES[i].x * this.cells_chains[j].x + this.BORDER_RULES[i].y * this.cells_chains[j].y, 1)) {
                        let tempCell: Cell = new Cell(-1, -1, this.BORDER_RULES[i].option.concent_env);
                        let deliver: number = this.BORDER_RULES[i].option.k * (this.cells_chains[j].concent - tempCell.concent);
                        // console.log(this.cells_chains[j].concent);
                        this.cells_chains[j].deliver_to_concent({ "k": -1, "Cell": tempCell, "type": "diffusion" }, deliver);
                        // console.log(this.cells_chains[j].concent);
                        // console.log("============")
                    }
                }
            }
        }
    }

    constructor() {
    }

    /**
     * print cells concentration
     * 
     * only active in node env
     */
    print_cells_map(): void {
        process.stdout.write("---\n");
        for (let i = 0; i < this.cells_map.length; i++) {
            process.stdout.write("|\t");
            for (let j = 0; j < this.cells_map[0].length; j++) {
                process.stdout.write(this.cells_map[i][j].concent.toFixed(1) + "\t");
            }
            process.stdout.write(" |\n");
        }
        process.stdout.write("---\n");
    }
    /**
     * debug the model
     */
    async run_test() {
        if (this.TRANSFER_TYPE == "mass") {
            this.generate_mass_cells();
        }
        let turn: number = 0;
        while (1) {
            turn++;
            for (let i = 0; i < this.cells_chains.length; i++) {
                this.cells_chains[i].Move();
            }
            for(let i = 0; i < this.BORDER_RULES.length;i++){
                this.border_move_all();
            }
            // console.log("===================");
            await this.sleep(10);
            if (turn % 200 == 0) {
                console.log("turn:", turn);
                this.print_cells_map();
            }
        }
    }
    async run() {
        if (this.TRANSFER_TYPE == "mass") {
            this.generate_mass_cells();
        }
        let turn: number = 0;
        while (1) {
            turn++;
            for (let i = 0; i < this.cells_chains.length; i++) {
                this.cells_chains[i].Move();
            }
            await this.sleep(10);
        }
    }

}