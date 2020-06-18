Object.defineProperty(exports, "__esModule", { value: true });
var PATH_STRIP_RE = /^.*\/[^\.]+(\.app|CodePush|.*(?=\/))/;
/**
 *  Normalize url in stacktrace
 */
function normalizeUrl(url, pathStripRe) {
    return "app://" + url.replace(/^file\:\/\//, '').replace(pathStripRe, '');
}
exports.normalizeUrl = normalizeUrl;
/**
 * Normalizes the stacktrace
 * @param data
 */
function normalizeData(data) {
    if (data.culprit) {
        data.culprit = normalizeUrl(data.culprit, PATH_STRIP_RE);
    }
    var stacktrace = data.stacktrace || (data.exception && data.exception.values && data.exception.values[0].stacktrace);
    if (stacktrace) {
        stacktrace.frames.forEach(function (frame) {
            if (frame.filename !== '[native code]' && frame.filename !== '<anonymous>') {
                frame.filename = normalizeUrl(frame.filename, PATH_STRIP_RE);
            }
        });
    }
    return data;
}
exports.normalizeData = normalizeData;
//# sourceMappingURL=normalize.js.map