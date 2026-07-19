// Single background entry point for both Chrome MV3 (background.service_worker)
// and Firefox MV3 (background.scripts fallback for Firefox < 121, and the
// primary target for Firefox >= 121, which also supports service_worker).
// See extension/manifest.json.
//
// Most of the files imported below are plain scripts (no `export`/`import`
// syntax) because they are ALSO loaded as classic <script> tags on the
// popup/welcome/execution-notice/blocked-notice pages, or as classic content
// scripts (see manifest.json `content_scripts`). Classic <script> tags share
// one global scope, so those files publish what other background files need
// onto `globalThis` explicitly (see the "Bridge for background-context ES
// modules" comments in each file) instead of using ES `export`, which would
// be a syntax error when the same file is loaded as a non-module script
// elsewhere. Files used *only* in the background were converted to real ES
// modules with `export`/`import`.
//
// Order matters here: files that bridge symbols via `globalThis` must run
// before any module that reads that bridge at module-evaluation time.

import "../../lib/our/api.js";
import "../../lib/our/safe-extension-api.js";
import "../safe-extension-api-rules.js";
import "../i18n.js";
import "../../lib/our/i18n/rtl.js";
import "../../lib/our/pin.js";
import "../../lib/our/welcome/step-icon.js";
import "../../lib/our/welcome/background.js";
import "../welcome/constants.js";
import "../welcome/data.js";
import "../welcome/background.js";
import "../../lib/our/page-operability/probe.js";
import "../../lib/our/page-operability/content-probe.js";
import "../../lib/our/page-operability/can-operate.js";
import "../../lib/our/page-operability/messages.js";
import "../../lib/our/page-operability/show-notice.js";
import "../page-operability/constants.js";
import "../page-operability/notice.js";
import "../execution-notice/constants.js";
import "../execution-notice/notice.js";
import "./state.js";
import "./storage.js";
import "../../lib/our/support-survey/logic.js";
import "../support-survey/constants.js";
import "../support-survey/state.js";
import "./execution.js";
import "./badge.js";
import "./check.js";
import "./messages.js";
import "./context-menu.js";
