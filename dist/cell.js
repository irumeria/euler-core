var Cell = (function () {
    function Cell(x, y, concent) {
        this.width = 1;
        this.height = 1;
        this.concent = 0;
        this.AERA = 100000;
        this.neighbors = [];
        this.x = x;
        this.y = y;
        this.concent = concent;
    }
    Cell.prototype.setConcent = function (newConcent) {
        this.concent = newConcent;
    };
    Cell.prototype.getConcent = function () {
        return this.concent;
    };
    Cell.prototype.setNeighbors = function (newNeighbors) {
        this.neighbors = newNeighbors;
    };
    Cell.prototype.getNeighbors = function () {
        return this.neighbors;
    };
    Cell.prototype.addNeighbors = function (newNeighbors) {
        this.neighbors.push(newNeighbors);
        console.log("neib add!");
    };
    Cell.prototype.Move = function () {
        var ret = this.concent;
        for (var i = 0; i < this.neighbors.length; i++) {
            if (this.neighbors[i].type == "diffusion") {
                this.Diffusion(this.neighbors[i]);
            }
        }
        ret = this.concent - ret;
        return ret;
    };
    Cell.prototype.deliver_to_concent = function (neighbor, deliver) {
        console.log("in cell");
    };
    Cell.prototype.Diffusion = function (neighbor) {
        var len = (this.width + neighbor.Cell.width) / 2.0;
        var deliver = neighbor.k * (this.concent - neighbor.Cell.concent) / len * 0.01;
        console.log("deliver=", deliver);
        if (deliver > 0) {
            this.deliver_to_concent(neighbor, deliver);
        }
    };
    return Cell;
}());
export { Cell };
