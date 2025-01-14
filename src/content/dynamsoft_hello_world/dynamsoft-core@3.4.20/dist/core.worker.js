/*!
 * Dynamsoft JavaScript Library
 * @product Dynamsoft Core JS Edition
 * @website https://www.dynamsoft.com
 * @copyright Copyright 2024, Dynamsoft Corporation
 * @author Dynamsoft
 * @version 3.4.20
 * @fileoverview Dynamsoft JavaScript Library for Core
 * More info on Dynamsoft Core JS: https://www.dynamsoft.com/capture-vision/docs/web/programming/javascript/api-reference/core/core-module.html
 */
! function () {
    "use strict";
    const e = e => e && "object" == typeof e && "function" == typeof e.then;
    class t extends Promise {
        get status() {
            return this._s
        }
        get isPending() {
            return "pending" === this._s
        }
        get isFulfilled() {
            return "fulfilled" === this._s
        }
        get isRejected() {
            return "rejected" === this._s
        }
        get task() {
            return this._task
        }
        set task(t) {
            let s;
            this._task = t, e(t) ? s = t : "function" == typeof t && (s = new Promise(t)), s && (async () => {
                try {
                    const e = await s;
                    t === this._task && this.resolve(e)
                } catch (e) {
                    t === this._task && this.reject(e)
                }
            })()
        }
        get isEmpty() {
            return null == this._task
        }
        constructor(t) {
            let s, r;
            super(((e, t) => {
                s = e, r = t
            })), this._s = "pending", this.resolve = t => {
                this.isPending && (e(t) ? this.task = t : (this._s = "fulfilled", s(t)))
            }, this.reject = e => {
                this.isPending && (this._s = "rejected", r(e))
            }, this.task = t
        }
    }
    const s = self,
        r = {};
    s.coreWorkerVersion = "3.4.20", s.versions = r;
    const o = {},
        a = s.waitAsyncDependency = async e => {
            let s = "string" == typeof e ? [e] : e,
                r = [];
            for (let e of s) r.push(o[e] = o[e] || new t);
            await Promise.all(r)
        }, i = async (e, s) => {
            let r, a = "string" == typeof e ? [e] : e,
                i = [];
            for (let e of a) {
                let a;
                i.push(a = o[e] = o[e] || new t(r = r || s())), a.isEmpty && (a.task = r = r || s())
            }
            await Promise.all(i)
        }, n = [];
    s.setBufferIntoWasm = (e, t = 0, s = 0, r = 0) => {
        s && (e = r ? e.subarray(s, r) : e.subarray(s));
        let o = n[t] = n[t] || {
            ptr: 0,
            size: 0,
            maxSize: 0
        };
        return e.length > o.maxSize && (o.ptr && p._free(o.ptr), o.ptr = p._malloc(e.length), o.maxSize = e.length), p.HEAPU8.set(e, o.ptr), o.size = e.length, o.ptr
    };
    const l = {
            buffer: 0,
            size: 0,
            pos: 0,
            temps: [],
            needed: 0,
            prepare: function () {
                if (l.needed) {
                    for (let e = 0; e < l.temps.length; e++) p._free(l.temps[e]);
                    l.temps.length = 0, p._free(l.buffer), l.buffer = 0, l.size += l.needed, l.needed = 0
                }
                l.buffer || (l.size += 128, l.buffer = p._malloc(l.size), assert(l.buffer)), l.pos = 0
            },
            alloc: function (e, t) {
                assert(l.buffer);
                let s, r = t.BYTES_PER_ELEMENT,
                    o = e.length * r;
                return o = o + 7 & -8, l.pos + o >= l.size ? (assert(o > 0), l.needed += o, s = p._malloc(o), l.temps.push(s)) : (s = l.buffer + l.pos, l.pos += o), s
            },
            copy: function (e, t, s) {
                switch (s >>>= 0, t.BYTES_PER_ELEMENT) {
                    case 2:
                        s >>>= 1;
                        break;
                    case 4:
                        s >>>= 2;
                        break;
                    case 8:
                        s >>>= 3
                }
                for (let r = 0; r < e.length; r++) t[s + r] = e[r]
            }
        },
        c = s.ep = l.prepare;
    s.bDebug = !1, s.bLog = !1, s.strDomain = void 0;
    const d = s.es = e => {
            let t = intArrayFromString(e),
                s = l.alloc(t, p.HEAP8);
            return l.copy(t, p.HEAP8, s), s
        },
        p = s.Module = {
            print: e => {
                s.bLog && h(e)
            },
            printErr: e => {
                s.bLog && h(e)
            },
            locateFile: (e, t) => {
                if (["std.wasm", "core.wasm"].includes(e)) {
                    return m[e.split(".")[0]] + e
                }
                return e
            }
        },
        m = s.engineResourcePaths = {},
        u = s.loadCore = async () => {
            const e = "core";
            await i(e, (async () => {
                let t = s.bLog && (h(e + " loading..."), Date.now()) || 0,
                    r = new Promise((r => {
                        p.onRuntimeInitialized = () => {
                            s.bLog && h(e + " initialized, cost " + (Date.now() - t) + " ms"), r(void 0)
                        }
                    })),
                    o = m.std + "std.js";
                importScripts(o), await r
            }))
        }, f = s.loadSideModule = async (e, {
            js: t,
            wasm: o
        }) => {
            await i(e, (async () => {
                await a("core");
                let i = s.bLog && (h(e + " loading..."), Date.now()) || 0;
                if (t instanceof Array)
                    for (let s of t) {
                        let t = m[e] + s;
                        importScripts(t)
                    } else if (t) {
                        let t = m[e] + e + ".worker.js";
                        importScripts(t)
                    } if (o instanceof Array)
                    for (let t of o) {
                        let s = m[e] + t;
                        try {
                            await loadDynamicLibrary(s, {
                                loadAsync: !0,
                                global: !0,
                                nodelete: !0,
                                allowUndefined: !0
                            })
                        } catch (e) {
                            throw e
                        }
                    } else if (o) {
                        let t = m[e] + e + ".wasm";
                        try {
                            await loadDynamicLibrary(t, {
                                loadAsync: !0,
                                global: !0,
                                nodelete: !0,
                                allowUndefined: !0
                            })
                        } catch (e) {
                            throw e
                        }
                    } wasmImports.emscripten_bind_CoreWasm_PreSetModuleExist && (c(), wasmImports.emscripten_bind_CoreWasm_PreSetModuleExist(d(e.toUpperCase()))), wasmImports.emscripten_bind_CvrWasm_SetModuleExist && (c(), wasmImports.emscripten_bind_CvrWasm_SetModuleExist(d(e.toUpperCase())));
                const n = JSON.parse(UTF8ToString(wasmImports.emscripten_bind_CoreWasm_GetModuleVersion_0())),
                    l = s[`${e}WorkerVersion`];
                r[e] = {
                    worker: `${l||"No Worker"}`,
                    wasm: n[e.toUpperCase()]
                }, s.bLog && h(e + " initialized, cost " + (Date.now() - i) + " ms")
            }))
        }, g = s.mapController = {
            loadWasm: async (e, t) => {
                try {
                    Object.assign(m, e.engineResourcePaths), e.needLoadCore && (e.bLog && (s.bLog = !0), e.dm && (s.strDomain = e.dm), e.bd && (s.bDebug = !0), await u());
                    for (let t of e.names) await f(t, e.autoResources[t]);
                    if (e.needLoadCore) {
                        const e = JSON.parse(UTF8ToString(wasmImports.emscripten_bind_CoreWasm_GetModuleVersion_0()));
                        r.core = {
                            worker: s.coreWorkerVersion,
                            wasm: e.CORE
                        }
                    }
                    _(t, {
                        versions: r
                    })
                } catch (e) {
                    console.log(e), b(t, e)
                }
            },
            setBLog: e => {
                s.bLog = e.value
            },
            setBDebug: e => {
                s.bDebug = e.value
            },
            getModuleVersion: async (e, t) => {
                try {
                    let e = UTF8ToString(wasmImports.emscripten_bind_CoreWasm_GetModuleVersion_0());
                    _(t, {
                        versions: JSON.parse(e)
                    })
                } catch (e) {
                    b(t, e)
                }
            },
            cfd: async (e, t) => {
                try {
                    wasmImports.emscripten_bind_CoreWasm_static_CFD_1(e.count), _(t, {})
                } catch (e) {
                    b(t, e)
                }
            }
        };
    addEventListener("message", (e => {
        // console.warn('message:', e.data)
        const t = e.data ? e.data : e,
            s = t.body,
            r = t.id,
            o = t.instanceID,
            a = g[t.type];
        if (!a) throw new Error("Unmatched task: " + t.type);
        a(s, r, o)
    }));
    const _ = s.handleTaskRes = (e, t) => {
            // console.warn('handleTaskRes:', e, t)
            postMessage({
                type: "task",
                id: e,
                body: Object.assign({
                    success: !0
                }, t)
            })
        },
        b = s.handleTaskErr = (e, t) => {
            // console.warn('handleTaskErr:', e, t)
            postMessage({
                type: "task",
                id: e,
                body: {
                    success: !1,
                    message: (null == t ? void 0 : t.message) || t,
                    stack: s.bDebug && (null == t ? void 0 : t.stack) || t
                }
            })
        },
        h = s.log = e => {
            console.log(e)
            postMessage({
                type: "log",
                message: e
            })
        }
}();