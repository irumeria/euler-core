var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Masscell } from "./masscell.js";
import { Cell } from "./cell.js";
var Euler = (function () {
    function Euler() {
        this.MAX_CELL_NUM_X = 10;
        this.MAX_CELL_NUM_Y = 1;
        this.CELL_WIDTH = 1;
        this.CELL_HEIGHT = 1;
        this.TIME_UNIT = 1;
        this.K = 0.8;
        this.TRANSFER_TYPE = "mass";
        this.BORDER_RULES = [[1, 1 / 9, 0], [1, 0, 1 / 2]];
        this.RAMDOM = true;
        this.cells_map = [];
        this.cells_chains = [];
    }
    Euler.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    Euler.prototype.if_in_borders = function (x, y) {
        var ret;
        for (var i = 0; i < this.BORDER_RULES.length; i++) {
            var z = this.BORDER_RULES[i][1] * x + this.BORDER_RULES[i][2] * y;
            if (this.BORDER_RULES[i][0] == 0) {
                if (z > 1) {
                    ret = true;
                }
                else {
                    ret = false;
                }
            }
            else if (this.BORDER_RULES[i][0] == 1) {
                if (z < 1) {
                    ret = true;
                }
                else {
                    ret = false;
                }
            }
            else {
                console.log("error borders param0");
                ret = false;
            }
        }
        return ret;
    };
    Euler.prototype.generate_cells = function () {
        for (var i = 0; i < this.MAX_CELL_NUM_X; i++) {
            this.cells_map.push([]);
            for (var j = 0; j < this.MAX_CELL_NUM_Y; j++) {
                if (this.RAMDOM) {
                    var ram_concent = Math.random() * 1000;
                    this.cells_map[i].push(new Cell(i, j, ram_concent));
                }
                else {
                }
                if (!this.if_in_borders(i, j)) {
                    continue;
                }
                var neighbors = [];
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
    };
    Euler.prototype.generate_mass_cells = function () {
        for (var i = 0; i < this.MAX_CELL_NUM_X; i++) {
            this.cells_map.push([]);
            for (var j = 0; j < this.MAX_CELL_NUM_Y; j++) {
                if (this.RAMDOM) {
                    var ram_concent = Math.random() * 1000;
                    this.cells_map[i].push(new Masscell(i, j, ram_concent));
                }
                else {
                }
                if (!this.if_in_borders(i, j)) {
                    continue;
                }
                var neighbors = [];
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
    };
    Euler.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var turn, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.TRANSFER_TYPE == "mass") {
                            this.generate_mass_cells();
                        }
                        turn = 0;
                        _a.label = 1;
                    case 1:
                        if (!1) return [3, 3];
                        turn++;
                        console.log(turn);
                        for (i = 0; i < this.cells_chains.length; i++) {
                            console.log("cell", i, this.cells_chains[i].concent);
                            this.cells_chains[i].Move();
                        }
                        console.log("===================");
                        return [4, this.sleep(5000)];
                    case 2:
                        _a.sent();
                        return [3, 1];
                    case 3: return [2];
                }
            });
        });
    };
    return Euler;
}());
export { Euler };
