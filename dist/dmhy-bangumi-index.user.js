// ==UserScript==
// @name       DMHY Bangumi Index
// @name:zh-TW 動漫花園新番索引
// @description       Let DMHY header index back!
// @description:zh-TW 把動漫花園上方的索引弄回來
// @namespace https://github.com/FlandreDaisuki
// @author    FlandreDaisuki
// @match     https://dmhy.org/
// @match     https://dmhy.org/topics/*
// @match     https://share.dmhy.org/
// @match     https://share.dmhy.org/topics/*
// @require   https://unpkg.com/vue@3.1.5/dist/vue.global.prod.js
// @require   https://unpkg.com/vue-router@4.0.10/dist/vue-router.global.prod.js
// @require   https://unpkg.com/js-yaml@4.1.0/dist/js-yaml.min.js
// @require   https://unpkg.com/lz-string@1.4.4/libs/lz-string.min.js
// @connect   flandredaisuki.github.io
// @license   MIT
// @noframes
// @version   1.2.0
// @grant     GM_xmlhttpRequest
// @grant     unsafeWindow
// ==/UserScript==
(function (vue, lzString, yaml, vueRouter) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var yaml__default = /*#__PURE__*/_interopDefaultLegacy(yaml);

  const HOUR_IN_MS = 60 * 60 * 1000;

  const WEEKDAY_STR = '日一二三四五六';

  const BASE_URI = 'https://flandredaisuki.github.io/DMHY-Bangumi-Index';
  // const BASE_URI = 'https://flandredaisuki.github.io/DMHY-Bangumi-Index/history/2019-10';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const createKeywordLink = (keyword) => `/topics/list?keyword=${keyword}`;
  const transformWeekday = (weekdayStr) => {
    switch (weekdayStr) {
    case '日':
      return '星期日（日）';
    case '一':
      return '星期一（月）';
    case '二':
      return '星期二（火）';
    case '三':
      return '星期三（水）';
    case '四':
      return '星期四（木）';
    case '五':
      return '星期五（金）';
    case '六':
      return '星期六（土）';
    }
  };

  const STORAGE_KEY$2 = 'DMHY-Bangumi-Index::favorite';
  const favorites = vue.ref([]);

  const load$1 = () => {
    const fav = localStorage.getItem(STORAGE_KEY$2);
    if (!fav) { favorites.value = []; }
    try {
      favorites.value = JSON.parse(lzString.decompressFromBase64(fav));
    } catch {
      favorites.value = [];
    }
  };

  const save$1 = () => {
    localStorage.setItem(
      STORAGE_KEY$2,
      lzString.compressToBase64(JSON.stringify(favorites.value)),
    );
  };

  const find = (title) => {
    const foundIndex = favorites.value.findIndex((fav) => fav.title === title);
    return {
      found: (foundIndex >= 0) ? favorites.value[foundIndex] : null,
      foundIndex,
    };
  };

  /** @type {(title: string) => void */
  const add$1 = (title) => {
    const keyword = new URL(location).searchParams.get('keyword');
    favorites.value.push({ title, keyword });
    save$1();
  };

  /** @type {(title: string) => void */
  const remove = (title) => {
    const { found, foundIndex } = find(title);
    if (found) {
      favorites.value.splice(foundIndex, 1);
    }
    save$1();
  };

  var script$2 = {
    setup() {
      const userInputStr = vue.ref('');
      const validityMsg = vue.ref('');
      const title = vue.computed(() => userInputStr.value.trim());
      const titleInputEl = vue.ref();

      const setValidity = (msg) => {
        validityMsg.value = msg;
        titleInputEl.value.setCustomValidity(msg);
      };
      const onClickAdd = () => {
        if (!title.value) { return setValidity('名稱欄為空'); }
        if (find(title.value).found) { return setValidity('書籤名稱已存在'); }
        add$1(title.value);
      };
      const onClickRemove = () => {
        if (!title.value) { return setValidity('名稱欄為空'); }
        if (!find(title.value).found) { return setValidity('書籤名稱不存在'); }
        remove(title.value);
      };

      return {
        userInputStr,
        favorites,
        validityMsg,
        titleInputEl,
        createKeywordLink,
        setValidity,
        onClickAdd,
        onClickRemove,
      };
    },
  };

  const _withId$2 = /*#__PURE__*/vue.withScopeId("data-v-138c4132");

  vue.pushScopeId("data-v-138c4132");
  const _hoisted_1$2 = /*#__PURE__*/vue.createVNode("header", null, [
    /*#__PURE__*/vue.createVNode("span", null, "書籤索引"),
    /*#__PURE__*/vue.createVNode("span", null, "將當前的搜索加入書籤，並自訂名稱")
  ], -1 /* HOISTED */);
  const _hoisted_2$2 = { class: "favorite-area" };
  const _hoisted_3$2 = { class: "favorite-pool" };
  const _hoisted_4 = { class: "input-area" };
  const _hoisted_5 = { class: "tooltip" };
  vue.popScopeId();

  const render$2 = /*#__PURE__*/_withId$2((_ctx, _cache, $props, $setup, $data, $options) => {
    return (vue.openBlock(), vue.createBlock("div", null, [
      _hoisted_1$2,
      vue.createVNode("div", _hoisted_2$2, [
        vue.createVNode("div", _hoisted_3$2, [
          (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($setup.favorites, (bangumi) => {
            return (vue.openBlock(), vue.createBlock("a", {
              key: bangumi.title,
              href: $setup.createKeywordLink(bangumi.keyword),
              role: "button",
              class: "bangumi"
            }, vue.toDisplayString(bangumi.title), 9 /* TEXT, PROPS */, ["href"]))
          }), 128 /* KEYED_FRAGMENT */))
        ]),
        vue.createVNode("div", _hoisted_4, [
          vue.withDirectives(vue.createVNode("input", {
            ref: "titleInputEl",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ($setup.userInputStr = $event)),
            type: "text",
            class: "user-title-input",
            placeholder: "為目前網址取名",
            onInput: _cache[2] || (_cache[2] = $event => ($setup.setValidity(''))),
            onFocus: _cache[3] || (_cache[3] = $event => ($setup.setValidity('')))
          }, null, 544 /* HYDRATE_EVENTS, NEED_PATCH */), [
            [vue.vModelText, $setup.userInputStr]
          ]),
          vue.createVNode("span", _hoisted_5, vue.toDisplayString($setup.validityMsg), 1 /* TEXT */),
          vue.createVNode("button", {
            class: "add-btn",
            onClick: _cache[4] || (_cache[4] = (...args) => ($setup.onClickAdd && $setup.onClickAdd(...args)))
          }, " 加入 "),
          vue.createVNode("button", {
            class: "del-btn",
            onClick: _cache[5] || (_cache[5] = (...args) => ($setup.onClickRemove && $setup.onClickRemove(...args)))
          }, " 刪除 ")
        ])
      ])
    ]))
  });

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z$2 = "\na[data-v-138c4132] {\n  color: #247;\n  text-decoration: none;\n}\nheader[data-v-138c4132] {\n  color: #fff;\n  background-color: #247;\n  padding: 5px;\n  display: flex;\n  font-size: 0.8rem;\n}\nheader > span[data-v-138c4132]:nth-of-type(n + 2)::before {\n  content: '::';\n  padding: 0 8px;\n}\nheader > span > a[data-v-138c4132] {\n  color: #fff;\n}\n.favorite-area[data-v-138c4132] {\n  background-color: #fff;\n}\n.favorite-pool[data-v-138c4132] {\n  padding: 10px;\n  min-height: 14px;\n  display: flex;\n}\n.bangumi[data-v-138c4132] {\n  border: 1px solid #ffa500;\n  padding: 2px;\n  margin: 1px 3px;\n  display: inline-flex;\n  align-items: center;\n}\n.input-area[data-v-138c4132] {\n  display: flex;\n  justify-content: center;\n  padding: 4px;\n  border-top: 1px dotted #247;\n}\n.input-area > *[data-v-138c4132] {\n  margin: 0 15px;\n}\n.input-area > .user-title-input[data-v-138c4132] {\n  border: 1px solid #247;\n  padding: 0 7px;\n  border-radius: 5px;\n  font-size: 14px;\n}\n.tooltip[data-v-138c4132] {\n  position: absolute;\n  background-color: #000;\n  color: white;\n  padding: 5px 10px;\n  border-radius: 5px;\n  transform-origin: bottom center;\n  transform: translateY(-35px);\n  display: none;\n}\n.tooltip[data-v-138c4132]::after {\n  content: '';\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  border-top: 5px solid black;\n  position: absolute;\n  top: 100%;\n  right: 20%;\n}\n.user-title-input:invalid + .tooltip[data-v-138c4132] {\n  display: block;\n}\n.input-area > button[data-v-138c4132] {\n  border: none;\n  border-radius: 5px;\n  padding: 5px 21px;\n  font-size: 14px;\n}\n.input-area > button.add-btn[data-v-138c4132] {\n  background-color: lightgreen;\n}\n.input-area > button.del-btn[data-v-138c4132] {\n  background-color: crimson;\n  color: white;\n}\n";
  styleInject(css_248z$2);

  script$2.render = render$2;
  script$2.__scopeId = "data-v-138c4132";

  const STORAGE_KEY$1 = 'DMHY-Bangumi-Index::expansion';

  const expansion = vue.ref(Boolean(JSON.parse(localStorage.getItem(STORAGE_KEY$1) ?? 'false')));

  const get = () => expansion.value;

  const set = (v) => {
    expansion.value = Boolean(v);
    localStorage.setItem(STORAGE_KEY$1, expansion.value);
  };

  const fetcher = async(url, options = {}) => {
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    };
    const opt = Object.assign({}, defaultOptions, options);
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        ...opt,
        url,
        onload: (res) => {
          resolve(res.responseText);
        },
        onerror: (err) => {
          console.error('DMHY-Bangumi-Index::req-err', err);
          reject(err);
        },
      });
    });
  };

  const YAMLToWeeklyBangumiPayload = (data, isnew) => {
    const weeklyBangumiPayload = {};

    for (const weekdayStr of WEEKDAY_STR) {
      weeklyBangumiPayload[weekdayStr] = [];
      for (const [title, keyword] of Object.entries(data[weekdayStr])) {
        weeklyBangumiPayload[weekdayStr].push({
          title,
          keyword,
          isnew,
        });
      }
    }
    return weeklyBangumiPayload;
  };

  const downloadBangumi = async(newold) => {
    const txt = await fetcher(
      `${BASE_URI}/${newold}.yaml`,
    );

    const data = yaml__default['default'].load(txt);
    return YAMLToWeeklyBangumiPayload(data, newold === 'new');
  };

  const weeklyBangumi = vue.ref({});

  /**
   * wb := weeklyBangumi
   * {
   *   日: [
   *     {title, keyword, isnew},
   *     {title, keyword, isnew},...
   *   ],
   *   一: [],
   *   ...
   * }
   * → xwb := [...W].join('\0'); # ordered by WEEKDAY_STR #
   * → W := [...B].join('\1')
   * → B := [T, K, N].join('\2')
   * → N := true: 1; false: 0;
   */
  const compressedEncode = (wb) => {
    return [...WEEKDAY_STR]
      .map((w) =>
        wb[w]
          .map((b) => [b.title, b.keyword, Number(b.isnew)].join('\x02'))
          .join('\x01'),
      )
      .join('\x00');
  };

  const compressedDecode = (xwb) => {
    return xwb
      .split('\x00')
      .map((xw, i) => {
        return {
          [WEEKDAY_STR[i]]: xw.split('\x01')
            .filter(Boolean)
            .map((b) => {
              const [title, keyword, isnew] = b.split('\x02');
              return {
                title,
                keyword,
                isnew: isnew === '1',
              };
            }),
        };
      })
      .reduce((c, v) => {
        return Object.assign(c, v);
      }, {});
  };

  const encodeWeeklyBangumiToStorage = (wb) => {
    return lzString.compressToBase64(compressedEncode(wb));
  };

  const decodeWeeklyBangumiFromStorage = (xwb) => {
    return compressedDecode(lzString.decompressFromBase64(xwb));
  };

  const STORAGE_KEY = 'DMHY-Bangumi-Index::weekly-bangumi';
  const CACHE_KEY = 'DMHY-Bangumi-Index::weekly-bangumi-cache-t';

  const save = () => {
    localStorage.setItem(
      STORAGE_KEY,
      encodeWeeklyBangumiToStorage(weeklyBangumi.value),
    );
  };

  const load = () => {
    const xwb = localStorage.getItem(STORAGE_KEY);
    if (xwb) {
      weeklyBangumi.value = decodeWeeklyBangumiFromStorage(xwb) || {};
    } else {
      weeklyBangumi.value = {};
    }
  };

  const add = (payload) => {
    for (const weekdayStr of WEEKDAY_STR) {
      if (!weeklyBangumi.value[weekdayStr]) {
        weeklyBangumi.value[weekdayStr] = [];
      }
      weeklyBangumi.value[weekdayStr].push(...payload[weekdayStr]);
    }
  };

  const loadRemote = async() => {
    const [oldPayload, newPayload] = await Promise.all([
      downloadBangumi('old'),
      downloadBangumi('new'),
    ]);
    add(oldPayload);
    add(newPayload);
    localStorage.setItem(CACHE_KEY, Date.now());
    save();
  };

  const loadWithCache = async() => {
    const cacheTime = Number(localStorage.getItem(CACHE_KEY)) || 0;
    const maxCacheTime = 12 * HOUR_IN_MS;
    if (Date.now() - cacheTime > maxCacheTime) {
      await loadRemote();
    } else {
      load();
    }
  };

  const cleanCacheTime = () => {
    localStorage.setItem(CACHE_KEY, 0);
  };

  var script$1 = {
    setup() {
      const date = new Date();
      const todayWeekday = date.getDay();
      const toggleExpansion = () => set(!get());

      const expansionStr = vue.computed(() => get() ? '收起' : '展開');
      const todayStr = vue.computed(() => {
        const longWeekdayStr = new Intl.DateTimeFormat('zh', {
          weekday: 'long',
        }).format(date);

        const dateStr = new Intl.DateTimeFormat('zh', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(date);

        return `西元 ${dateStr} ${longWeekdayStr}`;
      });

      const TODAY_SENSITIVE_WEEKDAY_STR = WEEKDAY_STR.repeat(3)
        .slice(todayWeekday + 5, todayWeekday + 12);

      const orderedWeeklyBangumi = vue.computed(() => {
        const weeklyBangumiMap = [...TODAY_SENSITIVE_WEEKDAY_STR].reduce(
          (collection, weekdayStr) => {
            return collection.set(weekdayStr, weeklyBangumi.value[weekdayStr]);
          },
          new Map(),
        );
        return [...weeklyBangumiMap.entries()];
      });

      const forceUpdateWeekly = async() => {
        cleanCacheTime();
        location.assign('https://share.dmhy.org/');
      };

      const isIndexShow = (index) => get() ? true : index < 4;

      return {
        todayStr,
        expansionStr,
        orderedWeeklyBangumi,

        toggleExpansion,
        createKeywordLink,
        transformWeekday,
        isIndexShow,
        forceUpdateWeekly,
      };
    },
  };

  const _withId$1 = /*#__PURE__*/vue.withScopeId("data-v-b9eba4a6");

  vue.pushScopeId("data-v-b9eba4a6");
  const _hoisted_1$1 = /*#__PURE__*/vue.createVNode("span", null, "新番資源索引", -1 /* HOISTED */);
  const _hoisted_2$1 = { class: "weekly-table" };
  const _hoisted_3$1 = { class: "weekly-weekday-str" };
  vue.popScopeId();

  const render$1 = /*#__PURE__*/_withId$1((_ctx, _cache, $props, $setup, $data, $options) => {
    return (vue.openBlock(), vue.createBlock("div", null, [
      vue.createVNode("header", null, [
        _hoisted_1$1,
        vue.createVNode("span", null, vue.toDisplayString($setup.todayStr), 1 /* TEXT */),
        vue.createVNode("span", null, [
          vue.createVNode("a", {
            href: "javascript:;",
            role: "button",
            onClick: _cache[1] || (_cache[1] = (...args) => ($setup.toggleExpansion && $setup.toggleExpansion(...args)))
          }, vue.toDisplayString($setup.expansionStr), 1 /* TEXT */)
        ]),
        vue.createVNode("span", null, [
          vue.createVNode("a", {
            href: "javascript:;",
            role: "button",
            onClick: _cache[2] || (_cache[2] = (...args) => ($setup.forceUpdateWeekly && $setup.forceUpdateWeekly(...args)))
          }, "強制更新")
        ])
      ]),
      vue.createVNode("table", _hoisted_2$1, [
        (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($setup.orderedWeeklyBangumi, ([weekday, dayBangumiList], index) => {
          return vue.withDirectives((vue.openBlock(), vue.createBlock("tr", {
            key: weekday,
            class: ["weekly-tr", { 'weekly-tr-today': index === 2 }]
          }, [
            vue.createVNode("td", _hoisted_3$1, vue.toDisplayString($setup.transformWeekday(weekday)), 1 /* TEXT */),
            vue.createVNode("td", null, [
              (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList(dayBangumiList, (bangumi) => {
                return (vue.openBlock(), vue.createBlock("a", {
                  key: bangumi.title,
                  class: ["bangumi", { 'bangumi-old': !bangumi.isnew }],
                  href: $setup.createKeywordLink(bangumi.keyword)
                }, vue.toDisplayString(bangumi.title), 11 /* TEXT, CLASS, PROPS */, ["href"]))
              }), 128 /* KEYED_FRAGMENT */))
            ])
          ], 2 /* CLASS */)), [
            [vue.vShow, $setup.isIndexShow(index)]
          ])
        }), 128 /* KEYED_FRAGMENT */))
      ])
    ]))
  });

  var css_248z$1 = "\na[data-v-b9eba4a6] {\n  color: #247;\n  text-decoration: none;\n}\nheader[data-v-b9eba4a6] {\n  color: #fff;\n  background-color: #247;\n  padding: 5px;\n  display: flex;\n  font-size: 0.8rem;\n}\nheader > span[data-v-b9eba4a6]:nth-of-type(n + 2)::before {\n  content: \"::\";\n  padding: 0 8px;\n}\nheader > span > a[data-v-b9eba4a6] {\n  color: #fff;\n}\n.weekly-table[data-v-b9eba4a6] {\n  border-collapse: collapse;\n  width: 100%;\n}\n.weekly-tr[data-v-b9eba4a6] {\n  display: flex;\n  align-items: center;\n  border: 2px solid white;\n  background: white;\n}\n.weekly-tr.weekly-tr-today[data-v-b9eba4a6] {\n  background-color: #ff9;\n}\n.weekly-weekday-str[data-v-b9eba4a6] {\n  padding: 3px 15px;\n  margin-right: 3px;\n  background-color: #7e99be;\n  color: white;\n  font-weight: bolder;\n}\n.weekly-weekday-str + td[data-v-b9eba4a6] {\n  display: flex;\n  flex-flow: row wrap;\n  flex: 1;\n}\n.bangumi[data-v-b9eba4a6] {\n  border: 1px solid #ffa500;\n  padding: 2px;\n  margin: 1px 3px;\n  display: inline-flex;\n  align-items: center;\n}\n.bangumi-old[data-v-b9eba4a6] {\n  border: 1px solid #002fff;\n}\n";
  styleInject(css_248z$1);

  script$1.render = render$1;
  script$1.__scopeId = "data-v-b9eba4a6";

  const routes = [
    { path: '/weekly', component: script$1 },
    { path: '/favorite', component: script$2 },
  ];

  const router = vueRouter.createRouter({
    history: vueRouter.createWebHashHistory(),
    routes,
  });

  var script = {
    setup() {
      const router = vueRouter.useRouter();
      vue.onMounted(() => {
        router.push('/weekly');
        load$1();
        save$1();
        loadWithCache();
      });
    },
  };

  const _withId = /*#__PURE__*/vue.withScopeId("data-v-da470c48");

  vue.pushScopeId("data-v-da470c48");
  const _hoisted_1 = { id: "🌐" };
  const _hoisted_2 = /*#__PURE__*/vue.createTextVNode(" 新番索引 ");
  const _hoisted_3 = /*#__PURE__*/vue.createTextVNode(" 書籤索引 ");
  vue.popScopeId();

  const render = /*#__PURE__*/_withId((_ctx, _cache, $props, $setup, $data, $options) => {
    const _component_router_link = vue.resolveComponent("router-link");
    const _component_router_view = vue.resolveComponent("router-view");

    return (vue.openBlock(), vue.createBlock("div", _hoisted_1, [
      vue.createVNode("nav", null, [
        vue.createVNode(_component_router_link, { to: "/weekly" }, {
          default: _withId(() => [
            _hoisted_2
          ]),
          _: 1 /* STABLE */
        }),
        vue.createVNode(_component_router_link, { to: "/favorite" }, {
          default: _withId(() => [
            _hoisted_3
          ]),
          _: 1 /* STABLE */
        })
      ]),
      vue.createVNode(_component_router_view, { class: "page-view" })
    ]))
  });

  var css_248z = "\n#🌐[data-v-da470c48] {\n  margin-top: 20px;\n  font-size: 14px;\n}\na[data-v-da470c48] {\n  color: black;\n  text-decoration: none;\n}\nnav > a[data-v-da470c48] {\n  display: inline-block;\n  padding: 3px 15px;\n  background: #fff;\n  cursor: pointer;\n  border-top: 1px solid #247;\n  border-left: 1px solid #247;\n  border-right: 1px solid #247;\n  border-radius: 5px 5px 0 0;\n}\nnav > a.router-link-exact-active[data-v-da470c48] {\n  border-top: 3px solid dodgerblue;\n}\n.page-view[data-v-da470c48] {\n  border: 1px solid #247;\n}\n";
  styleInject(css_248z);

  script.render = render;
  script.__scopeId = "data-v-da470c48";

  // pre-process

  const adSelectors = [
    '.ad',
    '[id="1280_ad"] > a',
    '.main > div:first-child',
  ].join(',');
  for (const adEl of $$(adSelectors)) {
    adEl.remove();
  }

  // entry point

  const app = vue.createApp(script)
    .use(router)
    .mount($('#mini_jmd').parentElement);

  unsafeWindow.DMHYBangumiIndex$app = app;

}(Vue, LZString, jsyaml, VueRouter));
