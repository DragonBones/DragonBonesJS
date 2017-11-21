/**
 *
 */
let dragTarget: egret.DisplayObject | null = null;
/**
 *
 */
function enableDrag(displayObject: egret.DisplayObject): void {
    if (displayObject) {
        displayObject.touchEnabled = true;
        displayObject.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _dragHandler, displayObject);
        displayObject.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, _dragHandler, displayObject);
        displayObject.addEventListener(egret.TouchEvent.TOUCH_END, _dragHandler, displayObject);
    }
}

/**
 *
 */
function disableDrag(displayObject: egret.DisplayObject): void {
    if (displayObject) {
        displayObject.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, _dragHandler, displayObject);
        displayObject.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, _dragHandler, displayObject);
        displayObject.removeEventListener(egret.TouchEvent.TOUCH_END, _dragHandler, displayObject);
    }
}

const _helpPoint = new egret.Point();
const _dragOffset = new egret.Point();
function _dragHandler(event: egret.TouchEvent): void {
    switch (event.type) {
        case egret.TouchEvent.TOUCH_BEGIN:
            if (dragTarget) {
                return;
            }

            dragTarget = event.target as egret.DisplayObject;
            dragTarget.parent.globalToLocal(event.stageX, event.stageY, _helpPoint);
            _dragOffset.x = dragTarget.x - _helpPoint.x;
            _dragOffset.y = dragTarget.y - _helpPoint.y;
            dragTarget.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, _dragHandler, dragTarget);
            break;

        case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
        case egret.TouchEvent.TOUCH_END:
            if (dragTarget) {
                dragTarget.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, _dragHandler, dragTarget);
                dragTarget = null;
            }
            break;

        case egret.TouchEvent.TOUCH_MOVE:
            if (dragTarget) {
                dragTarget.parent.globalToLocal(event.stageX, event.stageY, _helpPoint);
                dragTarget.x = _helpPoint.x + _dragOffset.x;
                dragTarget.y = _helpPoint.y + _dragOffset.y;
            }
            break;
    }
}