import { FederatedMouseEvent } from "./FederatedMouseEvent.mjs";
class FederatedPointerEvent extends FederatedMouseEvent {
  constructor() {
    super(...arguments), this.width = 0, this.height = 0, this.isPrimary = !1;
  }
  // Only included for completeness for now
  getCoalescedEvents() {
    return this.type === "pointermove" || this.type === "mousemove" || this.type === "touchmove" ? [this] : [];
  }
  // Only included for completeness for now
  getPredictedEvents() {
    throw new Error("getPredictedEvents is not supported!");
  }
}
export {
  FederatedPointerEvent
};
//# sourceMappingURL=FederatedPointerEvent.mjs.map
