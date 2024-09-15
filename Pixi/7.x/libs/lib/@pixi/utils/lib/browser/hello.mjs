import { deprecation } from "../logging/deprecation.mjs";
function skipHello() {
  deprecation("7.0.0", "skipHello is deprecated, please use settings.RENDER_OPTIONS.hello");
}
function sayHello() {
  deprecation("7.0.0", `sayHello is deprecated, please use Renderer's "hello" option`);
}
export {
  sayHello,
  skipHello
};
//# sourceMappingURL=hello.mjs.map
