var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Cell } from "./cell.js";
var Masscell = (function (_super) {
    __extends(Masscell, _super);
    function Masscell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Masscell.prototype.deliver_to_concent = function (neighbor, deliver) {
        console.log("before:", this.concent);
        this.concent -= deliver;
        neighbor.Cell.concent += deliver;
        console.log("after:", this.concent);
    };
    return Masscell;
}(Cell));
export { Masscell };
