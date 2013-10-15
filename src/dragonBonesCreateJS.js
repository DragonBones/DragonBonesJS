package light.managers 
{
	import flash.display.InteractiveObject;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.utils.Dictionary;
	import flash.utils.clearInterval;
	import flash.utils.setInterval;
	
	import light.core.LightFrameWork;
	import light.events.LightTouchEvent;
	
	public class NativeTouchManager extends BaseManager 
	{
		baseManager_internal static var _instance:NativeTouchManager;
		public static function getInstance():NativeTouchManager 
		{
			return BaseManager.createConstructor(NativeTouchManager) as NativeTouchManager;
		}
		
		public function NativeTouchManager()
		{
			super(this);
			
			_touchTargets = new Dictionary();
			_touchTargetsOver = new Dictionary();
			_touchTargetsPress = new Dictionary();
			_touchTargetsTouchRelease = new Dictionary();
			
			_intervalID = setInterval(checkStage, 500);
		}
		
		public const pressPoint:Point = new Point();
		public const currentPoint:Point = new Point();
		public const speed:Point = new Point();
		
		public var moveAccuracy:int;
		
		private var _isDraged:Boolean;
		public function get isDraged():Boolean
		{
			return _isDraged;
		}
		
		private var _touchMode:Boolean;
		public function get touchMode():Boolean
		{
			return _touchMode;
		}
		public function set touchMode(value:Boolean):void
		{
			if(_touchMode != value)
			{
				_touchMode = value;
				for each(var touchTarget:InteractiveObject in _touchTargetsTouchRelease)
				{
					delete _touchTargetsTouchRelease[touchTarget];
				}
			}
		}
		
		private var _touchTargets:Dictionary;
		private var _touchTargetsOver:Dictionary;
		private var _touchTargetsPress:Dictionary;
		private var _touchTargetsTouchRelease:Dictionary;
		
		private var _intervalID:uint;
		
		private function checkStage():void 
		{
			for each(var touchTarget:InteractiveObject in _touchTargets)
			{
				if(touchTarget.stage)
				{
					LightFrameWork.stage = touchTarget.stage;
					LightFrameWork.stage.addEventListener(MouseEvent.MOUSE_UP, stageMouseUpHandler);
					LightFrameWork.stage.addEventListener(MouseEvent.MOUSE_DOWN, stageMouseDownHandler);
					clearInterval(_intervalID);
					break;
				}
			}
		}
		
		public function registerTouchTarget(touchTarget:InteractiveObject):void
		{
			if(!touchTarget)
			{
				throw new ArgumentError();
			}
			if(_touchTargets[touchTarget])
			{
				return;
			}
			_touchTargets[touchTarget] = touchTarget;
			touchTarget.addEventListener(MouseEvent.ROLL_OVER, rollOverHandler);
			
			if(touchTarget is MovieClip)
			{
				(touchTarget as MovieClip).mouseChildren = false;
			}
			
			changeTouchTargetStyle(touchTarget);
		}
		
		public function unregisterTouchTarget(touchTarget:InteractiveObject):void 
		{
			touchTarget.removeEventListener(MouseEvent.ROLL_OVER, rollOverHandler);
			touchTarget.removeEventListener(MouseEvent.ROLL_OUT, rollOutHandler);
			
			delete _touchTargets[touchTarget];
			delete _touchTargetsOver[touchTarget];
			delete _touchTargetsPress[touchTarget];
			delete _touchTargetsTouchRelease[touchTarget];
		}
		
		private function rollOverHandler(e:Object):void 
		{
			var touchTarget:InteractiveObject = (e is MouseEvent?e.currentTarget:e) as InteractiveObject;
			
			if(_touchTargetsOver[touchTarget])
			{
				
			}
			else 
			{
				_touchTargetsOver[touchTarget] = touchTarget;
				touchTarget.addEventListener(MouseEvent.ROLL_OUT, rollOutHandler);
				var isDragOver:Boolean = (e is MouseEvent?e.buttonDown:false);
				if(isDragOver)
				{
					if(touchTarget.hasEventListener(LightTouchEvent.DRAG_OVER))
					{
						touchTarget.dispatchEvent(new LightTouchEvent(LightTouchEvent.DRAG_OVER, true, e?e.target:touchTarget));
					}
					changeTouchTargetStyle(touchTarget, _touchTargetsPress[touchTarget]);
				}
				else 
				{
					if(touchTarget.hasEventListener(LightTouchEvent.ROLL_OVER))
					{
						touchTarget.dispatchEvent(new LightTouchEvent(LightTouchEvent.ROLL_OVER, true, e?e.target:touchTarget));
					}
					changeTouchTargetStyle(touchTarget);
				}
			}
		}
		
		private function rollOutHandler(e:Object):void 
		{
			var touchTarget:InteractiveObject = (e is MouseEvent?e.currentTarget:e) as InteractiveObject;
			
			if(_touchTargetsOver[touchTarget])
			{
				delete _touchTargetsOver[touchTarget];
				touchTarget.removeEventListener(MouseEvent.ROLL_OUT, rollOutHandler);
				if(e.buttonDown)
				{
					if(touchTarget.hasEventListener(LightTouchEvent.DRAG_OUT))
					{
						touchTarget.dispatchEvent(new LightTouchEvent(LightTouchEvent.DRAG_OUT, false, e?e.target:touchTarget));
					}
				}
				else 
				{
					if(touchTarget.hasEventListener(LightTouchEvent.ROLL_OUT))
					{
						touchTarget.dispatchEvent(new LightTouchEvent(LightTouchEvent.ROLL_OUT, false, e?e.target:touchTarget));
					}
				}
				
				changeTouchTargetStyle(touchTarget);
			}
		}
		
		private function mouseMoveHandler(e:Event):void 
		{
			speed.setTo(LightFrameWork.stage.mouseX - currentPoint.x, LightFrameWork.stage.mouseY - currentPoint.y);
			currentPoint.setTo(LightFrameWork.stage.mouseX, LightFrameWork.stage.mouseY);
			
			if(Math.abs(speed.x) > moveAccuracy || Math.abs(speed.y) > moveAccuracy)
			{
				for each(var touchTarget:InteractiveObject in _touchTargetsPress)
				{
					if(touchTarget.hasEventListener(LightTouchEvent.DRAG_MOVE))
					{
						touchTarget.dispatchEvent(new LightTouchEvent(LightTouchEvent.DRAG_MOVE, false, e?e.target:touchTarget));
					}
				}
				_isDraged = true;
			}
		}
		
		private function stageMouseDownHandler(e:Event):void 
		{
			pressPoint.setTo(LightFrameWork.stage.mouseX, LightFrameWork.stage.mouseY);
			currentPoint.setTo(LightFrameWork.stage.mouseX, LightFrameWork.stage.mouseY);
			
			if(_touchMode)
			{
				var touchTarget:InteractiveObject = e.target as InteractiveObject;
				while(touchTarget)
				{
					if(_touchTargetsTouchRelease[touchTarget])
					{
						delete _touchTargetsTouchRelease[touchTarget];
						rollOverHandler(touchTarget);
					}
					touchTarget = touchTarget.parent;
				}
			}
			
			for each(touchTarget in _touchTargetsOver)
			{
				if(_touchTargetsPress[touchTarget])
				{
					
				}
				else 
				{
					_touchTargetsPress[touchTarget] = touchTarget;
					if(touchTarget.hasEventListener(LightTouchEvent.PRESS))
					{
						touchTarget.dispatchEvent(new LightTouchEvent(LightTouchEvent.PRESS, true, e?e.target:touchTarget));
					}
					changeTouchTargetStyle(touchTarget);
				}
			}
			
			LightFrameWork.stage.addEventListener(Event.ENTER_FRAME, mouseMoveHandler);
		}
		
		private function stageMouseUpHandler(e:Event):void 
		{
			LightFrameWork.stage.removeEventListener(Event.ENTER_FRAME, mouseMoveHandler);
			
			var touchTarget:InteractiveObject;
			
			for each(touchTarget in _touchTargetsPress)
			{
				if(_touchTargetsOver[touchTarget])
				{
					if(touchTarget.hasEventListener(LightTouchEvent.RELEASE))
					{
						touchTarget.dispatchEvent(new LightTouchEvent(LightTouchEvent.RELEASE, false, e?e.target:touchTarget));
					}
				}
				else
				{
					if(touchTarget.hasEventListener(LightTouchEvent.RELEASE_OUTSIDE))
					{
						touchTarget.dispatchEvent(new LightTouchEvent(LightTouchEvent.RELEASE_OUTSIDE, false, e?e.target:touchTarget));
					}
				}
			}
				
			if(e && e.target != LightFrameWork.stage)
			{
				touchTarget = e.target as InteractiveObject;
				while(touchTarget)
				{
					if(_touchTargetsOver[touchTarget] && !_touchTargetsPress[touchTarget])
					{
						if(_touchMode)
						{
							rollOutHandler(touchTarget);
							_touchTargetsTouchRelease[touchTarget] = touchTarget;
						}
						else
						{
							delete _touchTargetsOver[touchTarget];
							rollOverHandler(touchTarget);
						}
					}
					touchTarget = touchTarget.parent;
				}
			}
			
			for each(touchTarget in _touchTargetsPress)
			{
				delete _touchTargetsPress[touchTarget];
				
				if(_touchMode)
				{
					rollOutHandler(touchTarget);
					_touchTargetsTouchRelease[touchTarget] = touchTarget;
				}
				
				changeTouchTargetStyle(touchTarget);
			}
			
			_isDraged = false;
		}
		
		public function changeTouchTargetStyle(touchTarget:Object, isActive:Boolean = tr