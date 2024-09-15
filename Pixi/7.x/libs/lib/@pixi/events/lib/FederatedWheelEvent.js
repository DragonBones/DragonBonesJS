"use strict";
var FederatedMouseEvent = require("./FederatedMouseEvent.js");
class FederatedWheelEvent extends FederatedMouseEvent.FederatedMouseEvent {
  constructor() {
    super(...arguments), this.DOM_DELTA_PIXEL = 0, this.DOM_DELTA_LINE = 1, this.DOM_DELTA_PAGE = 2;
  }
}
FederatedWheelEvent.DOM_DELTA_PIXEL = 0, /** Units specified in lines. */
FederatedWheelEvent.DOM_DELTA_LINE = 1, /** Units specified in pages. */
FederatedWheelEvent.DOM_DELTA_PAGE = 2;
exports.FederatedWheelEvent = FederatedWheelEvent;
//# sourceMappingURL=FederatedWheelEvent.js.map
