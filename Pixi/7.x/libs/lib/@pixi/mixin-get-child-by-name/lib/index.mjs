import { DisplayObject, Container } from "@pixi/display";
DisplayObject.prototype.name = null;
Container.prototype.getChildByName = function(name, deep) {
  for (let i = 0, j = this.children.length; i < j; i++)
    if (this.children[i].name === name)
      return this.children[i];
  if (deep)
    for (let i = 0, j = this.children.length; i < j; i++) {
      const child = this.children[i];
      if (!child.getChildByName)
        continue;
      const target = child.getChildByName(name, !0);
      if (target)
        return target;
    }
  return null;
};
//# sourceMappingURL=index.mjs.map
