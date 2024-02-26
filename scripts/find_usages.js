"use strict";
exports.__esModule = true;
var ts = require("typescript");
var fs = require("fs");
var path = require("path");
var directoryPath = '../src'; // Adjust to your Angular project directory.
function findFilesUsingService(dir) {
    var rootNames = fs.readdirSync(dir).map(function (file) { return path.join(dir, file); });
    var options = { allowJs: true };
    var host = {
        getScriptFileNames: function () { return rootNames; },
        getScriptVersion: function (fileName) { return '0'; },
        getCurrentDirectory: function () { return dir; },
        getCompilationSettings: function () { return options; },
        getDefaultLibFileName: function (options) { return 'lib.d.ts'; },
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
        getScriptSnapshot: function (fileName) {
            if (!fs.existsSync(fileName)) {
                return undefined;
            }
            var fileContent = fs.readFileSync(fileName).toString();
            return ts.ScriptSnapshot.fromString(fileContent);
        }
    };
    var service = ts.createLanguageService(host, ts.createDocumentRegistry());
    var _loop_1 = function (fileName) {
        var sourceFile = service.getProgram().getSourceFile(fileName);
        if (sourceFile) {
            ts.forEachChild(sourceFile, function (node) {
                var _a;
                if (ts.isImportDeclaration(node) && node.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral) {
                    var namedBindings = (_a = node.importClause) === null || _a === void 0 ? void 0 : _a.namedBindings;
                    if (ts.isNamedImports(namedBindings)) {
                        for (var _i = 0, _b = namedBindings.elements; _i < _b.length; _i++) {
                            var namedBinding = _b[_i];
                            if (ts.isImportSpecifier(namedBinding) && namedBinding.name.text === 'LearnDoService') {
                                console.log("Found usage in: ".concat(fileName));
                            }
                        }
                    }
                }
            });
        }
    };
    for (var _i = 0, rootNames_1 = rootNames; _i < rootNames_1.length; _i++) {
        var fileName = rootNames_1[_i];
        _loop_1(fileName);
    }
}
findFilesUsingService(directoryPath);
