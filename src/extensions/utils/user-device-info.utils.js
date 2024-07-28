"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var request_ip_1 = require("request-ip");
var ua_parser_js_1 = __importDefault(require("ua-parser-js"));
var app_keys_1 = __importDefault(require("../../config/app.keys"));
var logger_1 = __importDefault(require("./logger"));
var UserDeviceInfo = /** @class */ (function () {
    function UserDeviceInfo(router) {
        this.city = "";
        this.country = "";
        this.browser = "";
        this.deviceName = "";
        this.deviceType = "";
        this.lat = "";
        this.long = "";
        this.os = "";
        this.parser = new ua_parser_js_1.default(router.headers["user-agent"]);
        this.req = router;
        this.ipAddress = String((0, request_ip_1.getClientIp)(router));
        this.setBrowser();
        this.setOs();
        this.setDeviceType();
        this.setDeviceName();
    }
    UserDeviceInfo.prototype.setBrowser = function () {
        this.browser = this.parser.getBrowser().name || "";
    };
    UserDeviceInfo.prototype.setOs = function () {
        this.os = this.parser.getOS().name || "";
    };
    UserDeviceInfo.prototype.setDeviceType = function () {
        this.deviceType = this.parser.getDevice().type || "";
    };
    UserDeviceInfo.prototype.setDeviceName = function () {
        this.deviceName = this.parser.getDevice().model || "";
    };
    UserDeviceInfo.prototype.getIpAddress = function () {
        return this.ipAddress;
    };
    UserDeviceInfo.prototype.locationFromIpAddress = function (ip) {
        return __awaiter(this, void 0, void 0, function () {
            var PROD_URL, DEV_URL, url, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        PROD_URL = "https://ipinfo/".concat(ip, "/json?token=").concat(app_keys_1.default.IP_API_TOKEN);
                        DEV_URL = "https://ipinfo.io/102.88.71.154/json?token=3393bdb2f5c6d1";
                        url = app_keys_1.default.ENVIRONMENT === "development" ? DEV_URL : PROD_URL;
                        if (ip === "::1" || ip === "127.0.0.1" || ip === "undefined") {
                            logger_1.default.info("Client is running on Localhost");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get(url)];
                    case 2:
                        response = _a.sent();
                        this.city = response.data.city;
                        this.country = response.data.country;
                        this.lat = response.data.loc.split(",")[0];
                        this.long = response.data.loc.split(",")[1];
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error fetching location data:", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserDeviceInfo.prototype.info = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.locationFromIpAddress(this.ipAddress)
                        // console.log(
                        //   "info-object",
                        //   this.browser,
                        //   this.os,
                        //   this.deviceName,
                        //   this.deviceType,
                        //   this.country
                        // )
                    ];
                    case 1:
                        _a.sent();
                        // console.log(
                        //   "info-object",
                        //   this.browser,
                        //   this.os,
                        //   this.deviceName,
                        //   this.deviceType,
                        //   this.country
                        // )
                        return [2 /*return*/, {
                                browser: this.browser,
                                os: this.os,
                                deviceType: this.deviceType,
                                deviceName: this.deviceName,
                                ipAddress: this.ipAddress,
                                country: this.country,
                                city: this.city,
                                lat: this.lat,
                                long: this.long,
                            }];
                }
            });
        });
    };
    return UserDeviceInfo;
}());
exports.default = UserDeviceInfo;
