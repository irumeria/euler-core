interface Neighbors { 
    k:number 
    Cell:Cell
    type:string
}

export class Cell {
    width:number = 1 // um
    height:number = 1 // um
    concent:number = 0;// temperature or concentration of mass
    AERA:number = 100000; // mm^2
    x:number;
    y:number;
    neighbors:Neighbors[] = [];// element:{conductivity, neighbor_cell}
    constructor(x:number, y:number, concent:number) {
        this.x = x;
        this.y = y;
        this.concent = concent;
    }
    
    setConcent(newConcent:number):void{
        this.concent = newConcent;
    }

    getConcent():number{
        return this.concent;
    }

    setNeighbors(newNeighbors:Neighbors[]):void{
        this.neighbors = newNeighbors;
    }

    getNeighbors(){
        return this.neighbors;
    }

    addNeighbors( newNeighbors:Neighbors ){
        this.neighbors.push(newNeighbors);
        // console.log("neib add!");
    }
    
    /**
     * the behavor of a cell in each turn
     * @returns the amount of concent it lost
     */
    Move():number{
        let ret:number = this.concent;
        for(let i = 0;i <this.neighbors.length;i++){
            if(this.neighbors[i].type == "diffusion"){
                this.Diffusion(this.neighbors[i]);
            }
        }
        ret = this.concent - ret; // the delta concentration
        return ret;
    }

    /**
     * calculate how the deliver content will affect concentration
     * 
     * for heat transfer , concent is temperature, deliver is heat
     * 
     * for mass transfer , both concent and deliver are mass/volumn
     * @param neighbor a neighbor cell
     * @param deliver the deliver amount
     */
    deliver_to_concent(neighbor:Neighbors,deliver:number){
        // should be implemented by the child class
        // console.log("in cell")
    }

    /**
     * calculate the deliver amount among this cell and neighbor cell
     * 
     * under the duffusion condision
     * @param neighbor a neighbor cell
     */
    Diffusion(neighbor:Neighbors){
        let len:number = (this.width+neighbor.Cell.width)/2.0;
        let deliver:number = neighbor.k*(this.concent - neighbor.Cell.concent)/len*0.01;
        // console.log("deliver=",deliver);
        if(deliver > 0){
            this.deliver_to_concent(neighbor,deliver);
        }
        
    }
}