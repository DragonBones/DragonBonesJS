import { settings } from "@pixi/settings";
function assertPath(path2) {
  if (typeof path2 != "string")
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(path2)}`);
}
function removeUrlParams(url) {
  return url.split("?")[0].split("#")[0];
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}
function normalizeStringPosix(path2, allowAboveRoot) {
  let res = "", lastSegmentLength = 0, lastSlash = -1, dots = 0, code = -1;
  for (let i = 0; i <= path2.length; ++i) {
    if (i < path2.length)
      code = path2.charCodeAt(i);
    else {
      if (code === 47)
        break;
      code = 47;
    }
    if (code === 47) {
      if (!(lastSlash === i - 1 || dots === 1))
        if (lastSlash !== i - 1 && dots === 2) {
          if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
            if (res.length > 2) {
              const lastSlashIndex = res.lastIndexOf("/");
              if (lastSlashIndex !== res.length - 1) {
                lastSlashIndex === -1 ? (res = "", lastSegmentLength = 0) : (res = res.slice(0, lastSlashIndex), lastSegmentLength = res.length - 1 - res.lastIndexOf("/")), lastSlash = i, dots = 0;
                continue;
              }
            } else if (res.length === 2 || res.length === 1) {
              res = "", lastSegmentLength = 0, lastSlash = i, dots = 0;
              continue;
            }
          }
          allowAboveRoot && (res.length > 0 ? res += "/.." : res = "..", lastSegmentLength = 2);
        } else
          res.length > 0 ? res += `/${path2.slice(lastSlash + 1, i)}` : res = path2.slice(lastSlash + 1, i), lastSegmentLength = i - lastSlash - 1;
      lastSlash = i, dots = 0;
    } else
      code === 46 && dots !== -1 ? ++dots : dots = -1;
  }
  return res;
}
const path = {
  /**
   * Converts a path to posix format.
   * @param path - The path to convert to posix
   */
  toPosix(path2) {
    return replaceAll(path2, "\\", "/");
  },
  /**
   * Checks if the path is a URL e.g. http://, https://
   * @param path - The path to check
   */
  isUrl(path2) {
    return /^https?:/.test(this.toPosix(path2));
  },
  /**
   * Checks if the path is a data URL
   * @param path - The path to check
   */
  isDataUrl(path2) {
    return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(path2);
  },
  /**
   * Checks if the path is a blob URL
   * @param path - The path to check
   */
  isBlobUrl(path2) {
    return path2.startsWith("blob:");
  },
  /**
   * Checks if the path has a protocol e.g. http://, https://, file:///, data:, blob:, C:/
   * This will return true for windows file paths
   * @param path - The path to check
   */
  hasProtocol(path2) {
    return /^[^/:]+:/.test(this.toPosix(path2));
  },
  /**
   * Returns the protocol of the path e.g. http://, https://, file:///, data:, blob:, C:/
   * @param path - The path to get the protocol from
   */
  getProtocol(path2) {
    assertPath(path2), path2 = this.toPosix(path2);
    const matchFile = /^file:\/\/\//.exec(path2);
    if (matchFile)
      return matchFile[0];
    const matchProtocol = /^[^/:]+:\/{0,2}/.exec(path2);
    return matchProtocol ? matchProtocol[0] : "";
  },
  /**
   * Converts URL to an absolute path.
   * When loading from a Web Worker, we must use absolute paths.
   * If the URL is already absolute we return it as is
   * If it's not, we convert it
   * @param url - The URL to test
   * @param customBaseUrl - The base URL to use
   * @param customRootUrl - The root URL to use
   */
  toAbsolute(url, customBaseUrl, customRootUrl) {
    if (assertPath(url), this.isDataUrl(url) || this.isBlobUrl(url))
      return url;
    const baseUrl = removeUrlParams(this.toPosix(customBaseUrl ?? settings.ADAPTER.getBaseUrl())), rootUrl = removeUrlParams(this.toPosix(customRootUrl ?? this.rootname(baseUrl)));
    return url = this.toPosix(url), url.startsWith("/") ? path.join(rootUrl, url.slice(1)) : this.isAbsolute(url) ? url : this.join(baseUrl, url);
  },
  /**
   * Normalizes the given path, resolving '..' and '.' segments
   * @param path - The path to normalize
   */
  normalize(path2) {
    if (assertPath(path2), path2.length === 0)
      return ".";
    if (this.isDataUrl(path2) || this.isBlobUrl(path2))
      return path2;
    path2 = this.toPosix(path2);
    let protocol = "";
    const isAbsolute = path2.startsWith("/");
    this.hasProtocol(path2) && (protocol = this.rootname(path2), path2 = path2.slice(protocol.length));
    const trailingSeparator = path2.endsWith("/");
    return path2 = normalizeStringPosix(path2, !1), path2.length > 0 && trailingSeparator && (path2 += "/"), isAbsolute ? `/${path2}` : protocol + path2;
  },
  /**
   * Determines if path is an absolute path.
   * Absolute paths can be urls, data urls, or paths on disk
   * @param path - The path to test
   */
  isAbsolute(path2) {
    return assertPath(path2), path2 = this.toPosix(path2), this.hasProtocol(path2) ? !0 : path2.startsWith("/");
  },
  /**
   * Joins all given path segments together using the platform-specific separator as a delimiter,
   * then normalizes the resulting path
   * @param segments - The segments of the path to join
   */
  join(...segments) {
    if (segments.length === 0)
      return ".";
    let joined;
    for (let i = 0; i < segments.length; ++i) {
      const arg = segments[i];
      if (assertPath(arg), arg.length > 0)
        if (joined === void 0)
          joined = arg;
        else {
          const prevArg = segments[i - 1] ?? "";
          this.joinExtensions.includes(this.extname(prevArg).toLowerCase()) ? joined += `/../${arg}` : joined += `/${arg}`;
        }
    }
    return joined === void 0 ? "." : this.normalize(joined);
  },
  /**
   * Returns the directory name of a path
   * @param path - The path to parse
   */
  dirname(path2) {
    if (assertPath(path2), path2.length === 0)
      return ".";
    path2 = this.toPosix(path2);
    let code = path2.charCodeAt(0);
    const hasRoot = code === 47;
    let end = -1, matchedSlash = !0;
    const proto = this.getProtocol(path2), origpath = path2;
    path2 = path2.slice(proto.length);
    for (let i = path2.length - 1; i >= 1; --i)
      if (code = path2.charCodeAt(i), code === 47) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else
        matchedSlash = !1;
    return end === -1 ? hasRoot ? "/" : this.isUrl(origpath) ? proto + path2 : proto : hasRoot && end === 1 ? "//" : proto + path2.slice(0, end);
  },
  /**
   * Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
   * @param path - The path to parse
   */
  rootname(path2) {
    assertPath(path2), path2 = this.toPosix(path2);
    let root = "";
    if (path2.startsWith("/") ? root = "/" : root = this.getProtocol(path2), this.isUrl(path2)) {
      const index = path2.indexOf("/", root.length);
      index !== -1 ? root = path2.slice(0, index) : root = path2, root.endsWith("/") || (root += "/");
    }
    return root;
  },
  /**
   * Returns the last portion of a path
   * @param path - The path to test
   * @param ext - Optional extension to remove
   */
  basename(path2, ext) {
    assertPath(path2), ext && assertPath(ext), path2 = removeUrlParams(this.toPosix(path2));
    let start = 0, end = -1, matchedSlash = !0, i;
    if (ext !== void 0 && ext.length > 0 && ext.length <= path2.length) {
      if (ext.length === path2.length && ext === path2)
        return "";
      let extIdx = ext.length - 1, firstNonSlashEnd = -1;
      for (i = path2.length - 1; i >= 0; --i) {
        const code = path2.charCodeAt(i);
        if (code === 47) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else
          firstNonSlashEnd === -1 && (matchedSlash = !1, firstNonSlashEnd = i + 1), extIdx >= 0 && (code === ext.charCodeAt(extIdx) ? --extIdx === -1 && (end = i) : (extIdx = -1, end = firstNonSlashEnd));
      }
      return start === end ? end = firstNonSlashEnd : end === -1 && (end = path2.length), path2.slice(start, end);
    }
    for (i = path2.length - 1; i >= 0; --i)
      if (path2.charCodeAt(i) === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else
        end === -1 && (matchedSlash = !1, end = i + 1);
    return end === -1 ? "" : path2.slice(start, end);
  },
  /**
   * Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
   * portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
   * the first character of the basename of path, an empty string is returned.
   * @param path - The path to parse
   */
  extname(path2) {
    assertPath(path2), path2 = removeUrlParams(this.toPosix(path2));
    let startDot = -1, startPart = 0, end = -1, matchedSlash = !0, preDotState = 0;
    for (let i = path2.length - 1; i >= 0; --i) {
      const code = path2.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      end === -1 && (matchedSlash = !1, end = i + 1), code === 46 ? startDot === -1 ? startDot = i : preDotState !== 1 && (preDotState = 1) : startDot !== -1 && (preDotState = -1);
    }
    return startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1 ? "" : path2.slice(startDot, end);
  },
  /**
   * Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
   * @param path - The path to parse
   */
  parse(path2) {
    assertPath(path2);
    const ret = { root: "", dir: "", base: "", ext: "", name: "" };
    if (path2.length === 0)
      return ret;
    path2 = removeUrlParams(this.toPosix(path2));
    let code = path2.charCodeAt(0);
    const isAbsolute = this.isAbsolute(path2);
    let start;
    const protocol = "";
    ret.root = this.rootname(path2), isAbsolute || this.hasProtocol(path2) ? start = 1 : start = 0;
    let startDot = -1, startPart = 0, end = -1, matchedSlash = !0, i = path2.length - 1, preDotState = 0;
    for (; i >= start; --i) {
      if (code = path2.charCodeAt(i), code === 47) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      end === -1 && (matchedSlash = !1, end = i + 1), code === 46 ? startDot === -1 ? startDot = i : preDotState !== 1 && (preDotState = 1) : startDot !== -1 && (preDotState = -1);
    }
    return startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1 ? end !== -1 && (startPart === 0 && isAbsolute ? ret.base = ret.name = path2.slice(1, end) : ret.base = ret.name = path2.slice(startPart, end)) : (startPart === 0 && isAbsolute ? (ret.name = path2.slice(1, startDot), ret.base = path2.slice(1, end)) : (ret.name = path2.slice(startPart, startDot), ret.base = path2.slice(startPart, end)), ret.ext = path2.slice(startDot, end)), ret.dir = this.dirname(path2), protocol && (ret.dir = protocol + ret.dir), ret;
  },
  sep: "/",
  delimiter: ":",
  joinExtensions: [".html"]
};
export {
  path
};
//# sourceMappingURL=path.mjs.map
