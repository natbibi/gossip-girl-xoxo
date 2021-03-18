(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sheet = require('@emotion/sheet');
var Stylis = _interopDefault(require('@emotion/stylis'));
require('@emotion/weak-memoize');

// https://github.com/thysultan/stylis.js/tree/master/plugins/rule-sheet
// inlined to avoid umd wrapper and peerDep warnings/installing stylis
// since we use stylis after closure compiler
var delimiter = '/*|*/';
var needle = delimiter + '}';

function toSheet(block) {
  if (block) {
    Sheet.current.insert(block + '}');
  }
}

var Sheet = {
  current: null
};
var ruleSheet = function ruleSheet(context, content, selectors, parents, line, column, length, ns, depth, at) {
  switch (context) {
    // property
    case 1:
      {
        switch (content.charCodeAt(0)) {
          case 64:
            {
              // @import
              Sheet.current.insert(content + ';');
              return '';
            }
          // charcode for l

          case 108:
            {
              // charcode for b
              // this ignores label
              if (content.charCodeAt(2) === 98) {
                return '';
              }
            }
        }

        break;
      }
    // selector

    case 2:
      {
        if (ns === 0) return content + delimiter;
        break;
      }
    // at-rule

    case 3:
      {
        switch (ns) {
          // @font-face, @page
          case 102:
          case 112:
            {
              Sheet.current.insert(selectors[0] + content);
              return '';
            }

          default:
            {
              return content + (at === 0 ? delimiter : '');
            }
        }
      }

    case -2:
      {
        content.split(needle).forEach(toSheet);
      }
  }
};

var createCache = function createCache(options) {
  if (options === undefined) options = {};
  var key = options.key || 'css';
  var stylisOptions;

  if (options.prefix !== undefined) {
    stylisOptions = {
      prefix: options.prefix
    };
  }

  var stylis = new Stylis(stylisOptions);

  if (process.env.NODE_ENV !== 'production') {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {}; // $FlowFixMe

  var container;

  {
    container = options.container || document.head;
    var nodes = document.querySelectorAll("style[data-emotion-" + key + "]");
    Array.prototype.forEach.call(nodes, function (node) {
      var attrib = node.getAttribute("data-emotion-" + key); // $FlowFixMe

      attrib.split(' ').forEach(function (id) {
        inserted[id] = true;
      });

      if (node.parentNode !== container) {
        container.appendChild(node);
      }
    });
  }

  var _insert;

  {
    stylis.use(options.stylisPlugins)(ruleSheet);

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      var name = serialized.name;
      Sheet.current = sheet;

      if (process.env.NODE_ENV !== 'production' && serialized.map !== undefined) {
        var map = serialized.map;
        Sheet.current = {
          insert: function insert(rule) {
            sheet.insert(rule + map);
          }
        };
      }

      stylis(selector, serialized.styles);

      if (shouldCache) {
        cache.inserted[name] = true;
      }
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    // https://esbench.com/bench/5bf7371a4cd7e6009ef61d0a
    var commentStart = /\/\*/g;
    var commentEnd = /\*\//g;
    stylis.use(function (context, content) {
      switch (context) {
        case -1:
          {
            while (commentStart.test(content)) {
              commentEnd.lastIndex = commentStart.lastIndex;

              if (commentEnd.test(content)) {
                commentStart.lastIndex = commentEnd.lastIndex;
                continue;
              }

              throw new Error('Your styles have an unterminated comment ("/*" without corresponding "*/").');
            }

            commentStart.lastIndex = 0;
            break;
          }
      }
    });
    stylis.use(function (context, content, selectors) {
      switch (context) {
        case -1:
          {
            var flag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';
            var unsafePseudoClasses = content.match(/(:first|:nth|:nth-last)-child/g);

            if (unsafePseudoClasses && cache.compat !== true) {
              unsafePseudoClasses.forEach(function (unsafePseudoClass) {
                var ignoreRegExp = new RegExp(unsafePseudoClass + ".*\\/\\* " + flag + " \\*\\/");
                var ignore = ignoreRegExp.test(content);

                if (unsafePseudoClass && !ignore) {
                  console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
                }
              });
            }

            break;
          }
      }
    });
  }

  var cache = {
    key: key,
    sheet: new sheet.StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  return cache;
};

exports.default = createCache;

}).call(this)}).call(this,require('_process'))
},{"@emotion/sheet":5,"@emotion/stylis":6,"@emotion/weak-memoize":9,"_process":68}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

exports.default = murmur2;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

exports.default = memoize;

},{}],4:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var hashString = _interopDefault(require('@emotion/hash'));
var unitless = _interopDefault(require('@emotion/unitless'));
var memoize = _interopDefault(require('@emotion/memoize'));

var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = memoize(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (unitless[key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

if (process.env.NODE_ENV !== 'production') {
  var contentValuePattern = /(attr|calc|counters?|url)\(/;
  var contentValues = ['normal', 'none', 'counter', 'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        console.error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);

    if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, _char) {
        return _char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

var shouldWarnAboutInterpolatingClassNameFromCss = true;

function handleInterpolation(mergedProps, registered, interpolation, couldBeSelectorInterpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {
    if (process.env.NODE_ENV !== 'production' && interpolation.toString() === 'NO_COMPONENT_SELECTOR') {
      throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
    }

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles + ";";

          if (process.env.NODE_ENV !== 'production' && interpolation.map !== undefined) {
            styles += interpolation.map;
          }

          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result, couldBeSelectorInterpolation);
        } else if (process.env.NODE_ENV !== 'production') {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        break;
      }

    case 'string':
      if (process.env.NODE_ENV !== 'production') {
        var matched = [];
        var replaced = interpolation.replace(animationRegex, function (match, p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
          return "${" + fakeVarName + "}";
        });

        if (matched.length) {
          console.error('`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\n' + 'Instead of doing this:\n\n' + [].concat(matched, ["`" + replaced + "`"]).join('\n') + '\n\nYou should wrap it with `css` like this:\n\n' + ("css`" + replaced + "`"));
        }
      }

      break;
  } // finalize string values (regular strings and functions interpolated into css calls)


  if (registered == null) {
    return interpolation;
  }

  var cached = registered[interpolation];

  if (process.env.NODE_ENV !== 'production' && couldBeSelectorInterpolation && shouldWarnAboutInterpolatingClassNameFromCss && cached !== undefined) {
    console.error('Interpolating a className from css`` is not recommended and will cause problems with composition.\n' + 'Interpolating a className from css`` will be completely unsupported in a future major version of Emotion');
    shouldWarnAboutInterpolatingClassNameFromCss = false;
  }

  return cached !== undefined && !couldBeSelectorInterpolation ? cached : interpolation;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i], false);
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue(value)) {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && process.env.NODE_ENV !== 'production') {
          throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value, false);

          switch (_key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                if (process.env.NODE_ENV !== 'production' && _key === 'undefined') {
                  console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
                }

                string += _key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*;/g;
var sourceMapPattern;

if (process.env.NODE_ENV !== 'production') {
  sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//;
} // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list


var cursor;
var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings, false);
  } else {
    if (process.env.NODE_ENV !== 'production' && strings[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
    }

    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i], styles.charCodeAt(styles.length - 1) === 46);

    if (stringMode) {
      if (process.env.NODE_ENV !== 'production' && strings[i] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles += strings[i];
    }
  }

  var sourceMap;

  if (process.env.NODE_ENV !== 'production') {
    styles = styles.replace(sourceMapPattern, function (match) {
      sourceMap = match;
      return '';
    });
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = hashString(styles) + identifierName;

  if (process.env.NODE_ENV !== 'production') {
    // $FlowFixMe SerializedStyles type doesn't have toString property (and we don't want to add it)
    return {
      name: name,
      styles: styles,
      map: sourceMap,
      next: cursor,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }
    };
  }

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};

exports.serializeStyles = serializeStyles;

}).call(this)}).call(this,require('_process'))
},{"@emotion/hash":2,"@emotion/memoize":3,"@emotion/unitless":7,"_process":68}],5:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  return tag;
}

var StyleSheet =
/*#__PURE__*/
function () {
  function StyleSheet(options) {
    this.isSpeedy = options.speedy === undefined ? process.env.NODE_ENV === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      var _tag = createStyleElement(this);

      var before;

      if (this.tags.length === 0) {
        before = this.before;
      } else {
        before = this.tags[this.tags.length - 1].nextSibling;
      }

      this.container.insertBefore(_tag, before);
      this.tags.push(_tag);
    }

    var tag = this.tags[this.tags.length - 1];

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is a really hot path
        // we check the second character first because having "i"
        // as the second character will happen less often than
        // having "@" as the first character
        var isImportRule = rule.charCodeAt(1) === 105 && rule.charCodeAt(0) === 64; // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools

        sheet.insertRule(rule, // we need to insert @import rules before anything else
        // otherwise there will be an error
        // technically this means that the @import rules will
        // _usually_(not always since there could be multiple style tags)
        // be the first ones in prod and generally later in dev
        // this shouldn't really matter in the real world though
        // @import is generally only used for font faces from google fonts and etc.
        // so while this could be technically correct then it would be slower and larger
        // for a tiny bit of correctness that won't matter in the real world
        isImportRule ? 0 : sheet.cssRules.length);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;
  };

  return StyleSheet;
}();

exports.StyleSheet = StyleSheet;

}).call(this)}).call(this,require('_process'))
},{"_process":68}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function stylis_min (W) {
  function M(d, c, e, h, a) {
    for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B = e.length, J = B - 1, y, f = '', p = '', F = '', G = '', C; l < B;) {
      g = e.charCodeAt(l);
      l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B++, J++);

      if (0 === b + n + v + m) {
        if (l === J && (0 < r && (f = f.replace(N, '')), 0 < f.trim().length)) {
          switch (g) {
            case 32:
            case 9:
            case 59:
            case 13:
            case 10:
              break;

            default:
              f += e.charAt(l);
          }

          g = 59;
        }

        switch (g) {
          case 123:
            f = f.trim();
            q = f.charCodeAt(0);
            k = 1;

            for (t = ++l; l < B;) {
              switch (g = e.charCodeAt(l)) {
                case 123:
                  k++;
                  break;

                case 125:
                  k--;
                  break;

                case 47:
                  switch (g = e.charCodeAt(l + 1)) {
                    case 42:
                    case 47:
                      a: {
                        for (u = l + 1; u < J; ++u) {
                          switch (e.charCodeAt(u)) {
                            case 47:
                              if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                l = u + 1;
                                break a;
                              }

                              break;

                            case 10:
                              if (47 === g) {
                                l = u + 1;
                                break a;
                              }

                          }
                        }

                        l = u;
                      }

                  }

                  break;

                case 91:
                  g++;

                case 40:
                  g++;

                case 34:
                case 39:
                  for (; l++ < J && e.charCodeAt(l) !== g;) {
                  }

              }

              if (0 === k) break;
              l++;
            }

            k = e.substring(t, l);
            0 === q && (q = (f = f.replace(ca, '').trim()).charCodeAt(0));

            switch (q) {
              case 64:
                0 < r && (f = f.replace(N, ''));
                g = f.charCodeAt(1);

                switch (g) {
                  case 100:
                  case 109:
                  case 115:
                  case 45:
                    r = c;
                    break;

                  default:
                    r = O;
                }

                k = M(c, r, k, g, a + 1);
                t = k.length;
                0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(''), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ''));
                if (0 < t) switch (g) {
                  case 115:
                    f = f.replace(da, ea);

                  case 100:
                  case 109:
                  case 45:
                    k = f + '{' + k + '}';
                    break;

                  case 107:
                    f = f.replace(fa, '$1 $2');
                    k = f + '{' + k + '}';
                    k = 1 === w || 2 === w && L('@' + k, 3) ? '@-webkit-' + k + '@' + k : '@' + k;
                    break;

                  default:
                    k = f + k, 112 === h && (k = (p += k, ''));
                } else k = '';
                break;

              default:
                k = M(c, X(c, f, I), k, h, a + 1);
            }

            F += k;
            k = I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
            break;

          case 125:
          case 59:
            f = (0 < r ? f.replace(N, '') : f).trim();
            if (1 < (t = f.length)) switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(' ', ':')).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = '\x00\x00'), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
              case 0:
                break;

              case 64:
                if (105 === g || 99 === g) {
                  G += f + e.charAt(l);
                  break;
                }

              default:
                58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
            }
            I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
        }
      }

      switch (g) {
        case 13:
        case 10:
          47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += '\x00');
          0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
          z = 1;
          D++;
          break;

        case 59:
        case 125:
          if (0 === b + n + v + m) {
            z++;
            break;
          }

        default:
          z++;
          y = e.charAt(l);

          switch (g) {
            case 9:
            case 32:
              if (0 === n + m + b) switch (x) {
                case 44:
                case 58:
                case 9:
                case 32:
                  y = '';
                  break;

                default:
                  32 !== g && (y = ' ');
              }
              break;

            case 0:
              y = '\\0';
              break;

            case 12:
              y = '\\f';
              break;

            case 11:
              y = '\\v';
              break;

            case 38:
              0 === n + b + m && (r = I = 1, y = '\f' + y);
              break;

            case 108:
              if (0 === n + b + m + E && 0 < u) switch (l - u) {
                case 2:
                  112 === x && 58 === e.charCodeAt(l - 3) && (E = x);

                case 8:
                  111 === K && (E = K);
              }
              break;

            case 58:
              0 === n + b + m && (u = l);
              break;

            case 44:
              0 === b + v + n + m && (r = 1, y += '\r');
              break;

            case 34:
            case 39:
              0 === b && (n = n === g ? 0 : 0 === n ? g : n);
              break;

            case 91:
              0 === n + b + v && m++;
              break;

            case 93:
              0 === n + b + v && m--;
              break;

            case 41:
              0 === n + b + m && v--;
              break;

            case 40:
              if (0 === n + b + m) {
                if (0 === q) switch (2 * x + 3 * K) {
                  case 533:
                    break;

                  default:
                    q = 1;
                }
                v++;
              }

              break;

            case 64:
              0 === b + v + n + m + u + k && (k = 1);
              break;

            case 42:
            case 47:
              if (!(0 < n + m + v)) switch (b) {
                case 0:
                  switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                    case 235:
                      b = 47;
                      break;

                    case 220:
                      t = l, b = 42;
                  }

                  break;

                case 42:
                  47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = '', b = 0);
              }
          }

          0 === b && (f += y);
      }

      K = x;
      x = g;
      l++;
    }

    t = p.length;

    if (0 < t) {
      r = c;
      if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length)) return G + p + F;
      p = r.join(',') + '{' + p + '}';

      if (0 !== w * E) {
        2 !== w || L(p, 2) || (E = 0);

        switch (E) {
          case 111:
            p = p.replace(ha, ':-moz-$1') + p;
            break;

          case 112:
            p = p.replace(Q, '::-webkit-input-$1') + p.replace(Q, '::-moz-$1') + p.replace(Q, ':-ms-input-$1') + p;
        }

        E = 0;
      }
    }

    return G + p + F;
  }

  function X(d, c, e) {
    var h = c.trim().split(ia);
    c = h;
    var a = h.length,
        m = d.length;

    switch (m) {
      case 0:
      case 1:
        var b = 0;

        for (d = 0 === m ? '' : d[0] + ' '; b < a; ++b) {
          c[b] = Z(d, c[b], e).trim();
        }

        break;

      default:
        var v = b = 0;

        for (c = []; b < a; ++b) {
          for (var n = 0; n < m; ++n) {
            c[v++] = Z(d[n] + ' ', h[b], e).trim();
          }
        }

    }

    return c;
  }

  function Z(d, c, e) {
    var h = c.charCodeAt(0);
    33 > h && (h = (c = c.trim()).charCodeAt(0));

    switch (h) {
      case 38:
        return c.replace(F, '$1' + d.trim());

      case 58:
        return d.trim() + c.replace(F, '$1' + d.trim());

      default:
        if (0 < 1 * e && 0 < c.indexOf('\f')) return c.replace(F, (58 === d.charCodeAt(0) ? '' : '$1') + d.trim());
    }

    return d + c;
  }

  function P(d, c, e, h) {
    var a = d + ';',
        m = 2 * c + 3 * e + 4 * h;

    if (944 === m) {
      d = a.indexOf(':', 9) + 1;
      var b = a.substring(d, a.length - 1).trim();
      b = a.substring(0, d).trim() + b + ';';
      return 1 === w || 2 === w && L(b, 1) ? '-webkit-' + b + b : b;
    }

    if (0 === w || 2 === w && !L(a, 1)) return a;

    switch (m) {
      case 1015:
        return 97 === a.charCodeAt(10) ? '-webkit-' + a + a : a;

      case 951:
        return 116 === a.charCodeAt(3) ? '-webkit-' + a + a : a;

      case 963:
        return 110 === a.charCodeAt(5) ? '-webkit-' + a + a : a;

      case 1009:
        if (100 !== a.charCodeAt(4)) break;

      case 969:
      case 942:
        return '-webkit-' + a + a;

      case 978:
        return '-webkit-' + a + '-moz-' + a + a;

      case 1019:
      case 983:
        return '-webkit-' + a + '-moz-' + a + '-ms-' + a + a;

      case 883:
        if (45 === a.charCodeAt(8)) return '-webkit-' + a + a;
        if (0 < a.indexOf('image-set(', 11)) return a.replace(ja, '$1-webkit-$2') + a;
        break;

      case 932:
        if (45 === a.charCodeAt(4)) switch (a.charCodeAt(5)) {
          case 103:
            return '-webkit-box-' + a.replace('-grow', '') + '-webkit-' + a + '-ms-' + a.replace('grow', 'positive') + a;

          case 115:
            return '-webkit-' + a + '-ms-' + a.replace('shrink', 'negative') + a;

          case 98:
            return '-webkit-' + a + '-ms-' + a.replace('basis', 'preferred-size') + a;
        }
        return '-webkit-' + a + '-ms-' + a + a;

      case 964:
        return '-webkit-' + a + '-ms-flex-' + a + a;

      case 1023:
        if (99 !== a.charCodeAt(8)) break;
        b = a.substring(a.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
        return '-webkit-box-pack' + b + '-webkit-' + a + '-ms-flex-pack' + b + a;

      case 1005:
        return ka.test(a) ? a.replace(aa, ':-webkit-') + a.replace(aa, ':-moz-') + a : a;

      case 1e3:
        b = a.substring(13).trim();
        c = b.indexOf('-') + 1;

        switch (b.charCodeAt(0) + b.charCodeAt(c)) {
          case 226:
            b = a.replace(G, 'tb');
            break;

          case 232:
            b = a.replace(G, 'tb-rl');
            break;

          case 220:
            b = a.replace(G, 'lr');
            break;

          default:
            return a;
        }

        return '-webkit-' + a + '-ms-' + b + a;

      case 1017:
        if (-1 === a.indexOf('sticky', 9)) break;

      case 975:
        c = (a = d).length - 10;
        b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(':', 7) + 1).trim();

        switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
          case 203:
            if (111 > b.charCodeAt(8)) break;

          case 115:
            a = a.replace(b, '-webkit-' + b) + ';' + a;
            break;

          case 207:
          case 102:
            a = a.replace(b, '-webkit-' + (102 < m ? 'inline-' : '') + 'box') + ';' + a.replace(b, '-webkit-' + b) + ';' + a.replace(b, '-ms-' + b + 'box') + ';' + a;
        }

        return a + ';';

      case 938:
        if (45 === a.charCodeAt(5)) switch (a.charCodeAt(6)) {
          case 105:
            return b = a.replace('-items', ''), '-webkit-' + a + '-webkit-box-' + b + '-ms-flex-' + b + a;

          case 115:
            return '-webkit-' + a + '-ms-flex-item-' + a.replace(ba, '') + a;

          default:
            return '-webkit-' + a + '-ms-flex-line-pack' + a.replace('align-content', '').replace(ba, '') + a;
        }
        break;

      case 973:
      case 989:
        if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4)) break;

      case 931:
      case 953:
        if (!0 === la.test(d)) return 115 === (b = d.substring(d.indexOf(':') + 1)).charCodeAt(0) ? P(d.replace('stretch', 'fill-available'), c, e, h).replace(':fill-available', ':stretch') : a.replace(b, '-webkit-' + b) + a.replace(b, '-moz-' + b.replace('fill-', '')) + a;
        break;

      case 962:
        if (a = '-webkit-' + a + (102 === a.charCodeAt(5) ? '-ms-' + a : '') + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf('transform', 10)) return a.substring(0, a.indexOf(';', 27) + 1).replace(ma, '$1-webkit-$2') + a;
    }

    return a;
  }

  function L(d, c) {
    var e = d.indexOf(1 === c ? ':' : '{'),
        h = d.substring(0, 3 !== c ? e : 10);
    e = d.substring(e + 1, d.length - 1);
    return R(2 !== c ? h : h.replace(na, '$1'), e, c);
  }

  function ea(d, c) {
    var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
    return e !== c + ';' ? e.replace(oa, ' or ($1)').substring(4) : '(' + c + ')';
  }

  function H(d, c, e, h, a, m, b, v, n, q) {
    for (var g = 0, x = c, w; g < A; ++g) {
      switch (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
        case void 0:
        case !1:
        case !0:
        case null:
          break;

        default:
          x = w;
      }
    }

    if (x !== c) return x;
  }

  function T(d) {
    switch (d) {
      case void 0:
      case null:
        A = S.length = 0;
        break;

      default:
        if ('function' === typeof d) S[A++] = d;else if ('object' === typeof d) for (var c = 0, e = d.length; c < e; ++c) {
          T(d[c]);
        } else Y = !!d | 0;
    }

    return T;
  }

  function U(d) {
    d = d.prefix;
    void 0 !== d && (R = null, d ? 'function' !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
    return U;
  }

  function B(d, c) {
    var e = d;
    33 > e.charCodeAt(0) && (e = e.trim());
    V = e;
    e = [V];

    if (0 < A) {
      var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
      void 0 !== h && 'string' === typeof h && (c = h);
    }

    var a = M(O, e, c, 0, 0);
    0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
    V = '';
    E = 0;
    z = D = 1;
    return a;
  }

  var ca = /^\0+/g,
      N = /[\0\r\f]/g,
      aa = /: */g,
      ka = /zoo|gra/,
      ma = /([,: ])(transform)/g,
      ia = /,\r+?/g,
      F = /([\t\r\n ])*\f?&/g,
      fa = /@(k\w+)\s*(\S*)\s*/,
      Q = /::(place)/g,
      ha = /:(read-only)/g,
      G = /[svh]\w+-[tblr]{2}/,
      da = /\(\s*(.*)\s*\)/g,
      oa = /([\s\S]*?);/g,
      ba = /-self|flex-/g,
      na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
      la = /stretch|:\s*\w+\-(?:conte|avail)/,
      ja = /([^-])(image-set\()/,
      z = 1,
      D = 1,
      E = 0,
      w = 1,
      O = [],
      S = [],
      A = 0,
      R = null,
      Y = 0,
      V = '';
  B.use = T;
  B.set = U;
  void 0 !== W && U(W);
  return B;
}

exports.default = stylis_min;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

exports.default = unitlessKeys;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isBrowser = "object" !== 'undefined';
function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className]);
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser === false && cache.compat !== undefined) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      var maybeStyles = cache.insert("." + className, current, cache.sheet, true);

      current = current.next;
    } while (current !== undefined);
  }
};

exports.getRegisteredStyles = getRegisteredStyles;
exports.insertStyles = insertStyles;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

exports.default = weakMemoize;

},{}],10:[function(require,module,exports){
(function (global){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore next */
exports.default = ((typeof window !== 'undefined' ? window : global) || {});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingback = exports.mergeAttributes = void 0;
var merge_attributes_1 = require("./merge-attributes");
Object.defineProperty(exports, "mergeAttributes", { enumerable: true, get: function () { return __importDefault(merge_attributes_1).default; } });
var pingback_1 = require("./pingback");
Object.defineProperty(exports, "pingback", { enumerable: true, get: function () { return __importDefault(pingback_1).default; } });
__exportStar(require("./types"), exports);

},{"./merge-attributes":12,"./pingback":13,"./types":15}],12:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_util_1 = require("@giphy/js-util");
var mergeAttribute = function (attributes, newAttributes, key) {
    var _a;
    var result1 = js_util_1.pick(attributes, [key]);
    var result2 = js_util_1.pick(newAttributes, [key]);
    if (result1[key] && result2[key]) {
        return __assign(__assign(__assign({}, attributes), newAttributes), (_a = {}, _a[key] = result1[key] + ', ' + result2[key], _a));
    }
    return __assign(__assign({}, attributes), newAttributes);
};
exports.default = mergeAttribute;

},{"@giphy/js-util":54}],13:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_util_1 = require("@giphy/js-util");
var throttle_debounce_1 = require("throttle-debounce");
var global_1 = __importDefault(require("./global"));
var send_pingback_1 = require("./send-pingback");
var queuedPingbackEvents = [];
global_1.default.giphyRandomId = js_util_1.getPingbackId();
var loggedInUserId = '';
function sendPingbacks() {
    var sendEvents = __spreadArrays(queuedPingbackEvents);
    queuedPingbackEvents = [];
    send_pingback_1.sendPingback(sendEvents);
}
var debouncedPingbackEvent = throttle_debounce_1.debounce(1000, sendPingbacks);
var pingback = function (_a) {
    var userId = _a.userId, eventType = _a.eventType, actionType = _a.actionType, attributes = _a.attributes, _b = _a.queueEvents, queueEvents = _b === void 0 ? true : _b, analyticsResponsePayload = _a.analyticsResponsePayload;
    // save the user id for whenever create session is invoked
    loggedInUserId = userId ? String(userId) : loggedInUserId;
    var newEvent = {
        ts: Date.now(),
        attributes: attributes,
        action_type: actionType,
        user_id: js_util_1.getPingbackId(),
        analytics_response_payload: analyticsResponsePayload,
    };
    if (loggedInUserId) {
        newEvent.logged_in_user_id = loggedInUserId;
    }
    // add verification mode
    if (newEvent.analytics_response_payload) {
        newEvent.analytics_response_payload = "" + newEvent.analytics_response_payload + (js_util_1.Logger.ENABLED ? '&mode=verification' : '');
    }
    if (eventType) {
        newEvent.event_type = eventType;
    }
    queuedPingbackEvents.push(newEvent);
    queueEvents ? debouncedPingbackEvent() : sendPingbacks();
};
exports.default = pingback;

},{"./global":10,"./send-pingback":14,"@giphy/js-util":54,"throttle-debounce":69}],14:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPingback = void 0;
var js_util_1 = require("@giphy/js-util");
var global_1 = __importDefault(require("./global"));
// TODO remove api key
var environment = (global_1.default === null || global_1.default === void 0 ? void 0 : global_1.default.GIPHY_PINGBACK_URL) || 'https://pingback.giphy.com';
var pingBackUrl = environment + "/v2/pingback?apikey=l0HlIwPWyBBUDAUgM";
exports.sendPingback = function (events) {
    var headers = js_util_1.getGiphySDKRequestHeaders();
    /* istanbul ignore next */
    headers === null || headers === void 0 ? void 0 : headers.set('Content-Type', 'application/json');
    js_util_1.Logger.debug("Pingback session", events);
    return fetch(pingBackUrl, {
        method: 'POST',
        body: JSON.stringify({ events: events }),
        headers: headers,
    });
};

},{"./global":10,"@giphy/js-util":54}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gifOverlayColor = exports.dimColor = exports.secondaryCTA = exports.primaryCTADisabled = exports.primaryCTA = exports.deleteColor = exports.errorColor = exports.smsColor = exports.redditColor = exports.instagramColor = exports.tumblrColor = exports.pinterestColor = exports.twitterColor = exports.facebookColor = exports.giphyPink = exports.giphyIndigo = exports.giphyLightBlue = exports.giphyAqua = exports.giphyYellow = exports.giphyRed = exports.giphyPurple = exports.giphyGreen = exports.giphyBlue = exports.giphyWhite = exports.giphyWhiteSmoke = exports.giphyLightestGrey = exports.giphyLightGrey = exports.giphyLightCharcoal = exports.giphyCharcoal = exports.giphyDarkCharcoal = exports.giphyDarkGrey = exports.giphyDarkestGrey = exports.giphyBlack = void 0;
/* greys */
exports.giphyBlack = '#121212';
exports.giphyDarkestGrey = '#212121';
exports.giphyDarkGrey = '#2e2e2e';
exports.giphyDarkCharcoal = '#3e3e3e';
exports.giphyCharcoal = '#4a4a4a';
exports.giphyLightCharcoal = '#5c5c5c';
exports.giphyLightGrey = '#a6a6a6';
exports.giphyLightestGrey = '#d8d8d8';
exports.giphyWhiteSmoke = '#ececec';
exports.giphyWhite = '#ffffff';
/* primary */
exports.giphyBlue = '#00ccff';
exports.giphyGreen = '#00ff99';
exports.giphyPurple = '#9933ff';
exports.giphyRed = '#ff6666';
exports.giphyYellow = '#fff35c';
/* secondary */
exports.giphyAqua = '#00e6cc';
exports.giphyLightBlue = '#3191ff';
exports.giphyIndigo = '#6157ff';
exports.giphyPink = '#e646b6';
/* social */
exports.facebookColor = '#3894fc';
exports.twitterColor = '#00ccff';
exports.pinterestColor = '#e54cb5';
exports.tumblrColor = '#529ecc';
exports.instagramColor = '#c23c8d';
exports.redditColor = '#fc6669';
exports.smsColor = '#00ff99';
/* functional */
exports.errorColor = exports.giphyRed;
exports.deleteColor = exports.giphyRed;
exports.primaryCTA = exports.giphyIndigo;
exports.primaryCTADisabled = '#241F74';
exports.secondaryCTA = exports.giphyCharcoal;
exports.dimColor = "rgba(0, 0, 0, 0.8)";
exports.gifOverlayColor = "rgba(0, 0, 0, 0.4)";

},{}],17:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = void 0;
__exportStar(require("./colors"), exports);
var loader_1 = require("./loader");
Object.defineProperty(exports, "loader", { enumerable: true, get: function () { return __importDefault(loader_1).default; } });
__exportStar(require("./typography"), exports);

},{"./colors":16,"./loader":18,"./typography":19}],18:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var emotion_1 = require("emotion");
var colors_1 = require("./colors");
var bouncer = emotion_1.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n     to {\n    transform: scale(1.75) translateY(-20px);\n  }\n"], ["\n     to {\n    transform: scale(1.75) translateY(-20px);\n  }\n"])));
var loaderHeight = 37;
var loader = emotion_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    height: ", "px;\n    padding-top: 15px;\n    margin: 0 auto;\n    text-align: center;\n    justify-content: center;\n    animation: pulse 0.8s ease-in-out 0s infinite alternate backwards;\n    div {\n        display: inline-block;\n        height: 10px;\n        width: 10px;\n        margin: ", "px 10px 10px 10px;\n        position: relative;\n        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);\n        animation: ", " cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.75s infinite alternate;\n        &:nth-child(5n + 1) {\n            background: ", ";\n            animation-delay: 0;\n        }\n        &:nth-child(5n + 2) {\n            background: ", ";\n            animation-delay: calc(0s + (0.1s * 1));\n        }\n        &:nth-child(5n + 3) {\n            background: ", ";\n            animation-delay: calc(0s + (0.1s * 2));\n        }\n        &:nth-child(5n + 4) {\n            background: ", ";\n            animation-delay: calc(0s + (0.1s * 3));\n        }\n        &:nth-child(5n + 5) {\n            background: ", ";\n            animation-delay: calc(0s + (0.1s * 4));\n        }\n    }\n"], ["\n    display: flex;\n    align-items: center;\n    height: ", "px;\n    padding-top: 15px;\n    margin: 0 auto;\n    text-align: center;\n    justify-content: center;\n    animation: pulse 0.8s ease-in-out 0s infinite alternate backwards;\n    div {\n        display: inline-block;\n        height: 10px;\n        width: 10px;\n        margin: ", "px 10px 10px 10px;\n        position: relative;\n        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);\n        animation: ", " cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.75s infinite alternate;\n        &:nth-child(5n + 1) {\n            background: ", ";\n            animation-delay: 0;\n        }\n        &:nth-child(5n + 2) {\n            background: ", ";\n            animation-delay: calc(0s + (0.1s * 1));\n        }\n        &:nth-child(5n + 3) {\n            background: ", ";\n            animation-delay: calc(0s + (0.1s * 2));\n        }\n        &:nth-child(5n + 4) {\n            background: ", ";\n            animation-delay: calc(0s + (0.1s * 3));\n        }\n        &:nth-child(5n + 5) {\n            background: ", ";\n            animation-delay: calc(0s + (0.1s * 4));\n        }\n    }\n"])), loaderHeight, loaderHeight, bouncer, colors_1.giphyGreen, colors_1.giphyBlue, colors_1.giphyPurple, colors_1.giphyRed, colors_1.giphyYellow);
exports.default = loader;
var templateObject_1, templateObject_2;

},{"./colors":16,"emotion":63}],19:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.css = exports.fontSize = exports.fontFamily = void 0;
var emotion_1 = require("emotion");
// eslint-disable-next-line
emotion_1.injectGlobal(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n@font-face {\n    font-family: 'interface';\n    font-style: normal;\n    font-weight: normal;\n    src: url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_Rg.woff2') format('woff2'),\n        url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_Rg.woff') format('woff');\n}\n\n@font-face {\n    font-family: 'interface';\n    font-style: normal;\n    font-weight: bold;\n    src: url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_Bd.woff2') format('woff2'),\n        url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_Bd.woff') format('woff');\n}\n@font-face {\n    font-family: 'interface';\n    font-style: normal;\n    font-weight: 900;\n    src: url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_XBd.woff') format('woff');\n}\n@font-face {\n    font-family: 'nexablack'; \n    font-style: normal;\n    font-weight: normal;\n    src: url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/nexa_black-webfont.woff2') format('woff2'),\n        url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/nexa_black-webfont.woff') format('woff');\n}\n@font-face {\n    font-family: 'SSStandard'; \n    font-style: normal;\n    font-weight: normal;\n    src:  url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/ss-standard.woff') format('woff');\n}\n@font-face {\n    font-family: 'SSSocial'; \n    font-style: normal;\n    font-weight: normal;\n    src:  url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/ss-social.woff') format('woff');\n}\n"], ["\n@font-face {\n    font-family: 'interface';\n    font-style: normal;\n    font-weight: normal;\n    src: url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_Rg.woff2') format('woff2'),\n        url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_Rg.woff') format('woff');\n}\n\n@font-face {\n    font-family: 'interface';\n    font-style: normal;\n    font-weight: bold;\n    src: url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_Bd.woff2') format('woff2'),\n        url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_Bd.woff') format('woff');\n}\n@font-face {\n    font-family: 'interface';\n    font-style: normal;\n    font-weight: 900;\n    src: url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/InterFace_W_XBd.woff') format('woff');\n}\n@font-face {\n    font-family: 'nexablack'; \n    font-style: normal;\n    font-weight: normal;\n    src: url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/nexa_black-webfont.woff2') format('woff2'),\n        url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/nexa_black-webfont.woff') format('woff');\n}\n@font-face {\n    font-family: 'SSStandard'; \n    font-style: normal;\n    font-weight: normal;\n    src:  url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/ss-standard.woff') format('woff');\n}\n@font-face {\n    font-family: 'SSSocial'; \n    font-style: normal;\n    font-weight: normal;\n    src:  url('https://s3.amazonaws.com/giphyscripts/react-giphy-brand/fonts/ss-social.woff') format('woff');\n}\n"])));
exports.fontFamily = {
    title: "'nexablack', sans-serif",
    body: 'interface, Helvetica Neue, helvetica, sans-serif;',
};
exports.fontSize = {
    titleSmall: '20px',
    title: '26px',
    titleLarge: '36px',
    subheader: '16px',
    subheaderSmall: '12px',
};
var sharedTitle = emotion_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    font-family: ", ";\n    -webkit-font-smoothing: antialiased;\n"], ["\n    font-family: ", ";\n    -webkit-font-smoothing: antialiased;\n"])), exports.fontFamily.title);
var title = emotion_1.cx(emotion_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        font-size: ", ";\n    "], ["\n        font-size: ", ";\n    "])), exports.fontSize.title), sharedTitle);
var titleLarge = emotion_1.cx(emotion_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n        font-size: ", ";\n    "], ["\n        font-size: ", ";\n    "])), exports.fontSize.titleLarge), sharedTitle);
var titleSmall = emotion_1.cx(emotion_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n        font-size: ", ";\n    "], ["\n        font-size: ", ";\n    "])), exports.fontSize.titleSmall), sharedTitle);
var sharedSubheader = emotion_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    font-family: ", ";\n    font-weight: bold;\n    -webkit-font-smoothing: antialiased;\n"], ["\n    font-family: ", ";\n    font-weight: bold;\n    -webkit-font-smoothing: antialiased;\n"])), exports.fontFamily.body);
var subheader = emotion_1.cx(emotion_1.css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n        font-size: ", ";\n    "], ["\n        font-size: ", ";\n    "])), exports.fontSize.subheader), sharedSubheader);
var subheaderSmall = emotion_1.cx(emotion_1.css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n        font-size: ", ";\n    "], ["\n        font-size: ", ";\n    "])), exports.fontSize.subheaderSmall), sharedSubheader);
var sectionHeader = emotion_1.css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n    font-family: ", ";\n    font-size: 14px;\n    font-weight: bold;\n    text-transform: uppercase;\n    -webkit-font-smoothing: antialiased;\n"], ["\n    font-family: ", ";\n    font-size: 14px;\n    font-weight: bold;\n    text-transform: uppercase;\n    -webkit-font-smoothing: antialiased;\n"])), exports.fontFamily.body);
var classNames = {
    sectionHeader: sectionHeader,
    subheaderSmall: subheaderSmall,
    subheader: subheader,
    titleLarge: titleLarge,
    titleSmall: titleSmall,
    title: title,
};
exports.css = classNames;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;

},{"emotion":63}],20:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var emotion_1 = require("emotion");
var preact_1 = require("preact");
var hooks_1 = require("preact/hooks");
var getSmallAvatar = function (avatar) {
    var _a, _b;
    if (!avatar)
        return '';
    var ext = (_b = (_a = avatar === null || avatar === void 0 ? void 0 : avatar.split('.')) === null || _a === void 0 ? void 0 : _a.pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
    return avatar.replace("." + ext, "/80h." + ext);
};
var avatarCss = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    object-fit: cover;\n    width: 32px;\n    height: 32px;\n    margin-right: 8px;\n"], ["\n    object-fit: cover;\n    width: 32px;\n    height: 32px;\n    margin-right: 8px;\n"])));
var Avatar = function (_a) {
    var user = _a.user, _b = _a.className, className = _b === void 0 ? '' : _b;
    var defaultAvatarId = hooks_1.useRef(Math.floor(Math.random() * 5) + 1);
    var url = user.avatar_url
        ? getSmallAvatar(user.avatar_url)
        : "https://media.giphy.com/avatars/default" + defaultAvatarId.current + ".gif";
    return preact_1.h("img", { src: url, className: emotion_1.cx(avatarCss, className) });
};
exports.default = Avatar;
var templateObject_1;

},{"emotion":63,"preact":66,"preact/hooks":67}],21:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var emotion_1 = require("emotion");
var preact_1 = require("preact");
var avatar_1 = __importDefault(require("./avatar"));
var verified_badge_1 = __importDefault(require("./verified-badge"));
var containerCss = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    font-family: interface, helvetica, arial;\n"], ["\n    display: flex;\n    align-items: center;\n    font-family: interface, helvetica, arial;\n"])));
var avatarCss = emotion_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    flex-shrink: 0;\n"], ["\n    flex-shrink: 0;\n"])));
var userName = emotion_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    color: white;\n    font-size: 17px;\n    font-weight: bold;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    -webkit-font-smoothing: antialiased;\n"], ["\n    color: white;\n    font-size: 17px;\n    font-weight: bold;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    -webkit-font-smoothing: antialiased;\n"])));
var verifiedBadge = emotion_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    margin: 0 4px;\n    flex-shrink: 0;\n"], ["\n    margin: 0 4px;\n    flex-shrink: 0;\n"])));
var Attribution = function (_a) {
    var gif = _a.gif, className = _a.className, onClick = _a.onClick;
    var user = gif.user;
    if (!(user === null || user === void 0 ? void 0 : user.username) && !(user === null || user === void 0 ? void 0 : user.display_name)) {
        return null;
    }
    var display_name = user.display_name, username = user.username;
    return (preact_1.h("div", { className: emotion_1.cx(containerCss, Attribution.className, className), onClick: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (onClick) {
                onClick(gif);
            }
            else {
                var url = user.profile_url;
                if (url)
                    window.open(url, '_blank');
            }
        } },
        preact_1.h(avatar_1.default, { user: user, className: avatarCss }),
        preact_1.h("div", { className: userName }, display_name || "@" + username),
        user.is_verified ? preact_1.h(verified_badge_1.default, { size: 14, className: verifiedBadge }) : null));
};
Attribution.className = 'giphy-attribution';
exports.default = Attribution;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;

},{"./avatar":20,"./verified-badge":23,"emotion":63,"preact":66}],22:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var emotion_1 = require("emotion");
var preact_1 = require("preact");
var hooks_1 = require("preact/hooks");
var _1 = __importDefault(require("."));
var backgroundCss = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    background: linear-gradient(rgba(0, 0, 0, 0), rgba(18, 18, 18, 0.6));\n    cursor: default;\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    height: 75px;\n    pointer-events: none;\n"], ["\n    background: linear-gradient(rgba(0, 0, 0, 0), rgba(18, 18, 18, 0.6));\n    cursor: default;\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    height: 75px;\n    pointer-events: none;\n"])));
var attributionCss = emotion_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    position: absolute;\n    bottom: 10px;\n    left: 10px;\n    right: 10px;\n"], ["\n    position: absolute;\n    bottom: 10px;\n    left: 10px;\n    right: 10px;\n"])));
var containerCss = emotion_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    transition: opacity 150ms ease-in;\n"], ["\n    transition: opacity 150ms ease-in;\n"])));
var AttributionOverlay = function (_a) {
    var gif = _a.gif, isHovered = _a.isHovered, onClick = _a.onClick;
    var hasHovered = hooks_1.useRef(isHovered);
    if (isHovered) {
        // not rendering to avoid loading the avatar until hover
        hasHovered.current = true;
    }
    return gif.user && hasHovered.current ? (preact_1.h("div", { className: containerCss, style: { opacity: isHovered ? 1 : 0 } },
        preact_1.h("div", { className: backgroundCss }),
        preact_1.h(_1.default, { gif: gif, className: attributionCss, onClick: onClick }))) : null;
};
exports.default = AttributionOverlay;
var templateObject_1, templateObject_2, templateObject_3;

},{".":21,"emotion":63,"preact":66,"preact/hooks":67}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var emotion_1 = require("emotion");
var preact_1 = require("preact");
var VerifiedBadge = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.size, size = _c === void 0 ? 17 : _c, _d = _a.fill, fill = _d === void 0 ? '#15CDFF' : _d;
    return (preact_1.h("svg", { className: emotion_1.cx(VerifiedBadge.className, className), height: size, width: "19px", viewBox: "0 0 19 17" },
        preact_1.h("g", { transform: "translate(-532.000000, -466.000000)", fill: fill },
            preact_1.h("g", { transform: "translate(141.000000, 235.000000)" },
                preact_1.h("g", { transform: "translate(264.000000, 0.000000)" },
                    preact_1.h("g", { transform: "translate(10.000000, 224.000000)" },
                        preact_1.h("g", { transform: "translate(114.000000, 2.500000)" },
                            preact_1.h("path", { d: "M15.112432,4.80769231 L16.8814194,6.87556817 L19.4157673,7.90116318 L19.6184416,10.6028916 L21.0594951,12.9065042 L19.6184416,15.2101168 L19.4157673,17.9118452 L16.8814194,18.9374402 L15.112432,21.0053161 L12.4528245,20.3611511 L9.79321699,21.0053161 L8.02422954,18.9374402 L5.48988167,17.9118452 L5.28720734,15.2101168 L3.84615385,12.9065042 L5.28720734,10.6028916 L5.48988167,7.90116318 L8.02422954,6.87556817 L9.79321699,4.80769231 L12.4528245,5.4518573 L15.112432,4.80769231 Z M17.8163503,10.8991009 L15.9282384,9.01098901 L11.5681538,13.3696923 L9.68115218,11.4818515 L7.81302031,13.3499833 L9.7011322,15.2380952 L11.5892441,17.1262071 L17.8163503,10.8991009 Z" }))))))));
};
VerifiedBadge.className = 'giphy-verified-badge';
exports.default = VerifiedBadge;

},{"emotion":63,"preact":66}],24:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        while (_) try {
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
var js_fetch_api_1 = require("@giphy/js-fetch-api");
var js_util_1 = require("@giphy/js-util");
var emotion_1 = require("emotion");
var preact_1 = require("preact");
var throttle_debounce_1 = require("throttle-debounce");
var observer_1 = __importDefault(require("../util/observer"));
var gif_1 = __importDefault(require("./gif"));
var pingback_context_manager_1 = __importDefault(require("./pingback-context-manager"));
var carouselCss = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    -webkit-overflow-scrolling: touch;\n    overflow-x: auto;\n    overflow-y: hidden;\n    white-space: nowrap;\n    position: relative;\n"], ["\n    -webkit-overflow-scrolling: touch;\n    overflow-x: auto;\n    overflow-y: hidden;\n    white-space: nowrap;\n    position: relative;\n"])));
var carouselItemCss = emotion_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    display: inline-block;\n    list-style: none;\n    /* make sure gifs are fully visible with a scrollbar */\n    margin-bottom: 1px;\n    &:first-of-type {\n        margin-left: 0;\n    }\n"], ["\n    display: inline-block;\n    list-style: none;\n    /* make sure gifs are fully visible with a scrollbar */\n    margin-bottom: 1px;\n    &:first-of-type {\n        margin-left: 0;\n    }\n"])));
var loaderContainerCss = emotion_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    display: inline-block;\n"], ["\n    display: inline-block;\n"])));
var loaderCss = emotion_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    width: 30px;\n    display: inline-block;\n"], ["\n    width: 30px;\n    display: inline-block;\n"])));
var defaultProps = Object.freeze({ gutter: 6, user: {} });
var initialState = Object.freeze({
    isFetching: false,
    numberOfGifs: 0,
    gifs: [],
    isLoaderVisible: true,
    isDoneFetching: false,
});
var Carousel = /** @class */ (function (_super) {
    __extends(Carousel, _super);
    function Carousel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = initialState;
        _this.paginator = js_fetch_api_1.gifPaginator(_this.props.fetchGifs);
        _this.onLoaderVisible = function (isVisible) {
            _this.setState({ isLoaderVisible: isVisible }, _this.onFetch);
        };
        _this.onFetch = throttle_debounce_1.debounce(100, function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, isFetching, isLoaderVisible, existingGifs, gifs, error_1, onGifsFetched;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.state, isFetching = _a.isFetching, isLoaderVisible = _a.isLoaderVisible, existingGifs = _a.gifs;
                        if (!(!isFetching && isLoaderVisible)) return [3 /*break*/, 5];
                        this.setState({ isFetching: true });
                        gifs = void 0;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.paginator()];
                    case 2:
                        gifs = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        this.setState({ isFetching: false });
                        return [3 /*break*/, 4];
                    case 4:
                        if (gifs) {
                            if (existingGifs.length === gifs.length) {
                                this.setState({ isDoneFetching: true });
                            }
                            else {
                                this.setState({ gifs: gifs, isFetching: false });
                                onGifsFetched = this.props.onGifsFetched;
                                if (onGifsFetched)
                                    onGifsFetched(gifs);
                                this.onFetch();
                            }
                        }
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        return _this;
    }
    Carousel.prototype.componentDidMount = function () {
        this.onFetch();
    };
    Carousel.prototype.render = function (_a, _b) {
        var fetchGifs = _a.fetchGifs, onGifVisible = _a.onGifVisible, onGifRightClick = _a.onGifRightClick, gifHeight = _a.gifHeight, gutter = _a.gutter, _c = _a.className, className = _c === void 0 ? Carousel.className : _c, onGifClick = _a.onGifClick, onGifHover = _a.onGifHover, onGifSeen = _a.onGifSeen, user = _a.user, noResultsMessage = _a.noResultsMessage, hideAttribution = _a.hideAttribution, noLink = _a.noLink, borderRadius = _a.borderRadius;
        var gifs = _b.gifs;
        var showLoader = fetchGifs && gifs.length > 0;
        var marginCss = emotion_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n            margin-left: ", "px;\n        "], ["\n            margin-left: ", "px;\n        "])), gutter);
        var gifHeightCss = emotion_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n            height: ", "px;\n        "], ["\n            height: ", "px;\n        "])), gifHeight);
        var containerCss = emotion_1.cx(className, carouselCss);
        var gifCss = emotion_1.cx(carouselItemCss, marginCss);
        return (preact_1.h(pingback_context_manager_1.default, { attributes: { layout_type: 'CAROUSEL' } },
            preact_1.h("div", { class: containerCss },
                gifs.map(function (gif) {
                    var gifWidth = js_util_1.getGifWidth(gif, gifHeight);
                    return (preact_1.h(gif_1.default, { className: gifCss, gif: gif, key: gif.id, width: gifWidth, onGifClick: onGifClick, onGifHover: onGifHover, onGifSeen: onGifSeen, onGifVisible: onGifVisible, onGifRightClick: onGifRightClick, user: user, hideAttribution: hideAttribution, noLink: noLink, borderRadius: borderRadius }));
                }),
                !showLoader && gifs.length === 0 && noResultsMessage,
                showLoader && (preact_1.h(observer_1.default, { className: loaderContainerCss, onVisibleChange: this.onLoaderVisible },
                    preact_1.h("div", { className: emotion_1.cx(loaderCss, gifHeightCss) }))))));
    };
    Carousel.className = 'giphy-carousel';
    Carousel.defaultProps = defaultProps;
    return Carousel;
}(preact_1.Component));
exports.default = Carousel;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;

},{"../util/observer":31,"./gif":26,"./pingback-context-manager":29,"@giphy/js-fetch-api":36,"@giphy/js-util":54,"emotion":63,"preact":66,"throttle-debounce":69}],25:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_brand_1 = require("@giphy/js-brand");
var emotion_1 = require("emotion");
var preact_1 = require("preact");
var fetchError = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    color: ", ";\n    display: flex;\n    justify-content: center;\n    margin: 30px 0;\n    font-family: ", ";\n    font-size: 16px;\n    font-weight: 600;\n    a {\n        color: ", ";\n        cursor: pointer;\n        &:hover {\n            color: white;\n        }\n    }\n"], ["\n    color: ", ";\n    display: flex;\n    justify-content: center;\n    margin: 30px 0;\n    font-family: ", ";\n    font-size: 16px;\n    font-weight: 600;\n    a {\n        color: ", ";\n        cursor: pointer;\n        &:hover {\n            color: white;\n        }\n    }\n"])), js_brand_1.giphyLightGrey, js_brand_1.fontFamily.body, js_brand_1.giphyBlue);
var FetchError = function (_a) {
    var onClick = _a.onClick;
    return (preact_1.h("div", { className: fetchError },
        "Error loading GIFs.\u00A0",
        preact_1.h("a", { onClick: onClick }, "Try again?")));
};
exports.default = FetchError;
var templateObject_1;

},{"@giphy/js-brand":17,"emotion":63,"preact":66}],26:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColor = exports.GRID_COLORS = void 0;
var js_brand_1 = require("@giphy/js-brand");
var js_util_1 = require("@giphy/js-util");
var emotion_1 = require("emotion");
var preact_1 = require("preact");
var hooks_1 = require("preact/hooks");
var pingback = __importStar(require("../util/pingback"));
var overlay_1 = __importDefault(require("./attribution/overlay"));
var verified_badge_1 = __importDefault(require("./attribution/verified-badge"));
var pingback_context_manager_1 = require("./pingback-context-manager");
var gifCss = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: block;\n    img {\n        display: block;\n    }\n    .", " {\n        g {\n            fill: white;\n        }\n    }\n"], ["\n    display: block;\n    img {\n        display: block;\n    }\n    .", " {\n        g {\n            fill: white;\n        }\n    }\n"])), verified_badge_1.default.className);
exports.GRID_COLORS = [js_brand_1.giphyBlue, js_brand_1.giphyGreen, js_brand_1.giphyPurple, js_brand_1.giphyRed, js_brand_1.giphyYellow];
exports.getColor = function () { return exports.GRID_COLORS[Math.round(Math.random() * (exports.GRID_COLORS.length - 1))]; };
var hoverTimeoutDelay = 200;
var Container = function (props) { return (props.href ? preact_1.h("a", __assign({ href: props.href }, props)) : preact_1.h("div", __assign({}, props))); };
function useMutableRef(initialValue) {
    var ref = hooks_1.useState({ current: initialValue })[0];
    return ref;
}
var placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
var noop = function () { };
var Gif = function (_a) {
    var gif = _a.gif, width = _a.width, forcedHeight = _a.height, _b = _a.onGifRightClick, onGifRightClick = _b === void 0 ? noop : _b, className = _a.className, _c = _a.onGifClick, onGifClick = _c === void 0 ? noop : _c, _d = _a.onGifSeen, onGifSeen = _d === void 0 ? noop : _d, _e = _a.onGifVisible, onGifVisible = _e === void 0 ? noop : _e, _f = _a.user, user = _f === void 0 ? {} : _f, backgroundColor = _a.backgroundColor, _g = _a.hideAttribution, hideAttribution = _g === void 0 ? false : _g, _h = _a.noLink, noLink = _h === void 0 ? false : _h, _j = _a.borderRadius, borderRadius = _j === void 0 ? 4 : _j;
    // only fire seen once per gif id
    var _k = hooks_1.useState(false), hasFiredSeen = _k[0], setHasFiredSeen = _k[1];
    // classname to target animations on image load
    var _l = hooks_1.useState(''), loadedClassname = _l[0], setLoadedClassName = _l[1];
    // hovered is for the gif overlay
    var _m = hooks_1.useState(false), isHovered = _m[0], setHovered = _m[1];
    // only show the gif if it's on the screen
    var _o = hooks_1.useState(false), showGif = _o[0], setShowGif = _o[1];
    // the background color shouldn't change unless it comes from a prop or we have a sticker
    var defaultBgColor = hooks_1.useRef(exports.getColor());
    // the a tag the media is rendered into
    var container = hooks_1.useRef(null);
    // intersection observer with no threshold
    var showGifObserver = useMutableRef();
    // intersection observer with a threshold of 1 (full element is on screen)
    var fullGifObserver = useMutableRef();
    // fire hover pingback after this timeout
    var hoverTimeout = useMutableRef();
    // fire onseen ref (changes per gif, so need a ref)
    var sendOnSeen = hooks_1.useRef(noop);
    // custom pingback
    var attributes = hooks_1.useContext(pingback_context_manager_1.PingbackContext).attributes;
    var onMouseOver = function (e) {
        clearTimeout(hoverTimeout.current);
        setHovered(true);
        hoverTimeout.current = window.setTimeout(function () {
            pingback.onGifHover(gif, user === null || user === void 0 ? void 0 : user.id, e.target, attributes);
        }, hoverTimeoutDelay);
    };
    var onMouseLeave = function () {
        clearTimeout(hoverTimeout.current);
        setHovered(false);
    };
    var onClick = function (e) {
        // fire pingback
        pingback.onGifClick(gif, user === null || user === void 0 ? void 0 : user.id, e.target, attributes);
        onGifClick(gif, e);
    };
    // using a ref in case `gif` changes
    sendOnSeen.current = function (entry) {
        // flag so we don't observe any more
        setHasFiredSeen(true);
        js_util_1.Logger.debug("GIF " + gif.id + " seen. " + gif.title);
        // third party here
        if (gif.bottle_data && gif.bottle_data.tags) {
            js_util_1.injectTrackingPixel(gif.bottle_data.tags);
        }
        // fire pingback
        pingback.onGifSeen(gif, user === null || user === void 0 ? void 0 : user.id, entry.boundingClientRect, attributes);
        // fire custom onGifSeen
        onGifSeen === null || onGifSeen === void 0 ? void 0 : onGifSeen(gif, entry.boundingClientRect);
        // disconnect
        if (fullGifObserver.current) {
            fullGifObserver.current.disconnect();
        }
    };
    var onImageLoad = function (e) {
        if (!fullGifObserver.current) {
            fullGifObserver.current = new IntersectionObserver(function (_a) {
                var entry = _a[0];
                if (entry.isIntersecting) {
                    sendOnSeen.current(entry);
                }
            }, { threshold: [0.99] });
        }
        if (!hasFiredSeen && container.current && fullGifObserver.current) {
            // observe img for full gif view
            fullGifObserver.current.observe(container.current);
        }
        onGifVisible(gif, e); // gif is visible, perhaps just partially
        setLoadedClassName(Gif.imgLoadedClassName);
    };
    hooks_1.useEffect(function () {
        if (fullGifObserver.current) {
            fullGifObserver.current.disconnect();
        }
        setHasFiredSeen(false);
    }, [gif.id]);
    hooks_1.useEffect(function () {
        showGifObserver.current = new IntersectionObserver(function (_a) {
            var entry = _a[0];
            var isIntersecting = entry.isIntersecting;
            // show the gif if the container is on the screen
            setShowGif(isIntersecting);
            // remove the fullGifObserver if we go off the screen
            // we may have already disconnected if the hasFiredSeen happened
            if (!isIntersecting && fullGifObserver.current) {
                fullGifObserver.current.disconnect();
            }
        });
        showGifObserver.current.observe(container.current);
        return function () {
            if (showGifObserver.current)
                showGifObserver.current.disconnect();
            if (fullGifObserver.current)
                fullGifObserver.current.disconnect();
            if (hoverTimeout.current)
                clearTimeout(hoverTimeout.current);
        };
    }, []);
    var height = forcedHeight || js_util_1.getGifHeight(gif, width);
    var bestRendition = js_util_1.getBestRendition(gif.images, width, height);
    var rendition = gif.images[bestRendition.renditionName];
    var background = backgroundColor || // <- specified background prop
        // sticker has black if no backgroundColor is specified
        (gif.is_sticker
            ? "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4AQMAAACSSKldAAAABlBMVEUhIiIWFhYoSqvJAAAAGElEQVQY02MAAv7///8PWxqIPwDZw5UGABtgwz2xhFKxAAAAAElFTkSuQmCC') 0 0"
            : defaultBgColor.current);
    var borderRadiusCss = borderRadius
        ? emotion_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n              border-radius: ", "px;\n              overflow: hidden;\n          "], ["\n              border-radius: ", "px;\n              overflow: hidden;\n          "])), borderRadius) : '';
    return (preact_1.h(Container, { href: noLink ? undefined : gif.url, style: {
            width: width,
            height: height,
        }, className: emotion_1.cx(Gif.className, gifCss, borderRadiusCss, className), onMouseOver: onMouseOver, onMouseLeave: onMouseLeave, onClick: onClick, onContextMenu: function (e) { return onGifRightClick(gif, e); } },
        preact_1.h("div", { style: { width: width, height: height, position: 'relative' }, ref: container },
            preact_1.h("picture", null,
                preact_1.h("source", { type: "image/webp", srcSet: rendition.webp }),
                preact_1.h("img", { className: [Gif.imgClassName, loadedClassname].join(' '), src: showGif ? rendition.url : placeholder, style: { background: background }, width: width, height: height, alt: js_util_1.getAltText(gif), onLoad: showGif ? onImageLoad : function () { } })),
            showGif ? (preact_1.h("div", null, !hideAttribution && preact_1.h(overlay_1.default, { gif: gif, isHovered: isHovered }))) : null)));
};
Gif.className = 'giphy-gif';
Gif.imgClassName = 'giphy-gif-img';
Gif.imgLoadedClassName = 'giphy-img-loaded';
exports.default = Gif;
var templateObject_1, templateObject_2;

},{"../util/pingback":32,"./attribution/overlay":22,"./attribution/verified-badge":23,"./pingback-context-manager":29,"@giphy/js-brand":17,"@giphy/js-util":54,"emotion":63,"preact":66,"preact/hooks":67}],27:[function(require,module,exports){
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        while (_) try {
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
var js_fetch_api_1 = require("@giphy/js-fetch-api");
var bricks_js_1 = __importDefault(require("bricks.js"));
var emotion_1 = require("emotion");
var preact_1 = require("preact");
var throttle_debounce_1 = require("throttle-debounce");
var observer_1 = __importDefault(require("../util/observer"));
var fetch_error_1 = __importDefault(require("./fetch-error"));
var gif_1 = __importDefault(require("./gif"));
var loader_1 = __importDefault(require("./loader"));
var pingback_context_manager_1 = __importDefault(require("./pingback-context-manager"));
var loaderHiddenCss = emotion_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    opacity: 0;\n"], ["\n    opacity: 0;\n"])));
var defaultProps = Object.freeze({ gutter: 6, user: {} });
var initialState = Object.freeze({
    isFetching: false,
    isError: false,
    numberOfGifs: 0,
    gifWidth: 0,
    gifs: [],
    isLoaderVisible: true,
    isDoneFetching: false,
});
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = initialState;
        _this.el = null;
        _this.paginator = js_fetch_api_1.gifPaginator(_this.props.fetchGifs);
        _this.onLoaderVisible = function (isVisible) {
            _this.setState({ isLoaderVisible: isVisible }, _this.onFetch);
        };
        _this.onFetch = throttle_debounce_1.debounce(Grid.fetchDebounce, function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, isFetching, isLoaderVisible, existingGifs, gifs, error_1, onGifsFetchError, onGifsFetched;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.state, isFetching = _a.isFetching, isLoaderVisible = _a.isLoaderVisible, existingGifs = _a.gifs;
                        if (!(!isFetching && isLoaderVisible)) return [3 /*break*/, 5];
                        this.setState({ isFetching: true, isError: false });
                        gifs = void 0;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.paginator()];
                    case 2:
                        gifs = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        this.setState({ isFetching: false, isError: true });
                        onGifsFetchError = this.props.onGifsFetchError;
                        if (onGifsFetchError)
                            onGifsFetchError(error_1);
                        return [3 /*break*/, 4];
                    case 4:
                        if (gifs) {
                            if (existingGifs.length === gifs.length) {
                                this.setState({ isDoneFetching: true });
                            }
                            else {
                                this.setState({ gifs: gifs, isFetching: false });
                                onGifsFetched = this.props.onGifsFetched;
                                if (onGifsFetched)
                                    onGifsFetched(gifs);
                                this.onFetch();
                            }
                        }
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        return _this;
    }
    Grid.getDerivedStateFromProps = function (_a, prevState) {
        var columns = _a.columns, gutter = _a.gutter, width = _a.width;
        var gutterOffset = gutter * (columns - 1);
        var gifWidth = Math.floor((width - gutterOffset) / columns);
        if (prevState.gifWidth !== gifWidth) {
            return { gifWidth: gifWidth };
        }
        return {};
    };
    Grid.prototype.setBricks = function () {
        var _a = this.props, columns = _a.columns, gutter = _a.gutter;
        // bricks
        this.bricks = bricks_js_1.default({
            container: this.el,
            packed: "data-packed-" + columns,
            sizes: [{ columns: columns, gutter: gutter }],
        });
    };
    Grid.prototype.componentDidMount = function () {
        this.setBricks();
        this.onFetch();
    };
    Grid.prototype.componentDidUpdate = function (prevProps, prevState) {
        var gifs = this.state.gifs;
        var gifWidth = this.state.gifWidth;
        var numberOfOldGifs = prevState.gifs.length;
        var numberOfNewGifs = gifs.length;
        if (prevState.gifWidth !== gifWidth && numberOfOldGifs > 0) {
            var columns = this.props.columns;
            if (columns !== prevProps.columns) {
                this.setBricks();
            }
            this.bricks.pack();
        }
        if (prevState.gifs !== gifs) {
            if (numberOfNewGifs > numberOfOldGifs && numberOfOldGifs > 0) {
                // we just added new gifs
                this.bricks.update();
            }
            else {
                // we changed existing gifs or removed a gif
                this.bricks.pack();
            }
        }
    };
    Grid.prototype.render = function (_a, _b) {
        var _this = this;
        var fetchGifs = _a.fetchGifs, onGifVisible = _a.onGifVisible, onGifRightClick = _a.onGifRightClick, _c = _a.className, className = _c === void 0 ? Grid.className : _c, onGifClick = _a.onGifClick, onGifHover = _a.onGifHover, onGifSeen = _a.onGifSeen, user = _a.user, noResultsMessage = _a.noResultsMessage, hideAttribution = _a.hideAttribution, noLink = _a.noLink, borderRadius = _a.borderRadius;
        var gifWidth = _b.gifWidth, gifs = _b.gifs, isError = _b.isError, isDoneFetching = _b.isDoneFetching;
        var showLoader = fetchGifs && !isDoneFetching;
        var isFirstLoad = gifs.length === 0;
        return (preact_1.h(pingback_context_manager_1.default, { attributes: { layout_type: 'GRID' } },
            preact_1.h("div", { class: className },
                preact_1.h("div", { ref: function (c) { return (_this.el = c); } },
                    gifs.map(function (gif) { return (preact_1.h(gif_1.default, { gif: gif, key: gif.id, width: gifWidth, onGifClick: onGifClick, onGifHover: onGifHover, onGifSeen: onGifSeen, onGifVisible: onGifVisible, onGifRightClick: onGifRightClick, user: user, hideAttribution: hideAttribution, noLink: noLink, borderRadius: borderRadius })); }),
                    !showLoader && gifs.length === 0 && noResultsMessage),
                isError ? (preact_1.h(fetch_error_1.default, { onClick: this.onFetch })) : (showLoader && (preact_1.h(observer_1.default, { onVisibleChange: this.onLoaderVisible },
                    preact_1.h(loader_1.default, { className: emotion_1.cx(Grid.loaderClassName, isFirstLoad ? loaderHiddenCss : '') })))))));
    };
    Grid.className = 'giphy-grid';
    Grid.loaderClassName = 'giphy-loader';
    Grid.defaultProps = defaultProps;
    Grid.fetchDebounce = 250;
    return Grid;
}(preact_1.Component));
exports.default = Grid;
var templateObject_1;

},{"../util/observer":31,"./fetch-error":25,"./gif":26,"./loader":28,"./pingback-context-manager":29,"@giphy/js-fetch-api":36,"bricks.js":59,"emotion":63,"preact":66,"throttle-debounce":69}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var js_brand_1 = require("@giphy/js-brand");
var emotion_1 = require("emotion");
var preact_1 = require("preact");
// trying to share css from brand, but this has an element structure
// so it's ugly. will probably move the css in here
exports.default = (function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    return (preact_1.h("div", { className: emotion_1.cx(js_brand_1.loader, className) },
        preact_1.h("div", null),
        preact_1.h("div", null),
        preact_1.h("div", null),
        preact_1.h("div", null),
        preact_1.h("div", null)));
});

},{"@giphy/js-brand":17,"emotion":63,"preact":66}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingbackContext = void 0;
var js_analytics_1 = require("@giphy/js-analytics");
var preact_1 = require("preact");
var hooks_1 = require("preact/hooks");
exports.PingbackContext = preact_1.createContext({});
var PingbackContextManager = function (_a) {
    var attributes = _a.attributes, children = _a.children;
    var _b = hooks_1.useContext(exports.PingbackContext).attributes, parentAttributes = _b === void 0 ? {} : _b;
    return (preact_1.h(exports.PingbackContext.Provider, { value: { attributes: js_analytics_1.mergeAttributes(parentAttributes, attributes, 'layout_type') } }, children));
};
exports.default = PingbackContextManager;

},{"@giphy/js-analytics":11,"preact":66,"preact/hooks":67}],30:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderGif = exports.renderCarousel = exports.renderGrid = exports.Grid = exports.Gif = exports.Carousel = void 0;
require("intersection-observer");
var preact_1 = require("preact");
var carousel_1 = __importDefault(require("./components/carousel"));
var grid_1 = __importDefault(require("./components/grid"));
var gif_1 = __importDefault(require("./components/gif"));
var js_util_1 = require("@giphy/js-util");
var carousel_2 = require("./components/carousel");
Object.defineProperty(exports, "Carousel", { enumerable: true, get: function () { return __importDefault(carousel_2).default; } });
var gif_2 = require("./components/gif");
Object.defineProperty(exports, "Gif", { enumerable: true, get: function () { return __importDefault(gif_2).default; } });
var grid_2 = require("./components/grid");
Object.defineProperty(exports, "Grid", { enumerable: true, get: function () { return __importDefault(grid_2).default; } });
// @ts-ignore
var version = require('../package.json').version;
// send headers with library type and version
js_util_1.appendGiphySDKRequestHeader("X-GIPHY-SDK-NAME", 'JavascriptSDK');
js_util_1.appendGiphySDKRequestHeader("X-GIPHY-SDK-VERSION", version);
/**
 * render a grid
 *
 * @param gridProps grid props
 * @param target the node to render into it
 */
exports.renderGrid = function (gridProps, target) {
    preact_1.render(preact_1.h(grid_1.default, __assign({}, gridProps)), target);
    return function () { return preact_1.render(null, target); };
};
/**
 * render a carousel
 *
 * @param carouselProps Carousel props
 * @param target the node to render into it
 */
exports.renderCarousel = function (carouselProps, target) {
    preact_1.render(preact_1.h(carousel_1.default, __assign({}, carouselProps)), target);
    return function () { return preact_1.render(null, target); };
};
/**
 * render a grid
 *
 * @param gif Gif props
 * @param target the node to render into it
 */
exports.renderGif = function (gifProps, target) {
    preact_1.render(preact_1.h(gif_1.default, __assign({}, gifProps)), target);
    return function () { return preact_1.render(null, target); };
};

},{"../package.json":33,"./components/carousel":24,"./components/gif":26,"./components/grid":27,"@giphy/js-util":54,"intersection-observer":65,"preact":66}],31:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var Observer = /** @class */ (function (_super) {
    __extends(Observer, _super);
    function Observer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.container = null;
        return _this;
    }
    Observer.prototype.componentDidMount = function () {
        var _this = this;
        this.io = new IntersectionObserver(function (_a) {
            var entry = _a[0];
            _this.setState({ isVisible: entry.isIntersecting });
            var onVisibleChange = _this.props.onVisibleChange;
            if (onVisibleChange)
                onVisibleChange(entry.isIntersecting);
        });
        this.io.observe(this.container);
    };
    Observer.prototype.componentWillUnmount = function () {
        if (this.io) {
            this.io.disconnect();
        }
    };
    Observer.prototype.render = function (_a, _b) {
        var _this = this;
        var children = _a.children, className = _a.className;
        var isVisible = _b.isVisible;
        var kids = Array.isArray(children) ? children : [children];
        return (preact_1.h("div", { ref: function (div) { return (_this.container = div); }, className: className }, kids.map(function (child) { return (child ? preact_1.cloneElement(child, { isVisible: isVisible }) : null); })));
    };
    return Observer;
}(preact_1.Component));
exports.default = Observer;

},{"preact":66}],32:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onGifHover = exports.onGifClick = exports.onGifSeen = void 0;
var js_analytics_1 = require("@giphy/js-analytics");
var js_util_1 = require("@giphy/js-util");
var firePingback = function (actionType) { return function (gif, userId, target, attributes) {
    if (attributes === void 0) { attributes = {}; }
    if (!gif.analytics_response_payload) {
        return;
    }
    js_analytics_1.pingback({
        userId: userId,
        actionType: actionType,
        attributes: __assign({ position: JSON.stringify(js_util_1.getClientRect(target)) }, attributes),
        analyticsResponsePayload: gif.analytics_response_payload,
    });
}; };
// no target on this one
exports.onGifSeen = function (gif, userId, position, attributes) {
    if (attributes === void 0) { attributes = {}; }
    if (!gif.analytics_response_payload) {
        return;
    }
    js_analytics_1.pingback({
        analyticsResponsePayload: gif.analytics_response_payload,
        userId: userId,
        actionType: 'SEEN',
        attributes: __assign({ position: JSON.stringify(position) }, attributes),
    });
};
exports.onGifClick = firePingback('CLICK');
exports.onGifHover = firePingback('HOVER');

},{"@giphy/js-analytics":11,"@giphy/js-util":54}],33:[function(require,module,exports){
module.exports={
  "_args": [
    [
      "@giphy/js-components@4.3.1",
      "/Users/semhartesfu/FutureProof/LAP1/LAP-1-Portfolio-Week-Project/client"
    ]
  ],
  "_from": "@giphy/js-components@4.3.1",
  "_id": "@giphy/js-components@4.3.1",
  "_inBundle": false,
  "_integrity": "sha512-DByKMgivmuJFrt5zUNnn5r4dtfqhjAj9H76/r15rEXJdtSXz+mdbp89yt0DTQnPQJMP93X1owaFu2PBA9UX/Cg==",
  "_location": "/@giphy/js-components",
  "_phantomChildren": {},
  "_requested": {
    "type": "version",
    "registry": true,
    "raw": "@giphy/js-components@4.3.1",
    "name": "@giphy/js-components",
    "escapedName": "@giphy%2fjs-components",
    "scope": "@giphy",
    "rawSpec": "4.3.1",
    "saveSpec": null,
    "fetchSpec": "4.3.1"
  },
  "_requiredBy": [
    "/"
  ],
  "_resolved": "https://registry.npmjs.org/@giphy/js-components/-/js-components-4.3.1.tgz",
  "_spec": "4.3.1",
  "_where": "/Users/semhartesfu/FutureProof/LAP1/LAP-1-Portfolio-Week-Project/client",
  "author": {
    "name": "giannif"
  },
  "dependencies": {
    "@giphy/js-analytics": "^3.0.0",
    "@giphy/js-brand": "^2.0.2",
    "@giphy/js-fetch-api": "^2.4.0",
    "@giphy/js-types": "^3.1.0",
    "@giphy/js-util": "^2.2.0",
    "bricks.js": "^1.8.0",
    "emotion": "10.0.27",
    "intersection-observer": "^0.11.0",
    "preact": "10.4.8",
    "throttle-debounce": "^2.3.0"
  },
  "description": "A lightweight set of components, focused on easy-of-use and performance.",
  "devDependencies": {
    "@types/bricks.js": "^1.8.1",
    "@types/throttle-debounce": "^2.1.0",
    "parcel-bundler": "^1.12.4",
    "typescript": "^4.0.5"
  },
  "files": [
    "dist/**/*",
    "src/**/*"
  ],
  "gitHead": "c2a201f03868e13085e83bb812da345c01504de9",
  "license": "MIT",
  "main": "dist/index.js",
  "name": "@giphy/js-components",
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "tsc",
    "clean": "rm -rf ./dist",
    "dev": "parcel public/test.html",
    "prepublish": "npm run clean && tsc",
    "types": "tsc ./src/index.tsx -d --emitDeclarationOnly -declarationDir ./dist"
  },
  "types": "dist/index.d.ts",
  "version": "4.3.1"
}

},{}],34:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiphyFetch = void 0;
/* eslint-disable no-dupe-class-members */
var js_util_1 = require("@giphy/js-util");
var qs_1 = __importDefault(require("qs"));
var gif_1 = require("./normalize/gif");
var request_1 = __importDefault(require("./request"));
var getType = function (options) { return (options && options.type ? options.type : 'gifs'); };
/**
 * @class GiphyFetch
 * @param {string} apiKey
 */
var GiphyFetch = /** @class */ (function () {
    function GiphyFetch(apiKey) {
        var _this = this;
        /**
         * @hidden
         */
        this.getQS = function (options) {
            if (options === void 0) { options = {}; }
            return qs_1.default.stringify(__assign(__assign({}, options), { api_key: _this.apiKey, pingback_id: js_util_1.getPingbackId() }));
        };
        this.apiKey = apiKey;
    }
    /**
     * A list of categories
     *
     * @param {CategoriesOptions} [options]
     * @returns {Promise<CategoriesResult>}
     */
    GiphyFetch.prototype.categories = function (options) {
        return request_1.default("gifs/categories?" + this.getQS(options));
    };
    /**
     * Get a single gif by a id
     * @param {string} id
     * @returns {Promise<GifsResult>}
     **/
    GiphyFetch.prototype.gif = function (id) {
        return request_1.default("gifs/" + id + "?" + this.getQS(), gif_1.normalizeGif);
    };
    GiphyFetch.prototype.gifs = function (arg1, arg2) {
        if (Array.isArray(arg1)) {
            return request_1.default("gifs?" + this.getQS({ ids: arg1.join(',') }), gif_1.normalizeGifs);
        }
        return request_1.default("gifs/categories/" + arg1 + "/" + arg2 + "?" + this.getQS(), gif_1.normalizeGifs);
    };
    GiphyFetch.prototype.emoji = function (options) {
        return request_1.default("emoji?" + this.getQS(options), gif_1.normalizeGifs);
    };
    GiphyFetch.prototype.animate = function (text, options) {
        if (options === void 0) { options = {}; }
        var qsParams = this.getQS(__assign(__assign({}, options), { m: text }));
        return request_1.default("text/animate?" + qsParams, gif_1.normalizeGifs);
    };
    /**
     * @param term: string The term you're searching for
     * @param options: SearchOptions
     * @returns {Promise<GifsResult>}
     **/
    GiphyFetch.prototype.search = function (term, options) {
        if (options === void 0) { options = {}; }
        var q = options.channel ? "@" + options.channel + " " + term : term;
        var excludeDynamicResults;
        if (options.type === 'text') {
            excludeDynamicResults = true;
        }
        var qsParams = this.getQS(__assign(__assign({}, options), { q: q, excludeDynamicResults: excludeDynamicResults }));
        return request_1.default(getType(options) + "/search?" + qsParams, gif_1.normalizeGifs);
    };
    /**
     * Get a list of subcategories
     * @param {string} category
     * @param {SubcategoriesOptions} options
     * @returns {Promise<CategoriesResult>}
     */
    GiphyFetch.prototype.subcategories = function (category, options) {
        return request_1.default("gifs/categories/" + category + "?" + this.getQS(options));
    };
    /**
     * Get trending gifs
     *
     * @param {TrendingOptions} options
     * @returns {Promise<GifsResult>}
     */
    GiphyFetch.prototype.trending = function (options) {
        if (options === void 0) { options = {}; }
        return request_1.default(getType(options) + "/trending?" + this.getQS(options), gif_1.normalizeGifs);
    };
    /**
     * Get a random gif
     * @param {RandomOptions}
     * @returns {Promise<GifResult>}
     **/
    GiphyFetch.prototype.random = function (options) {
        return request_1.default(getType(options) + "/random?" + this.getQS(options), gif_1.normalizeGif, true);
    };
    /**
     * Get related gifs by a id
     * @param {string} id
     * @param {SubcategoriesOptions} options
     * @returns {Promise<GifsResult>}
     **/
    GiphyFetch.prototype.related = function (id, options) {
        return request_1.default(((options === null || options === void 0 ? void 0 : options.type) === 'stickers' ? 'stickers' : 'gifs') + "/related?" + this.getQS(__assign({ gif_id: id }, options)), gif_1.normalizeGifs);
    };
    return GiphyFetch;
}());
exports.GiphyFetch = GiphyFetch;
exports.default = GiphyFetch;

},{"./normalize/gif":37,"./request":40,"@giphy/js-util":54,"qs":43}],35:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var FetchError = /** @class */ (function (_super) {
    __extends(FetchError, _super);
    function FetchError(message, status, statusText) {
        if (status === void 0) { status = 0; }
        if (statusText === void 0) { statusText = ''; }
        var _this = _super.call(this, message) || this;
        _this.status = status;
        _this.statusText = statusText;
        return _this;
    }
    return FetchError;
}(Error));
exports.default = FetchError;

},{}],36:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.gifPaginator = exports.GiphyFetch = void 0;
var js_util_1 = require("@giphy/js-util");
var api_1 = require("./api");
Object.defineProperty(exports, "GiphyFetch", { enumerable: true, get: function () { return __importDefault(api_1).default; } });
__exportStar(require("./option-types"), exports);
__exportStar(require("./result-types"), exports);
var paginator_1 = require("./paginator");
Object.defineProperty(exports, "gifPaginator", { enumerable: true, get: function () { return paginator_1.gifPaginator; } });
var version = require('../package.json').version;
// since we have multiple SDKs, we're defining a hieracrchy
// Fetch API is lowest
if (!((_a = js_util_1.getGiphySDKRequestHeaders()) === null || _a === void 0 ? void 0 : _a.get("X-GIPHY-SDK-NAME"))) {
    // send headers with library type and version
    js_util_1.appendGiphySDKRequestHeader("X-GIPHY-SDK-NAME", 'FetchAPI');
    js_util_1.appendGiphySDKRequestHeader("X-GIPHY-SDK-VERSION", version);
}

},{"../package.json":47,"./api":34,"./option-types":38,"./paginator":39,"./result-types":41,"@giphy/js-util":54}],37:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeGifs = exports.normalizeGif = exports.USER_BOOL_PROPS = exports.BOOL_PROPS = void 0;
/**
 * @hidden
 */
exports.BOOL_PROPS = [
    'is_anonymous',
    'is_community',
    'is_featured',
    'is_hidden',
    'is_indexable',
    'is_preserve_size',
    'is_realtime',
    'is_removed',
    'is_sticker',
    'is_dynamic',
];
/**
 * @hidden
 */
exports.USER_BOOL_PROPS = ['suppress_chrome', 'is_public', 'is_verified'];
var makeBool = function (obj) { return function (prop) { return (obj[prop] = !!obj[prop]); }; };
// tags sometimes are objects that have a text prop, sometimes they're strings
var getTag = function (tag) { return (typeof tag === 'string' ? tag : tag.text); };
var normalize = function (gif) {
    var newGif = __assign({}, gif);
    newGif.id = String(newGif.id);
    newGif.tags = (newGif.tags || []).map(getTag);
    exports.BOOL_PROPS.forEach(makeBool(newGif));
    var user = newGif.user;
    if (user) {
        var newUser = __assign({}, user);
        exports.USER_BOOL_PROPS.forEach(makeBool(newUser));
        newGif.user = newUser;
    }
    return newGif;
};
/**
 * @hidden
 */
exports.normalizeGif = function (result) {
    result.data = normalize(result.data);
    return result;
};
/**
 * @hidden
 */
exports.normalizeGifs = function (result) {
    result.data = result.data.map(function (gif) { return normalize(gif); });
    return result;
};

},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],39:[function(require,module,exports){
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
        while (_) try {
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gifPaginator = void 0;
/**
 * @hidden
 */
exports.gifPaginator = function (fetchGifs, initialGifs) {
    if (initialGifs === void 0) { initialGifs = []; }
    var gifs = __spreadArrays(initialGifs);
    // for deduping
    var gifIds = initialGifs.map(function (g) { return g.id; });
    var offset = initialGifs.length;
    var isDoneFetching = false;
    return function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, pagination, newGifs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isDoneFetching) {
                        return [2 /*return*/, gifs];
                    }
                    return [4 /*yield*/, fetchGifs(offset)];
                case 1:
                    result = _a.sent();
                    pagination = result.pagination, newGifs = result.data;
                    offset = pagination.count + pagination.offset;
                    isDoneFetching = offset === pagination.total_count;
                    newGifs.forEach(function (gif) {
                        var id = gif.id;
                        if (!gifIds.includes(id)) {
                            // add gifs and gifIds
                            gifs.push(gif);
                            gifIds.push(id);
                        }
                    });
                    return [2 /*return*/, __spreadArrays(gifs)];
            }
        });
    }); };
};

},{}],40:[function(require,module,exports){
(function (global){(function (){
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
        while (_) try {
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
exports.DEFAULT_ERROR = exports.ERROR_PREFIX = void 0;
var fetch_error_1 = __importDefault(require("./fetch-error"));
exports.ERROR_PREFIX = "@giphy/js-fetch-api: ";
exports.DEFAULT_ERROR = 'Error fetching';
var gl = ((typeof window !== 'undefined' ? window : global) || {});
var serverUrl = gl.GIPHY_API_URL || 'https://api.giphy.com/v1/';
var identity = function (i) { return i; };
var requestMap = {};
var maxLife = 60000; // clear memory cache every minute
var errorMaxLife = 6000; // clear error memory cache after a second
var purgeCache = function () {
    var now = Date.now();
    Object.keys(requestMap).forEach(function (key) {
        var ttl = requestMap[key].isError ? errorMaxLife : maxLife;
        if (now - requestMap[key].ts >= ttl) {
            delete requestMap[key];
        }
    });
};
function request(url, normalizer, noCache) {
    var _this = this;
    if (normalizer === void 0) { normalizer = identity; }
    if (noCache === void 0) { noCache = false; }
    purgeCache();
    if (!requestMap[url] || noCache) {
        var makeRequest = function () { return __awaiter(_this, void 0, void 0, function () {
            var fetchError, response, result, message, result, _1, unexpectedError_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, fetch("" + serverUrl + url, {
                                method: 'get',
                            })];
                    case 1:
                        response = _b.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = (_b.sent());
                        // no response id is an indiication of a synthetic response
                        if (!((_a = result.meta) === null || _a === void 0 ? void 0 : _a.response_id)) {
                            throw { message: "synthetic response" };
                        }
                        else {
                            // if everything is successful, we return here, otherwise an error will be thrown
                            return [2 /*return*/, normalizer(result)];
                        }
                        return [3 /*break*/, 8];
                    case 3:
                        message = exports.DEFAULT_ERROR;
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, response.json()];
                    case 5:
                        result = (_b.sent());
                        if (result.message)
                            message = result.message;
                        return [3 /*break*/, 7];
                    case 6:
                        _1 = _b.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        if (requestMap[url]) {
                            // we got a specific error,
                            // normally, you'd want to not fetch this again,
                            // but the api goes down and sends 400s, so allow a refetch after errorMaxLife
                            requestMap[url].isError = true;
                        }
                        // we got an error response, throw with the message in the response body json
                        fetchError = new fetch_error_1.default("" + exports.ERROR_PREFIX + message, response.status, response.statusText);
                        _b.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        unexpectedError_1 = _b.sent();
                        fetchError = new fetch_error_1.default(unexpectedError_1.message);
                        // if the request fails with an unspecfied error,
                        // the user can request again after the error timeout
                        if (requestMap[url]) {
                            requestMap[url].isError = true;
                        }
                        return [3 /*break*/, 10];
                    case 10: throw fetchError;
                }
            });
        }); };
        requestMap[url] = { request: makeRequest(), ts: Date.now() };
    }
    return requestMap[url].request;
}
exports.default = request;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./fetch-error":35}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],42:[function(require,module,exports){
'use strict';

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};

},{}],43:[function(require,module,exports){
'use strict';

var stringify = require('./stringify');
var parse = require('./parse');
var formats = require('./formats');

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};

},{"./formats":42,"./parse":44,"./stringify":45}],44:[function(require,module,exports){
'use strict';

var utils = require('./utils');

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};

},{"./utils":46}],45:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var formats = require('./formats');
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    format,
    formatter,
    encodeValuesOnly,
    charset
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray(obj)) {
        // we need to join elements in
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : undefined }];
    } else if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];
        var value = typeof key === 'object' && key.value !== undefined ? key.value : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var keyPrefix = isArray(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix
            : prefix + (allowDots ? '.' + key : '[' + key + ']');

        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

},{"./formats":42,"./utils":46}],46:[function(require,module,exports){
'use strict';

var formats = require('./formats');

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
            || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};

},{"./formats":42}],47:[function(require,module,exports){
module.exports={
  "_args": [
    [
      "@giphy/js-fetch-api@2.4.0",
      "/Users/semhartesfu/FutureProof/LAP1/LAP-1-Portfolio-Week-Project/client"
    ]
  ],
  "_from": "@giphy/js-fetch-api@2.4.0",
  "_id": "@giphy/js-fetch-api@2.4.0",
  "_inBundle": false,
  "_integrity": "sha512-xiMHnv81XZjgut4yrkHB5QHDWGNhVHoyMDb3kQBy5H0NruwtQ+aM5BE9xbP+XQlxt3eRnPRJcLy5ORk9+K0fIQ==",
  "_location": "/@giphy/js-fetch-api",
  "_phantomChildren": {},
  "_requested": {
    "type": "version",
    "registry": true,
    "raw": "@giphy/js-fetch-api@2.4.0",
    "name": "@giphy/js-fetch-api",
    "escapedName": "@giphy%2fjs-fetch-api",
    "scope": "@giphy",
    "rawSpec": "2.4.0",
    "saveSpec": null,
    "fetchSpec": "2.4.0"
  },
  "_requiredBy": [
    "/",
    "/@giphy/js-components"
  ],
  "_resolved": "https://registry.npmjs.org/@giphy/js-fetch-api/-/js-fetch-api-2.4.0.tgz",
  "_spec": "2.4.0",
  "_where": "/Users/semhartesfu/FutureProof/LAP1/LAP-1-Portfolio-Week-Project/client",
  "dependencies": {
    "@giphy/js-types": "^3.1.0",
    "@giphy/js-util": "^2.2.0",
    "qs": "^6.9.4"
  },
  "description": "Javascript API to fetch gifs and stickers from the GIPHY API.",
  "devDependencies": {
    "@types/qs": "^6.9.4",
    "jest-fetch-mock": "^3.0.3",
    "parcel-bundler": "^1.12.4",
    "typedoc": "^0.18.0",
    "typedoc-thunder-theme": "^0.0.2",
    "typescript": "^4.0.5"
  },
  "files": [
    "dist/**/*",
    "src/**/*"
  ],
  "gitHead": "c2a201f03868e13085e83bb812da345c01504de9",
  "license": "MIT",
  "main": "dist/index.js",
  "name": "@giphy/js-fetch-api",
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "tsc",
    "clean": "rm -rf ./dist",
    "dev": "parcel public/test.html",
    "docs": "typedoc",
    "prepublish": "npm run clean && tsc",
    "test": "jest --config ./jestconfig.js",
    "test:watch": "jest --config ./jestconfig.js --watchAll"
  },
  "types": "dist/index.d.ts",
  "version": "2.4.0"
}

},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRenditionScaleUpMaxPixels = void 0;
var log_1 = require("./log");
var closestArea = function (width, height, renditions) {
    var currentBest = Infinity;
    var result;
    // sort the renditions so we can avoid scaling up low resolutions
    renditions.forEach(function (rendition) {
        var widthPercentage = rendition.width / width;
        var heightPercentage = rendition.height / height;
        // a width percentage of 1 is exact, 2 is double, .5 half etc
        var areaPercentage = widthPercentage * heightPercentage;
        // img could be bigger or smaller
        var testBest = Math.abs(1 - areaPercentage); // the closer to 0 the better
        if (testBest < currentBest) {
            currentBest = testBest;
            result = rendition;
        }
    });
    return result;
};
var SCALE_UP_MAX_PIXELS = 50;
exports.setRenditionScaleUpMaxPixels = function (pixels) {
    log_1.Logger.debug("@giphy/js-util set rendition selection scale up max pixels to " + pixels);
    SCALE_UP_MAX_PIXELS = pixels;
};
/**
 * Finds image rendition that best fits a given container preferring images
 * ##### Note: all renditions are assumed to have the same aspect ratio
 *
 * When we have a portrait target and landscape gif, we choose a higher rendition to match
 * the height of the portrait target, otherwise it's blurry (same applies for landscape to portrait)
 *
 * @name bestfit
 * @function
 * @param {Array.<Object>} renditions available image renditions each having a width and height property
 * @param {Number} width
 * @param {Number} height
 * @param {Number} scaleUpMaxPixels the maximum pixels an asset should be scaled up
 */
function bestfit(renditions, width, height, scaleUpMaxPixels) {
    if (scaleUpMaxPixels === void 0) { scaleUpMaxPixels = SCALE_UP_MAX_PIXELS; }
    var largestRendition = renditions[0];
    // filter out renditions that are smaller than the target width and height by scaleUpMaxPixels value
    var testRenditions = renditions.filter(function (rendition) {
        if (rendition.width * rendition.height > largestRendition.width * largestRendition.height) {
            largestRendition = rendition;
        }
        return width - rendition.width <= scaleUpMaxPixels && height - rendition.height <= scaleUpMaxPixels;
    });
    // if all are too small, use the largest we have
    if (testRenditions.length === 0) {
        return largestRendition;
    }
    // find the closest area of the filtered renditions
    return closestArea(width, height, testRenditions);
}
exports.default = bestfit;

},{"./log":55}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = exports.without = exports.take = exports.forEach = exports.mapValues = void 0;
function mapValues(object, mapFn) {
    if (Array.isArray(object)) {
        throw "This map is just for objects, just use array.map for arrays";
    }
    return Object.keys(object).reduce(function (result, key) {
        result[key] = mapFn(object[key], key);
        return result;
    }, {});
}
exports.mapValues = mapValues;
function forEach(object, mapFn) {
    if (Array.isArray(object)) {
        throw "This map is just for objects, just use array.forEach for arrays";
    }
    return Object.keys(object).forEach(function (key) {
        mapFn(object[key], key);
    });
}
exports.forEach = forEach;
function take(arr, count) {
    if (count === void 0) { count = 0; }
    return arr.slice(0, count);
}
exports.take = take;
function without(arr, values) {
    return arr.filter(function (val) { return values.indexOf(val) === -1; });
}
exports.without = without;
function pick(object, pick) {
    var res = {};
    pick.forEach(function (key) {
        if (object[key] !== undefined) {
            res[key] = object[key];
        }
    });
    return res;
}
exports.pick = pick;

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructMoatData = void 0;
exports.constructMoatData = function (_a) {
    var _b;
    var tdata = _a.tdata;
    var moatTrackerData = (((_b = tdata === null || tdata === void 0 ? void 0 : tdata.web) === null || _b === void 0 ? void 0 : _b.filter(function (tracker) { return tracker.vendor === 'Moat'; })) || [])[0];
    if (moatTrackerData === null || moatTrackerData === void 0 ? void 0 : moatTrackerData.verificationParameters) {
        var _c = moatTrackerData.verificationParameters, _d = _c.moatClientLevel1, moatClientLevel1 = _d === void 0 ? '_ADVERTISER_' : _d, _e = _c.moatClientLevel2, moatClientLevel2 = _e === void 0 ? '_CAMPAIGN_' : _e, _f = _c.moatClientLevel3, moatClientLevel3 = _f === void 0 ? '_LINE_ITEM_' : _f, _g = _c.moatClientLevel4, moatClientLevel4 = _g === void 0 ? '_CREATIVE_' : _g, _h = _c.moatClientSlicer1, moatClientSlicer1 = _h === void 0 ? '_SITE_' : _h, _j = _c.moatClientSlicer2, moatClientSlicer2 = _j === void 0 ? '_PLACEMENT_' : _j, _k = _c.zMoatPosition, zMoatPosition = _k === void 0 ? '_POSITION_' : _k;
        return {
            moatClientLevel1: moatClientLevel1,
            moatClientLevel2: moatClientLevel2,
            moatClientLevel3: moatClientLevel3,
            moatClientLevel4: moatClientLevel4,
            moatClientSlicer1: moatClientSlicer1,
            moatClientSlicer2: moatClientSlicer2,
            zMoatPosition: zMoatPosition,
        };
    }
};

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param el HTMLElement
 * @returns calculated properties of ClientRect
 */
var getClientRect = function (el) {
    var left = 0;
    var top = 0;
    var width = el.offsetWidth;
    var height = el.offsetHeight;
    // no layout thrash
    do {
        left += el.offsetLeft;
        top += el.offsetTop;
        el = el.offsetParent;
    } while (el);
    // TODO check this
    return { left: left, top: top, width: width, height: height, right: left + width, bottom: top + height };
};
exports.default = getClientRect;

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var pingbackId = '';
var getPingbackId = function () {
    // it exists in memory
    if (!pingbackId) {
        try {
            // it exists in storage
            pingbackId = sessionStorage.getItem('giphyPingbackId');
        }
        catch (_) { }
        if (!pingbackId) {
            // we need to create it
            var hexTime = new Date().getTime().toString(16); // was told to mimic what we had
            pingbackId = ("" + hexTime + uuid_1.v4().replace(/-/g, '')).substring(0, 16); // 16 character max
            try {
                // save in storage
                sessionStorage.setItem('giphyPingbackId', pingbackId);
            }
            catch (_) { }
        }
    }
    return pingbackId;
};
exports.default = getPingbackId;

},{"uuid":70}],53:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAltText = exports.getGifWidth = exports.getGifHeight = exports.getBestRenditionUrl = exports.getBestRendition = exports.getSpecificRendition = void 0;
var collections_1 = require("./collections");
var bestfit_1 = __importDefault(require("./bestfit"));
var webp_check_1 = require("./webp-check");
exports.getSpecificRendition = function (_a, renditionLabel, isStill, useVideo) {
    var images = _a.images, isSticker = _a.is_sticker;
    if (isStill === void 0) { isStill = false; }
    if (useVideo === void 0) { useVideo = false; }
    if (!images || !renditionLabel)
        return '';
    isStill = isStill && !useVideo;
    // @ts-ignore come back to this
    var rendition = images["" + renditionLabel + (isStill ? '_still' : '')];
    if (rendition) {
        if (isSticker || isStill) {
            return rendition.url;
        }
        var webP = webp_check_1.SUPPORTS_WEBP && rendition.webp;
        return useVideo ? rendition.mp4 : webP || rendition.url;
    }
    return '';
};
var getRenditions = function (type, images, video) {
    return type === 'video' && video && video.previews && !Object.keys(images).length ? video.previews : images;
};
exports.getBestRendition = function (images, gifWidth, gifHeight, scaleUpMaxPixels) {
    var checkRenditions = collections_1.pick(images, [
        'original',
        'fixed_width',
        'fixed_height',
        'fixed_width_small',
        'fixed_height_small',
    ]);
    var testImages = Object.entries(checkRenditions).map(function (_a) {
        var renditionName = _a[0], val = _a[1];
        return (__assign({ renditionName: renditionName }, val));
    });
    return bestfit_1.default(testImages, gifWidth, gifHeight, scaleUpMaxPixels);
};
exports.getBestRenditionUrl = function (_a, gifWidth, gifHeight, options) {
    var images = _a.images, video = _a.video, type = _a.type;
    if (options === void 0) { options = { isStill: false, useVideo: false }; }
    if (!gifWidth || !gifHeight || !images)
        return '';
    var useVideo = options.useVideo, isStill = options.isStill, scaleUpMaxPixels = options.scaleUpMaxPixels;
    var renditions = getRenditions(type, images, video);
    var renditionName = exports.getBestRendition(renditions, gifWidth, gifHeight, scaleUpMaxPixels).renditionName;
    // still, video, webp or gif
    var key = "" + renditionName + (isStill && !useVideo ? '_still' : '');
    var rendition = renditions[key];
    var match = useVideo ? rendition.mp4 : webp_check_1.SUPPORTS_WEBP && rendition.webp ? rendition.webp : rendition.url;
    return (match || '');
};
exports.getGifHeight = function (_a, gifWidth) {
    var images = _a.images;
    var fixed_width = images.fixed_width;
    if (fixed_width) {
        var width = fixed_width.width, height = fixed_width.height;
        var aspectRatio = width / height;
        return Math.round(gifWidth / aspectRatio);
    }
    return 0;
};
exports.getGifWidth = function (_a, gifHeight) {
    var images = _a.images;
    var fixed_width = images.fixed_width;
    if (fixed_width) {
        var width = fixed_width.width, height = fixed_width.height;
        var aspectRatio = width / height;
        return Math.round(gifHeight * aspectRatio);
    }
    return 0;
};
/**
 * GIF Text - Alt Text: Generates alt text for
 * GIF images based on username and tags.
 * @prop  {Gif}
 * @return {String} GIF alt text.
 */
exports.getAltText = function (_a) {
    var user = _a.user, _b = _a.tags, tags = _b === void 0 ? [] : _b, _c = _a.is_sticker, is_sticker = _c === void 0 ? false : _c, _d = _a.title, title = _d === void 0 ? '' : _d;
    if (title) {
        return title;
    }
    var username = (user && user.username) || '';
    var filteredTags = collections_1.take(collections_1.without(tags, ['transparent']), username ? 4 : 5);
    return "" + (username ? username + " " : "") + filteredTags.join(' ') + " " + (is_sticker ? 'Sticker' : 'GIF');
};

},{"./bestfit":48,"./collections":49,"./webp-check":58}],54:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfWebP = exports.injectTrackingPixel = exports.getSpecificRendition = exports.getGifWidth = exports.getGifHeight = exports.getBestRenditionUrl = exports.getBestRendition = exports.getAltText = exports.getPingbackId = exports.getClientRect = exports.setRenditionScaleUpMaxPixels = exports.bestfit = void 0;
var bestfit_1 = require("./bestfit");
Object.defineProperty(exports, "bestfit", { enumerable: true, get: function () { return __importDefault(bestfit_1).default; } });
Object.defineProperty(exports, "setRenditionScaleUpMaxPixels", { enumerable: true, get: function () { return bestfit_1.setRenditionScaleUpMaxPixels; } });
__exportStar(require("./collections"), exports);
__exportStar(require("./construct-moat-data"), exports);
var get_client_rect_from_el_1 = require("./get-client-rect-from-el");
Object.defineProperty(exports, "getClientRect", { enumerable: true, get: function () { return __importDefault(get_client_rect_from_el_1).default; } });
var get_pingback_id_1 = require("./get-pingback-id");
Object.defineProperty(exports, "getPingbackId", { enumerable: true, get: function () { return __importDefault(get_pingback_id_1).default; } });
var gif_utils_1 = require("./gif-utils");
Object.defineProperty(exports, "getAltText", { enumerable: true, get: function () { return gif_utils_1.getAltText; } });
Object.defineProperty(exports, "getBestRendition", { enumerable: true, get: function () { return gif_utils_1.getBestRendition; } });
Object.defineProperty(exports, "getBestRenditionUrl", { enumerable: true, get: function () { return gif_utils_1.getBestRenditionUrl; } });
Object.defineProperty(exports, "getGifHeight", { enumerable: true, get: function () { return gif_utils_1.getGifHeight; } });
Object.defineProperty(exports, "getGifWidth", { enumerable: true, get: function () { return gif_utils_1.getGifWidth; } });
Object.defineProperty(exports, "getSpecificRendition", { enumerable: true, get: function () { return gif_utils_1.getSpecificRendition; } });
__exportStar(require("./log"), exports);
__exportStar(require("./sdk-headers"), exports);
var tracking_pixel_1 = require("./tracking-pixel");
Object.defineProperty(exports, "injectTrackingPixel", { enumerable: true, get: function () { return __importDefault(tracking_pixel_1).default; } });
var webp_check_1 = require("./webp-check");
Object.defineProperty(exports, "checkIfWebP", { enumerable: true, get: function () { return webp_check_1.checkIfWebP; } });

},{"./bestfit":48,"./collections":49,"./construct-moat-data":50,"./get-client-rect-from-el":51,"./get-pingback-id":52,"./gif-utils":53,"./log":55,"./sdk-headers":56,"./tracking-pixel":57,"./webp-check":58}],55:[function(require,module,exports){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
/* istanbul ignore next */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/* istanbul ignore next */
exports.Logger = {
    ENABLED: typeof window !== 'undefined' && location && location.search.indexOf('giphy-debug') !== -1,
    LEVEL: 0,
    PREFIX: 'GiphyJS',
    debug: function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        if (exports.Logger.ENABLED && exports.Logger.LEVEL <= LogLevel.DEBUG) {
            console.debug.apply(console, __spreadArrays([exports.Logger.PREFIX], msg)); // eslint-disable-line no-console
        }
    },
    info: function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        if (exports.Logger.ENABLED && exports.Logger.LEVEL <= LogLevel.INFO) {
            console.info.apply(console, __spreadArrays([exports.Logger.PREFIX], msg)); // eslint-disable-line no-console
        }
    },
    warn: function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        if (exports.Logger.ENABLED && exports.Logger.LEVEL <= LogLevel.WARN) {
            console.warn.apply(console, __spreadArrays([exports.Logger.PREFIX], msg)); // eslint-disable-line no-console
        }
    },
    error: function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        if (exports.Logger.ENABLED && exports.Logger.LEVEL <= LogLevel.ERROR) {
            console.error.apply(console, __spreadArrays([exports.Logger.PREFIX], msg)); // eslint-disable-line no-console
        }
    },
};

},{}],56:[function(require,module,exports){
(function (global){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendGiphySDKRequestParam = exports.appendGiphySDKRequestHeader = exports.getGiphySDKRequestHeaders = void 0;
var gl = ((typeof window !== 'undefined' ? window : global) || {});
// define _GIPHY_SDK_HEADERS_ if they don't exist
gl._GIPHY_SDK_HEADERS_ =
    gl._GIPHY_SDK_HEADERS_ ||
        (gl.Headers
            ? new gl.Headers({
                'X-GIPHY-SDK-PLATFORM': 'web',
            })
            : undefined);
exports.getGiphySDKRequestHeaders = function () { return gl._GIPHY_SDK_HEADERS_; };
exports.appendGiphySDKRequestHeader = function (key, value) { var _a; return (_a = exports.getGiphySDKRequestHeaders()) === null || _a === void 0 ? void 0 : _a.set(key, value); };
exports.appendGiphySDKRequestParam = function (key, value) { var _a; return (_a = exports.getGiphySDKRequestHeaders()) === null || _a === void 0 ? void 0 : _a.set(key, value); };

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dompurify_1 = require("dompurify");
var injectTrackingPixel = function (tags) {
    if (tags === void 0) { tags = []; }
    tags.forEach(function (tag) {
        var _a;
        var el = document.createElement('html');
        tag = tag.replace('%%CACHEBUSTER%%', Date.now().toString());
        el.innerHTML = dompurify_1.sanitize(tag);
        var pixel = el.querySelector('img');
        if (pixel) {
            (_a = document === null || document === void 0 ? void 0 : document.querySelector('head')) === null || _a === void 0 ? void 0 : _a.appendChild(pixel);
        }
    });
};
exports.default = injectTrackingPixel;

},{"dompurify":61}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfWebP = exports.SUPPORTS_WEBP = void 0;
exports.SUPPORTS_WEBP = null;
/* istanbul ignore next */
exports.checkIfWebP = new Promise(function (resolve) {
    if (typeof Image === 'undefined') {
        resolve(false);
    }
    var webp = new Image();
    webp.onload = function () {
        exports.SUPPORTS_WEBP = true;
        resolve(exports.SUPPORTS_WEBP);
    };
    webp.onerror = function () {
        exports.SUPPORTS_WEBP = false;
        resolve(exports.SUPPORTS_WEBP);
    };
    webp.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
});

},{}],59:[function(require,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Bricks = factory());
}(this, (function () { 'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var knot = function knot() {
  var extended = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var events = Object.create(null);

  function on(name, handler) {
    events[name] = events[name] || [];
    events[name].push(handler);
    return this;
  }

  function once(name, handler) {
    handler._once = true;
    on(name, handler);
    return this;
  }

  function off(name) {
    var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    handler ? events[name].splice(events[name].indexOf(handler), 1) : delete events[name];

    return this;
  }

  function emit(name) {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    // cache the events, to avoid consequences of mutation
    var cache = events[name] && events[name].slice();

    // only fire handlers if they exist
    cache && cache.forEach(function (handler) {
      // remove handlers added with 'once'
      handler._once && off(name, handler);

      // set 'this' context, pass args to handlers
      handler.apply(_this, args);
    });

    return this;
  }

  return _extends({}, extended, {

    on: on,
    once: once,
    off: off,
    emit: emit
  });
};

var bricks = function bricks() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // privates

  var persist = void 0; // packing new elements, or all elements?
  var ticking = void 0; // for debounced resize

  var sizeIndex = void 0;
  var sizeDetail = void 0;

  var columnTarget = void 0;
  var columnHeights = void 0;

  var nodeTop = void 0;
  var nodeLeft = void 0;
  var nodeWidth = void 0;
  var nodeHeight = void 0;

  var nodes = void 0;
  var nodesWidths = void 0;
  var nodesHeights = void 0;

  // resolve options

  var packed = options.packed.indexOf('data-') === 0 ? options.packed : 'data-' + options.packed;
  var sizes = options.sizes.slice().reverse();
  var position = options.position !== false;

  var container = options.container.nodeType ? options.container : document.querySelector(options.container);

  var selectors = {
    all: function all() {
      return toArray(container.children);
    },
    new: function _new() {
      return toArray(container.children).filter(function (node) {
        return !node.hasAttribute('' + packed);
      });
    }
  };

  // series

  var setup = [setSizeIndex, setSizeDetail, setColumns];

  var run = [setNodes, setNodesDimensions, setNodesStyles, setContainerStyles];

  // instance

  var instance = knot({
    pack: pack,
    update: update,
    resize: resize
  });

  return instance;

  // general helpers

  function runSeries(functions) {
    functions.forEach(function (func) {
      return func();
    });
  }

  // array helpers

  function toArray(input) {
    var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

    return Array.prototype.slice.call(input);
  }

  function fillArray(length) {
    return Array.apply(null, Array(length)).map(function () {
      return 0;
    });
  }

  // size helpers

  function getSizeIndex() {
    // find index of widest matching media query
    return sizes.map(function (size) {
      return size.mq && window.matchMedia('(min-width: ' + size.mq + ')').matches;
    }).indexOf(true);
  }

  function setSizeIndex() {
    sizeIndex = getSizeIndex();
  }

  function setSizeDetail() {
    // if no media queries matched, use the base case
    sizeDetail = sizeIndex === -1 ? sizes[sizes.length - 1] : sizes[sizeIndex];
  }

  // column helpers

  function setColumns() {
    columnHeights = fillArray(sizeDetail.columns);
  }

  // node helpers

  function setNodes() {
    nodes = selectors[persist ? 'new' : 'all']();
  }

  function setNodesDimensions() {
    // exit if empty container
    if (nodes.length === 0) {
      return;
    }

    nodesWidths = nodes.map(function (element) {
      return element.clientWidth;
    });
    nodesHeights = nodes.map(function (element) {
      return element.clientHeight;
    });
  }

  function setNodesStyles() {
    nodes.forEach(function (element, index) {
      columnTarget = columnHeights.indexOf(Math.min.apply(Math, columnHeights));

      element.style.position = 'absolute';

      nodeTop = columnHeights[columnTarget] + 'px';
      nodeLeft = columnTarget * nodesWidths[index] + columnTarget * sizeDetail.gutter + 'px';

      // support positioned elements (default) or transformed elements
      if (position) {
        element.style.top = nodeTop;
        element.style.left = nodeLeft;
      } else {
        element.style.transform = 'translate3d(' + nodeLeft + ', ' + nodeTop + ', 0)';
      }

      element.setAttribute(packed, '');

      // ignore nodes with no width and/or height
      nodeWidth = nodesWidths[index];
      nodeHeight = nodesHeights[index];

      if (nodeWidth && nodeHeight) {
        columnHeights[columnTarget] += nodeHeight + sizeDetail.gutter;
      }
    });
  }

  // container helpers

  function setContainerStyles() {
    container.style.position = 'relative';
    container.style.width = sizeDetail.columns * nodeWidth + (sizeDetail.columns - 1) * sizeDetail.gutter + 'px';
    container.style.height = Math.max.apply(Math, columnHeights) - sizeDetail.gutter + 'px';
  }

  // resize helpers

  function resizeFrame() {
    if (!ticking) {
      window.requestAnimationFrame(resizeHandler);
      ticking = true;
    }
  }

  function resizeHandler() {
    if (sizeIndex !== getSizeIndex()) {
      pack();
      instance.emit('resize', sizeDetail);
    }

    ticking = false;
  }

  // API

  function pack() {
    persist = false;
    runSeries(setup.concat(run));

    return instance.emit('pack');
  }

  function update() {
    persist = true;
    runSeries(run);

    return instance.emit('update');
  }

  function resize() {
    var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    var action = flag ? 'addEventListener' : 'removeEventListener';

    window[action]('resize', resizeFrame);

    return instance;
  }
};

return bricks;

})));

},{}],60:[function(require,module,exports){
(function (process){(function (){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var createCache = _interopDefault(require('@emotion/cache'));
var serialize = require('@emotion/serialize');
var utils = require('@emotion/utils');

function insertWithoutScoping(cache, serialized) {
  if (cache.inserted[serialized.name] === undefined) {
    return cache.insert('', serialized, cache.sheet, true);
  }
}

function merge(registered, css, className) {
  var registeredStyles = [];
  var rawClassName = utils.getRegisteredStyles(registered, registeredStyles, className);

  if (registeredStyles.length < 2) {
    return className;
  }

  return rawClassName + css(registeredStyles);
}

var createEmotion = function createEmotion(options) {
  var cache = createCache(options); // $FlowFixMe

  cache.sheet.speedy = function (value) {
    if (process.env.NODE_ENV !== 'production' && this.ctr !== 0) {
      throw new Error('speedy must be changed before any rules are inserted');
    }

    this.isSpeedy = value;
  };

  cache.compat = true;

  var css = function css() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var serialized = serialize.serializeStyles(args, cache.registered, undefined);
    utils.insertStyles(cache, serialized, false);
    return cache.key + "-" + serialized.name;
  };

  var keyframes = function keyframes() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var serialized = serialize.serializeStyles(args, cache.registered);
    var animation = "animation-" + serialized.name;
    insertWithoutScoping(cache, {
      name: serialized.name,
      styles: "@keyframes " + animation + "{" + serialized.styles + "}"
    });
    return animation;
  };

  var injectGlobal = function injectGlobal() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var serialized = serialize.serializeStyles(args, cache.registered);
    insertWithoutScoping(cache, serialized);
  };

  var cx = function cx() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return merge(cache.registered, css, classnames(args));
  };

  return {
    css: css,
    cx: cx,
    injectGlobal: injectGlobal,
    keyframes: keyframes,
    hydrate: function hydrate(ids) {
      ids.forEach(function (key) {
        cache.inserted[key] = true;
      });
    },
    flush: function flush() {
      cache.registered = {};
      cache.inserted = {};
      cache.sheet.flush();
    },
    // $FlowFixMe
    sheet: cache.sheet,
    cache: cache,
    getRegisteredStyles: utils.getRegisteredStyles.bind(null, cache.registered),
    merge: merge.bind(null, cache.registered, css)
  };
};

var classnames = function classnames(args) {
  var cls = '';

  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};

exports.default = createEmotion;

}).call(this)}).call(this,require('_process'))
},{"@emotion/cache":1,"@emotion/serialize":4,"@emotion/utils":8,"_process":68}],61:[function(require,module,exports){
/*! @license DOMPurify | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.2.2/LICENSE */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.DOMPurify = factory());
}(this, function () { 'use strict';

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  var hasOwnProperty = Object.hasOwnProperty,
      setPrototypeOf = Object.setPrototypeOf,
      isFrozen = Object.isFrozen,
      getPrototypeOf = Object.getPrototypeOf,
      getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var freeze = Object.freeze,
      seal = Object.seal,
      create = Object.create; // eslint-disable-line import/no-mutable-exports

  var _ref = typeof Reflect !== 'undefined' && Reflect,
      apply = _ref.apply,
      construct = _ref.construct;

  if (!apply) {
    apply = function apply(fun, thisValue, args) {
      return fun.apply(thisValue, args);
    };
  }

  if (!freeze) {
    freeze = function freeze(x) {
      return x;
    };
  }

  if (!seal) {
    seal = function seal(x) {
      return x;
    };
  }

  if (!construct) {
    construct = function construct(Func, args) {
      return new (Function.prototype.bind.apply(Func, [null].concat(_toConsumableArray(args))))();
    };
  }

  var arrayForEach = unapply(Array.prototype.forEach);
  var arrayPop = unapply(Array.prototype.pop);
  var arrayPush = unapply(Array.prototype.push);

  var stringToLowerCase = unapply(String.prototype.toLowerCase);
  var stringMatch = unapply(String.prototype.match);
  var stringReplace = unapply(String.prototype.replace);
  var stringIndexOf = unapply(String.prototype.indexOf);
  var stringTrim = unapply(String.prototype.trim);

  var regExpTest = unapply(RegExp.prototype.test);

  var typeErrorCreate = unconstruct(TypeError);

  function unapply(func) {
    return function (thisArg) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return apply(func, thisArg, args);
    };
  }

  function unconstruct(func) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return construct(func, args);
    };
  }

  /* Add properties to a lookup table */
  function addToSet(set, array) {
    if (setPrototypeOf) {
      // Make 'in' and truthy checks like Boolean(set.constructor)
      // independent of any properties defined on Object.prototype.
      // Prevent prototype setters from intercepting set as a this value.
      setPrototypeOf(set, null);
    }

    var l = array.length;
    while (l--) {
      var element = array[l];
      if (typeof element === 'string') {
        var lcElement = stringToLowerCase(element);
        if (lcElement !== element) {
          // Config presets (e.g. tags.js, attrs.js) are immutable.
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }

          element = lcElement;
        }
      }

      set[element] = true;
    }

    return set;
  }

  /* Shallow clone an object */
  function clone(object) {
    var newObject = create(null);

    var property = void 0;
    for (property in object) {
      if (apply(hasOwnProperty, object, [property])) {
        newObject[property] = object[property];
      }
    }

    return newObject;
  }

  /* IE10 doesn't support __lookupGetter__ so lets'
   * simulate it. It also automatically checks
   * if the prop is function or getter and behaves
   * accordingly. */
  function lookupGetter(object, prop) {
    while (object !== null) {
      var desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }

        if (typeof desc.value === 'function') {
          return unapply(desc.value);
        }
      }

      object = getPrototypeOf(object);
    }

    function fallbackValue(element) {
      console.warn('fallback value for', element);
      return null;
    }

    return fallbackValue;
  }

  var html = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);

  // SVG
  var svg = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);

  var svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);

  // List of SVG elements that are disallowed by default.
  // We still need to know them so that we can do namespace
  // checks properly in case one wants to add them to
  // allow-list.
  var svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'fedropshadow', 'feimage', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);

  var mathMl = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover']);

  // Similarly to SVG, we want to know all MathML elements,
  // even those that we disallow by default.
  var mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);

  var text = freeze(['#text']);

  var html$1 = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns']);

  var svg$1 = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'targetx', 'targety', 'transform', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);

  var mathMl$1 = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);

  var xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

  // eslint-disable-next-line unicorn/better-regex
  var MUSTACHE_EXPR = seal(/\{\{[\s\S]*|[\s\S]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
  var ERB_EXPR = seal(/<%[\s\S]*|[\s\S]*%>/gm);
  var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/); // eslint-disable-line no-useless-escape
  var ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
  var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
  );
  var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
  );

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  var getGlobal = function getGlobal() {
    return typeof window === 'undefined' ? null : window;
  };

  /**
   * Creates a no-op policy for internal use only.
   * Don't export this function outside this module!
   * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
   * @param {Document} document The document object (to determine policy name suffix)
   * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
   * are not supported).
   */
  var _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, document) {
    if ((typeof trustedTypes === 'undefined' ? 'undefined' : _typeof(trustedTypes)) !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
      return null;
    }

    // Allow the callers to control the unique policy name
    // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
    // Policy creation with duplicate names throws in Trusted Types.
    var suffix = null;
    var ATTR_NAME = 'data-tt-policy-suffix';
    if (document.currentScript && document.currentScript.hasAttribute(ATTR_NAME)) {
      suffix = document.currentScript.getAttribute(ATTR_NAME);
    }

    var policyName = 'dompurify' + (suffix ? '#' + suffix : '');

    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML: function createHTML(html$$1) {
          return html$$1;
        }
      });
    } catch (_) {
      // Policy creation failed (most likely another DOMPurify script has
      // already run). Skip creating the policy, as this will only cause errors
      // if TT are enforced.
      console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
      return null;
    }
  };

  function createDOMPurify() {
    var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();

    var DOMPurify = function DOMPurify(root) {
      return createDOMPurify(root);
    };

    /**
     * Version label, exposed for easier checks
     * if DOMPurify is up to date or not
     */
    DOMPurify.version = '2.2.7';

    /**
     * Array of elements that DOMPurify removed during sanitation.
     * Empty if nothing was removed.
     */
    DOMPurify.removed = [];

    if (!window || !window.document || window.document.nodeType !== 9) {
      // Not running in a browser, provide a factory function
      // so that you can pass your own Window
      DOMPurify.isSupported = false;

      return DOMPurify;
    }

    var originalDocument = window.document;

    var document = window.document;
    var DocumentFragment = window.DocumentFragment,
        HTMLTemplateElement = window.HTMLTemplateElement,
        Node = window.Node,
        Element = window.Element,
        NodeFilter = window.NodeFilter,
        _window$NamedNodeMap = window.NamedNodeMap,
        NamedNodeMap = _window$NamedNodeMap === undefined ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap,
        Text = window.Text,
        Comment = window.Comment,
        DOMParser = window.DOMParser,
        trustedTypes = window.trustedTypes;


    var ElementPrototype = Element.prototype;

    var cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
    var getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
    var getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
    var getParentNode = lookupGetter(ElementPrototype, 'parentNode');

    // As per issue #47, the web-components registry is inherited by a
    // new document created via createHTMLDocument. As per the spec
    // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
    // a new empty registry is used when creating a template contents owner
    // document, so we use that as our parent document to ensure nothing
    // is inherited.
    if (typeof HTMLTemplateElement === 'function') {
      var template = document.createElement('template');
      if (template.content && template.content.ownerDocument) {
        document = template.content.ownerDocument;
      }
    }

    var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);
    var emptyHTML = trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML('') : '';

    var _document = document,
        implementation = _document.implementation,
        createNodeIterator = _document.createNodeIterator,
        getElementsByTagName = _document.getElementsByTagName,
        createDocumentFragment = _document.createDocumentFragment;
    var importNode = originalDocument.importNode;


    var documentMode = {};
    try {
      documentMode = clone(document).documentMode ? document.documentMode : {};
    } catch (_) {}

    var hooks = {};

    /**
     * Expose whether this browser supports running the full DOMPurify.
     */
    DOMPurify.isSupported = typeof getParentNode === 'function' && implementation && typeof implementation.createHTMLDocument !== 'undefined' && documentMode !== 9;

    var MUSTACHE_EXPR$$1 = MUSTACHE_EXPR,
        ERB_EXPR$$1 = ERB_EXPR,
        DATA_ATTR$$1 = DATA_ATTR,
        ARIA_ATTR$$1 = ARIA_ATTR,
        IS_SCRIPT_OR_DATA$$1 = IS_SCRIPT_OR_DATA,
        ATTR_WHITESPACE$$1 = ATTR_WHITESPACE;
    var IS_ALLOWED_URI$$1 = IS_ALLOWED_URI;

    /**
     * We consider the elements and attributes below to be safe. Ideally
     * don't add any new ones but feel free to remove unwanted ones.
     */

    /* allowed element names */

    var ALLOWED_TAGS = null;
    var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(html), _toConsumableArray$1(svg), _toConsumableArray$1(svgFilters), _toConsumableArray$1(mathMl), _toConsumableArray$1(text)));

    /* Allowed attribute names */
    var ALLOWED_ATTR = null;
    var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray$1(html$1), _toConsumableArray$1(svg$1), _toConsumableArray$1(mathMl$1), _toConsumableArray$1(xml)));

    /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
    var FORBID_TAGS = null;

    /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
    var FORBID_ATTR = null;

    /* Decide if ARIA attributes are okay */
    var ALLOW_ARIA_ATTR = true;

    /* Decide if custom data attributes are okay */
    var ALLOW_DATA_ATTR = true;

    /* Decide if unknown protocols are okay */
    var ALLOW_UNKNOWN_PROTOCOLS = false;

    /* Output should be safe for common template engines.
     * This means, DOMPurify removes data attributes, mustaches and ERB
     */
    var SAFE_FOR_TEMPLATES = false;

    /* Decide if document with <html>... should be returned */
    var WHOLE_DOCUMENT = false;

    /* Track whether config is already set on this instance of DOMPurify. */
    var SET_CONFIG = false;

    /* Decide if all elements (e.g. style, script) must be children of
     * document.body. By default, browsers might move them to document.head */
    var FORCE_BODY = false;

    /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
     * string (or a TrustedHTML object if Trusted Types are supported).
     * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
     */
    var RETURN_DOM = false;

    /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
     * string  (or a TrustedHTML object if Trusted Types are supported) */
    var RETURN_DOM_FRAGMENT = false;

    /* If `RETURN_DOM` or `RETURN_DOM_FRAGMENT` is enabled, decide if the returned DOM
     * `Node` is imported into the current `Document`. If this flag is not enabled the
     * `Node` will belong (its ownerDocument) to a fresh `HTMLDocument`, created by
     * DOMPurify.
     *
     * This defaults to `true` starting DOMPurify 2.2.0. Note that setting it to `false`
     * might cause XSS from attacks hidden in closed shadowroots in case the browser
     * supports Declarative Shadow: DOM https://web.dev/declarative-shadow-dom/
     */
    var RETURN_DOM_IMPORT = true;

    /* Try to return a Trusted Type object instead of a string, return a string in
     * case Trusted Types are not supported  */
    var RETURN_TRUSTED_TYPE = false;

    /* Output should be free from DOM clobbering attacks? */
    var SANITIZE_DOM = true;

    /* Keep element content when removing element? */
    var KEEP_CONTENT = true;

    /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
     * of importing it into a new Document and returning a sanitized copy */
    var IN_PLACE = false;

    /* Allow usage of profiles like html, svg and mathMl */
    var USE_PROFILES = {};

    /* Tags to ignore content of when KEEP_CONTENT is true */
    var FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);

    /* Tags that are safe for data: URIs */
    var DATA_URI_TAGS = null;
    var DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);

    /* Attributes safe for values like "javascript:" */
    var URI_SAFE_ATTRIBUTES = null;
    var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'summary', 'title', 'value', 'style', 'xmlns']);

    /* Keep a reference to config to pass to hooks */
    var CONFIG = null;

    /* Ideally, do not touch anything below this line */
    /* ______________________________________________ */

    var formElement = document.createElement('form');

    /**
     * _parseConfig
     *
     * @param  {Object} cfg optional config literal
     */
    // eslint-disable-next-line complexity
    var _parseConfig = function _parseConfig(cfg) {
      if (CONFIG && CONFIG === cfg) {
        return;
      }

      /* Shield configuration object from tampering */
      if (!cfg || (typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) !== 'object') {
        cfg = {};
      }

      /* Shield configuration object from prototype pollution */
      cfg = clone(cfg);

      /* Set configuration parameters */
      ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR;
      URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR) : DEFAULT_URI_SAFE_ATTRIBUTES;
      DATA_URI_TAGS = 'ADD_DATA_URI_TAGS' in cfg ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS) : DEFAULT_DATA_URI_TAGS;
      FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS) : {};
      FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR) : {};
      USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
      RETURN_DOM = cfg.RETURN_DOM || false; // Default false
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
      RETURN_DOM_IMPORT = cfg.RETURN_DOM_IMPORT !== false; // Default true
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
      FORCE_BODY = cfg.FORCE_BODY || false; // Default false
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
      IN_PLACE = cfg.IN_PLACE || false; // Default false
      IS_ALLOWED_URI$$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$$1;
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }

      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }

      /* Parse profile info */
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(text)));
        ALLOWED_ATTR = [];
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html);
          addToSet(ALLOWED_ATTR, html$1);
        }

        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg);
          addToSet(ALLOWED_ATTR, svg$1);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg$1);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl);
          addToSet(ALLOWED_ATTR, mathMl$1);
          addToSet(ALLOWED_ATTR, xml);
        }
      }

      /* Merge configuration parameters */
      if (cfg.ADD_TAGS) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }

        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS);
      }

      if (cfg.ADD_ATTR) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }

        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR);
      }

      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR);
      }

      /* Add #text in case KEEP_CONTENT is set to true */
      if (KEEP_CONTENT) {
        ALLOWED_TAGS['#text'] = true;
      }

      /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
      }

      /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ['tbody']);
        delete FORBID_TAGS.tbody;
      }

      // Prevent further manipulation of configuration.
      // Not available in IE8, Safari 5, etc.
      if (freeze) {
        freeze(cfg);
      }

      CONFIG = cfg;
    };

    var MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);

    var HTML_INTEGRATION_POINTS = addToSet({}, ['foreignobject', 'desc', 'title', 'annotation-xml']);

    /* Keep track of all possible SVG and MathML tags
     * so that we can perform the namespace checks
     * correctly. */
    var ALL_SVG_TAGS = addToSet({}, svg);
    addToSet(ALL_SVG_TAGS, svgFilters);
    addToSet(ALL_SVG_TAGS, svgDisallowed);

    var ALL_MATHML_TAGS = addToSet({}, mathMl);
    addToSet(ALL_MATHML_TAGS, mathMlDisallowed);

    var MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
    var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

    /**
     *
     *
     * @param  {Element} element a DOM element whose namespace is being checked
     * @returns {boolean} Return false if the element has a
     *  namespace that a spec-compliant parser would never
     *  return. Return true otherwise.
     */
    var _checkValidNamespace = function _checkValidNamespace(element) {
      var parent = getParentNode(element);

      // In JSDOM, if we're inside shadow DOM, then parentNode
      // can be null. We just simulate parent in this case.
      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: HTML_NAMESPACE,
          tagName: 'template'
        };
      }

      var tagName = stringToLowerCase(element.tagName);
      var parentTagName = stringToLowerCase(parent.tagName);

      if (element.namespaceURI === SVG_NAMESPACE) {
        // The only way to switch from HTML namespace to SVG
        // is via <svg>. If it happens via any other tag, then
        // it should be killed.
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === 'svg';
        }

        // The only way to switch from MathML to SVG is via
        // svg if parent is either <annotation-xml> or MathML
        // text integration points.
        if (parent.namespaceURI === MATHML_NAMESPACE) {
          return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
        }

        // We only allow elements that are defined in SVG
        // spec. All others are disallowed in SVG namespace.
        return Boolean(ALL_SVG_TAGS[tagName]);
      }

      if (element.namespaceURI === MATHML_NAMESPACE) {
        // The only way to switch from HTML namespace to MathML
        // is via <math>. If it happens via any other tag, then
        // it should be killed.
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === 'math';
        }

        // The only way to switch from SVG to MathML is via
        // <math> and HTML integration points
        if (parent.namespaceURI === SVG_NAMESPACE) {
          return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
        }

        // We only allow elements that are defined in MathML
        // spec. All others are disallowed in MathML namespace.
        return Boolean(ALL_MATHML_TAGS[tagName]);
      }

      if (element.namespaceURI === HTML_NAMESPACE) {
        // The only way to switch from SVG to HTML is via
        // HTML integration points, and from MathML to HTML
        // is via MathML text integration points
        if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }

        if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }

        // Certain elements are allowed in both SVG and HTML
        // namespace. We need to specify them explicitly
        // so that they don't get erronously deleted from
        // HTML namespace.
        var commonSvgAndHTMLElements = addToSet({}, ['title', 'style', 'font', 'a', 'script']);

        // We disallow tags that are specific for MathML
        // or SVG and should never appear in HTML namespace
        return !ALL_MATHML_TAGS[tagName] && (commonSvgAndHTMLElements[tagName] || !ALL_SVG_TAGS[tagName]);
      }

      // The code should never reach this place (this means
      // that the element somehow got namespace that is not
      // HTML, SVG or MathML). Return false just in case.
      return false;
    };

    /**
     * _forceRemove
     *
     * @param  {Node} node a DOM node
     */
    var _forceRemove = function _forceRemove(node) {
      arrayPush(DOMPurify.removed, { element: node });
      try {
        node.parentNode.removeChild(node);
      } catch (_) {
        try {
          node.outerHTML = emptyHTML;
        } catch (_) {
          node.remove();
        }
      }
    };

    /**
     * _removeAttribute
     *
     * @param  {String} name an Attribute name
     * @param  {Node} node a DOM node
     */
    var _removeAttribute = function _removeAttribute(name, node) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: node.getAttributeNode(name),
          from: node
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: node
        });
      }

      node.removeAttribute(name);

      // We void attribute values for unremovable "is"" attributes
      if (name === 'is' && !ALLOWED_ATTR[name]) {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(node);
          } catch (_) {}
        } else {
          try {
            node.setAttribute(name, '');
          } catch (_) {}
        }
      }
    };

    /**
     * _initDocument
     *
     * @param  {String} dirty a string of dirty markup
     * @return {Document} a DOM, filled with the dirty markup
     */
    var _initDocument = function _initDocument(dirty) {
      /* Create a HTML document */
      var doc = void 0;
      var leadingWhitespace = void 0;

      if (FORCE_BODY) {
        dirty = '<remove></remove>' + dirty;
      } else {
        /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
        var matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }

      var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      /* Use the DOMParser API by default, fallback later if needs be */
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, 'text/html');
      } catch (_) {}

      /* Use createHTMLDocument in case DOMParser is not available */
      if (!doc || !doc.documentElement) {
        doc = implementation.createHTMLDocument('');
        var _doc = doc,
            body = _doc.body;

        body.parentNode.removeChild(body.parentNode.firstElementChild);
        body.outerHTML = dirtyPayload;
      }

      if (dirty && leadingWhitespace) {
        doc.body.insertBefore(document.createTextNode(leadingWhitespace), doc.body.childNodes[0] || null);
      }

      /* Work on whole document or just its body */
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    };

    /**
     * _createIterator
     *
     * @param  {Document} root document/fragment to create iterator for
     * @return {Iterator} iterator instance
     */
    var _createIterator = function _createIterator(root) {
      return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, function () {
        return NodeFilter.FILTER_ACCEPT;
      }, false);
    };

    /**
     * _isClobbered
     *
     * @param  {Node} elm element to check for clobbering attacks
     * @return {Boolean} true if clobbered, false if safe
     */
    var _isClobbered = function _isClobbered(elm) {
      if (elm instanceof Text || elm instanceof Comment) {
        return false;
      }

      if (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string' || typeof elm.insertBefore !== 'function') {
        return true;
      }

      return false;
    };

    /**
     * _isNode
     *
     * @param  {Node} obj object to check whether it's a DOM node
     * @return {Boolean} true is object is a DOM node
     */
    var _isNode = function _isNode(object) {
      return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? object instanceof Node : object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string';
    };

    /**
     * _executeHook
     * Execute user configurable hooks
     *
     * @param  {String} entryPoint  Name of the hook's entry point
     * @param  {Node} currentNode node to work on with the hook
     * @param  {Object} data additional hook parameters
     */
    var _executeHook = function _executeHook(entryPoint, currentNode, data) {
      if (!hooks[entryPoint]) {
        return;
      }

      arrayForEach(hooks[entryPoint], function (hook) {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    };

    /**
     * _sanitizeElements
     *
     * @protect nodeName
     * @protect textContent
     * @protect removeChild
     *
     * @param   {Node} currentNode to check for permission to exist
     * @return  {Boolean} true if node was killed, false if left alive
     */
    var _sanitizeElements = function _sanitizeElements(currentNode) {
      var content = void 0;

      /* Execute a hook if present */
      _executeHook('beforeSanitizeElements', currentNode, null);

      /* Check if element is clobbered or can clobber */
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Check if tagname contains Unicode */
      if (stringMatch(currentNode.nodeName, /[\u0080-\uFFFF]/)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Now let's check the element's type and name */
      var tagName = stringToLowerCase(currentNode.nodeName);

      /* Execute a hook if present */
      _executeHook('uponSanitizeElement', currentNode, {
        tagName: tagName,
        allowedTags: ALLOWED_TAGS
      });

      /* Detect mXSS attempts abusing namespace confusion */
      if (!_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Remove element if anything forbids its presence */
      if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
        /* Keep content except for bad-listed elements */
        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
          var parentNode = getParentNode(currentNode);
          var childNodes = getChildNodes(currentNode);

          if (childNodes && parentNode) {
            var childCount = childNodes.length;

            for (var i = childCount - 1; i >= 0; --i) {
              parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
            }
          }
        }

        _forceRemove(currentNode);
        return true;
      }

      /* Check whether element has a valid namespace */
      if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }

      if ((tagName === 'noscript' || tagName === 'noembed') && regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Sanitize element content to be template-safe */
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
        /* Get the element's text content */
        content = currentNode.textContent;
        content = stringReplace(content, MUSTACHE_EXPR$$1, ' ');
        content = stringReplace(content, ERB_EXPR$$1, ' ');
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
          currentNode.textContent = content;
        }
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeElements', currentNode, null);

      return false;
    };

    /**
     * _isValidAttribute
     *
     * @param  {string} lcTag Lowercase tag name of containing element.
     * @param  {string} lcName Lowercase attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid, otherwise false.
     */
    // eslint-disable-next-line complexity
    var _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
      /* Make sure attribute cannot clobber */
      if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
        return false;
      }

      /* Allow valid data-* attributes: At least one character after "-"
          (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
          XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
          We don't need to check the value; it's always URI safe. */
      if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$$1, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$$1, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        return false;

        /* Check value is safe. First, is attr inert? If so, is safe */
      } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if (!value) ; else {
        return false;
      }

      return true;
    };

    /**
     * _sanitizeAttributes
     *
     * @protect attributes
     * @protect nodeName
     * @protect removeAttribute
     * @protect setAttribute
     *
     * @param  {Node} currentNode to sanitize
     */
    var _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
      var attr = void 0;
      var value = void 0;
      var lcName = void 0;
      var l = void 0;
      /* Execute a hook if present */
      _executeHook('beforeSanitizeAttributes', currentNode, null);

      var attributes = currentNode.attributes;

      /* Check if we have attributes; if not we might have a text node */

      if (!attributes) {
        return;
      }

      var hookEvent = {
        attrName: '',
        attrValue: '',
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR
      };
      l = attributes.length;

      /* Go backwards over all attributes; safely remove bad ones */
      while (l--) {
        attr = attributes[l];
        var _attr = attr,
            name = _attr.name,
            namespaceURI = _attr.namespaceURI;

        value = stringTrim(attr.value);
        lcName = stringToLowerCase(name);

        /* Execute a hook if present */
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
        _executeHook('uponSanitizeAttribute', currentNode, hookEvent);
        value = hookEvent.attrValue;
        /* Did the hooks approve of the attribute? */
        if (hookEvent.forceKeepAttr) {
          continue;
        }

        /* Remove attribute */
        _removeAttribute(name, currentNode);

        /* Did the hooks approve of the attribute? */
        if (!hookEvent.keepAttr) {
          continue;
        }

        /* Work around a security issue in jQuery 3.0 */
        if (regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }

        /* Sanitize attribute content to be template-safe */
        if (SAFE_FOR_TEMPLATES) {
          value = stringReplace(value, MUSTACHE_EXPR$$1, ' ');
          value = stringReplace(value, ERB_EXPR$$1, ' ');
        }

        /* Is `value` valid for this attribute? */
        var lcTag = currentNode.nodeName.toLowerCase();
        if (!_isValidAttribute(lcTag, lcName, value)) {
          continue;
        }

        /* Handle invalid data-* attribute set by try-catching it */
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }

          arrayPop(DOMPurify.removed);
        } catch (_) {}
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeAttributes', currentNode, null);
    };

    /**
     * _sanitizeShadowDOM
     *
     * @param  {DocumentFragment} fragment to iterate over recursively
     */
    var _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
      var shadowNode = void 0;
      var shadowIterator = _createIterator(fragment);

      /* Execute a hook if present */
      _executeHook('beforeSanitizeShadowDOM', fragment, null);

      while (shadowNode = shadowIterator.nextNode()) {
        /* Execute a hook if present */
        _executeHook('uponSanitizeShadowNode', shadowNode, null);

        /* Sanitize tags and elements */
        if (_sanitizeElements(shadowNode)) {
          continue;
        }

        /* Deep shadow DOM detected */
        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(shadowNode.content);
        }

        /* Check attributes, sanitize if necessary */
        _sanitizeAttributes(shadowNode);
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeShadowDOM', fragment, null);
    };

    /**
     * Sanitize
     * Public method providing core sanitation functionality
     *
     * @param {String|Node} dirty string or DOM node
     * @param {Object} configuration object
     */
    // eslint-disable-next-line complexity
    DOMPurify.sanitize = function (dirty, cfg) {
      var body = void 0;
      var importedNode = void 0;
      var currentNode = void 0;
      var oldNode = void 0;
      var returnNode = void 0;
      /* Make sure we have a string to sanitize.
        DO NOT return early, as this will return the wrong type if
        the user has requested a DOM object rather than a string */
      if (!dirty) {
        dirty = '<!-->';
      }

      /* Stringify, in case dirty is an object */
      if (typeof dirty !== 'string' && !_isNode(dirty)) {
        // eslint-disable-next-line no-negated-condition
        if (typeof dirty.toString !== 'function') {
          throw typeErrorCreate('toString is not a function');
        } else {
          dirty = dirty.toString();
          if (typeof dirty !== 'string') {
            throw typeErrorCreate('dirty is not a string, aborting');
          }
        }
      }

      /* Check we can run. Otherwise fall back or ignore */
      if (!DOMPurify.isSupported) {
        if (_typeof(window.toStaticHTML) === 'object' || typeof window.toStaticHTML === 'function') {
          if (typeof dirty === 'string') {
            return window.toStaticHTML(dirty);
          }

          if (_isNode(dirty)) {
            return window.toStaticHTML(dirty.outerHTML);
          }
        }

        return dirty;
      }

      /* Assign config vars */
      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }

      /* Clean up removed elements */
      DOMPurify.removed = [];

      /* Check if dirty is correctly typed for IN_PLACE */
      if (typeof dirty === 'string') {
        IN_PLACE = false;
      }

      if (IN_PLACE) ; else if (dirty instanceof Node) {
        /* If dirty is a DOM element, append to an empty document to avoid
           elements being stripped by the parser */
        body = _initDocument('<!---->');
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
          /* Node is already a body, use as is */
          body = importedNode;
        } else if (importedNode.nodeName === 'HTML') {
          body = importedNode;
        } else {
          // eslint-disable-next-line unicorn/prefer-node-append
          body.appendChild(importedNode);
        }
      } else {
        /* Exit directly if we have nothing to do */
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
        // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf('<') === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }

        /* Initialize the document to work on */
        body = _initDocument(dirty);

        /* Check we have a DOM node from the data */
        if (!body) {
          return RETURN_DOM ? null : emptyHTML;
        }
      }

      /* Remove first element node (ours) if FORCE_BODY is set */
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }

      /* Get node iterator */
      var nodeIterator = _createIterator(IN_PLACE ? dirty : body);

      /* Now start iterating over the created document */
      while (currentNode = nodeIterator.nextNode()) {
        /* Fix IE's strange behavior with manipulated textNodes #89 */
        if (currentNode.nodeType === 3 && currentNode === oldNode) {
          continue;
        }

        /* Sanitize tags and elements */
        if (_sanitizeElements(currentNode)) {
          continue;
        }

        /* Shadow DOM detected, sanitize it */
        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }

        /* Check attributes, sanitize if necessary */
        _sanitizeAttributes(currentNode);

        oldNode = currentNode;
      }

      oldNode = null;

      /* If we sanitized `dirty` in-place, return it. */
      if (IN_PLACE) {
        return dirty;
      }

      /* Return sanitized string or DOM */
      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);

          while (body.firstChild) {
            // eslint-disable-next-line unicorn/prefer-node-append
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }

        if (RETURN_DOM_IMPORT) {
          /*
            AdoptNode() is not used because internal state is not reset
            (e.g. the past names map of a HTMLFormElement), this is safe
            in theory but we would rather not risk another attack vector.
            The state that is cloned by importNode() is explicitly defined
            by the specs.
          */
          returnNode = importNode.call(originalDocument, returnNode, true);
        }

        return returnNode;
      }

      var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;

      /* Sanitize final string template-safe */
      if (SAFE_FOR_TEMPLATES) {
        serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$$1, ' ');
        serializedHTML = stringReplace(serializedHTML, ERB_EXPR$$1, ' ');
      }

      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };

    /**
     * Public method to set the configuration once
     * setConfig
     *
     * @param {Object} cfg configuration object
     */
    DOMPurify.setConfig = function (cfg) {
      _parseConfig(cfg);
      SET_CONFIG = true;
    };

    /**
     * Public method to remove the configuration
     * clearConfig
     *
     */
    DOMPurify.clearConfig = function () {
      CONFIG = null;
      SET_CONFIG = false;
    };

    /**
     * Public method to check if an attribute value is valid.
     * Uses last set config, if any. Otherwise, uses config defaults.
     * isValidAttribute
     *
     * @param  {string} tag Tag name of containing element.
     * @param  {string} attr Attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
     */
    DOMPurify.isValidAttribute = function (tag, attr, value) {
      /* Initialize shared config vars if necessary. */
      if (!CONFIG) {
        _parseConfig({});
      }

      var lcTag = stringToLowerCase(tag);
      var lcName = stringToLowerCase(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };

    /**
     * AddHook
     * Public method to add DOMPurify hooks
     *
     * @param {String} entryPoint entry point for the hook to add
     * @param {Function} hookFunction function to execute
     */
    DOMPurify.addHook = function (entryPoint, hookFunction) {
      if (typeof hookFunction !== 'function') {
        return;
      }

      hooks[entryPoint] = hooks[entryPoint] || [];
      arrayPush(hooks[entryPoint], hookFunction);
    };

    /**
     * RemoveHook
     * Public method to remove a DOMPurify hook at a given entryPoint
     * (pops it from the stack of hooks if more are present)
     *
     * @param {String} entryPoint entry point for the hook to remove
     */
    DOMPurify.removeHook = function (entryPoint) {
      if (hooks[entryPoint]) {
        arrayPop(hooks[entryPoint]);
      }
    };

    /**
     * RemoveHooks
     * Public method to remove all DOMPurify hooks at a given entryPoint
     *
     * @param  {String} entryPoint entry point for the hooks to remove
     */
    DOMPurify.removeHooks = function (entryPoint) {
      if (hooks[entryPoint]) {
        hooks[entryPoint] = [];
      }
    };

    /**
     * RemoveAllHooks
     * Public method to remove all DOMPurify hooks
     *
     */
    DOMPurify.removeAllHooks = function () {
      hooks = {};
    };

    return DOMPurify;
  }

  var purify = createDOMPurify();

  return purify;

}));


},{}],62:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var createEmotion = _interopDefault(require('create-emotion'));

var _createEmotion = createEmotion(),
    flush = _createEmotion.flush,
    hydrate = _createEmotion.hydrate,
    cx = _createEmotion.cx,
    merge = _createEmotion.merge,
    getRegisteredStyles = _createEmotion.getRegisteredStyles,
    injectGlobal = _createEmotion.injectGlobal,
    keyframes = _createEmotion.keyframes,
    css = _createEmotion.css,
    sheet = _createEmotion.sheet,
    cache = _createEmotion.cache;

exports.cache = cache;
exports.css = css;
exports.cx = cx;
exports.flush = flush;
exports.getRegisteredStyles = getRegisteredStyles;
exports.hydrate = hydrate;
exports.injectGlobal = injectGlobal;
exports.keyframes = keyframes;
exports.merge = merge;
exports.sheet = sheet;

},{"create-emotion":60}],63:[function(require,module,exports){
(function (process){(function (){
'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./emotion.cjs.prod.js");
} else {
  module.exports = require("./emotion.cjs.dev.js");
}

}).call(this)}).call(this,require('_process'))
},{"./emotion.cjs.dev.js":62,"./emotion.cjs.prod.js":64,"_process":68}],64:[function(require,module,exports){
"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var createEmotion = _interopDefault(require("create-emotion")), _createEmotion = createEmotion(), flush = _createEmotion.flush, hydrate = _createEmotion.hydrate, cx = _createEmotion.cx, merge = _createEmotion.merge, getRegisteredStyles = _createEmotion.getRegisteredStyles, injectGlobal = _createEmotion.injectGlobal, keyframes = _createEmotion.keyframes, css = _createEmotion.css, sheet = _createEmotion.sheet, cache = _createEmotion.cache;

exports.cache = cache, exports.css = css, exports.cx = cx, exports.flush = flush, 
exports.getRegisteredStyles = getRegisteredStyles, exports.hydrate = hydrate, exports.injectGlobal = injectGlobal, 
exports.keyframes = keyframes, exports.merge = merge, exports.sheet = sheet;

},{"create-emotion":60}],65:[function(require,module,exports){
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
(function() {
'use strict';

// Exit early if we're not running in a browser.
if (typeof window !== 'object') {
  return;
}

// Exit early if all IntersectionObserver and IntersectionObserverEntry
// features are natively supported.
if ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {

  // Minimal polyfill for Edge 15's lack of `isIntersecting`
  // See: https://github.com/w3c/IntersectionObserver/issues/211
  if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
    Object.defineProperty(window.IntersectionObserverEntry.prototype,
      'isIntersecting', {
      get: function () {
        return this.intersectionRatio > 0;
      }
    });
  }
  return;
}

/**
 * Returns the embedding frame element, if any.
 * @param {!Document} doc
 * @return {!Element}
 */
function getFrameElement(doc) {
  try {
    return doc.defaultView && doc.defaultView.frameElement || null;
  } catch (e) {
    // Ignore the error.
    return null;
  }
}

/**
 * A local reference to the root document.
 */
var document = (function(startDoc) {
  var doc = startDoc;
  var frame = getFrameElement(doc);
  while (frame) {
    doc = frame.ownerDocument;
    frame = getFrameElement(doc);
  }
  return doc;
})(window.document);

/**
 * An IntersectionObserver registry. This registry exists to hold a strong
 * reference to IntersectionObserver instances currently observing a target
 * element. Without this registry, instances without another reference may be
 * garbage collected.
 */
var registry = [];

/**
 * The signal updater for cross-origin intersection. When not null, it means
 * that the polyfill is configured to work in a cross-origin mode.
 * @type {function(DOMRect|ClientRect, DOMRect|ClientRect)}
 */
var crossOriginUpdater = null;

/**
 * The current cross-origin intersection. Only used in the cross-origin mode.
 * @type {DOMRect|ClientRect}
 */
var crossOriginRect = null;


/**
 * Creates the global IntersectionObserverEntry constructor.
 * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
 * @param {Object} entry A dictionary of instance properties.
 * @constructor
 */
function IntersectionObserverEntry(entry) {
  this.time = entry.time;
  this.target = entry.target;
  this.rootBounds = ensureDOMRect(entry.rootBounds);
  this.boundingClientRect = ensureDOMRect(entry.boundingClientRect);
  this.intersectionRect = ensureDOMRect(entry.intersectionRect || getEmptyRect());
  this.isIntersecting = !!entry.intersectionRect;

  // Calculates the intersection ratio.
  var targetRect = this.boundingClientRect;
  var targetArea = targetRect.width * targetRect.height;
  var intersectionRect = this.intersectionRect;
  var intersectionArea = intersectionRect.width * intersectionRect.height;

  // Sets intersection ratio.
  if (targetArea) {
    // Round the intersection ratio to avoid floating point math issues:
    // https://github.com/w3c/IntersectionObserver/issues/324
    this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
  } else {
    // If area is zero and is intersecting, sets to 1, otherwise to 0
    this.intersectionRatio = this.isIntersecting ? 1 : 0;
  }
}


/**
 * Creates the global IntersectionObserver constructor.
 * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
 * @param {Function} callback The function to be invoked after intersection
 *     changes have queued. The function is not invoked if the queue has
 *     been emptied by calling the `takeRecords` method.
 * @param {Object=} opt_options Optional configuration options.
 * @constructor
 */
function IntersectionObserver(callback, opt_options) {

  var options = opt_options || {};

  if (typeof callback != 'function') {
    throw new Error('callback must be a function');
  }

  if (options.root && options.root.nodeType != 1) {
    throw new Error('root must be an Element');
  }

  // Binds and throttles `this._checkForIntersections`.
  this._checkForIntersections = throttle(
      this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);

  // Private properties.
  this._callback = callback;
  this._observationTargets = [];
  this._queuedEntries = [];
  this._rootMarginValues = this._parseRootMargin(options.rootMargin);

  // Public properties.
  this.thresholds = this._initThresholds(options.threshold);
  this.root = options.root || null;
  this.rootMargin = this._rootMarginValues.map(function(margin) {
    return margin.value + margin.unit;
  }).join(' ');

  /** @private @const {!Array<!Document>} */
  this._monitoringDocuments = [];
  /** @private @const {!Array<function()>} */
  this._monitoringUnsubscribes = [];
}


/**
 * The minimum interval within which the document will be checked for
 * intersection changes.
 */
IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;


/**
 * The frequency in which the polyfill polls for intersection changes.
 * this can be updated on a per instance basis and must be set prior to
 * calling `observe` on the first target.
 */
IntersectionObserver.prototype.POLL_INTERVAL = null;

/**
 * Use a mutation observer on the root element
 * to detect intersection changes.
 */
IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;


/**
 * Sets up the polyfill in the cross-origin mode. The result is the
 * updater function that accepts two arguments: `boundingClientRect` and
 * `intersectionRect` - just as these fields would be available to the
 * parent via `IntersectionObserverEntry`. This function should be called
 * each time the iframe receives intersection information from the parent
 * window, e.g. via messaging.
 * @return {function(DOMRect|ClientRect, DOMRect|ClientRect)}
 */
IntersectionObserver._setupCrossOriginUpdater = function() {
  if (!crossOriginUpdater) {
    /**
     * @param {DOMRect|ClientRect} boundingClientRect
     * @param {DOMRect|ClientRect} intersectionRect
     */
    crossOriginUpdater = function(boundingClientRect, intersectionRect) {
      if (!boundingClientRect || !intersectionRect) {
        crossOriginRect = getEmptyRect();
      } else {
        crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect);
      }
      registry.forEach(function(observer) {
        observer._checkForIntersections();
      });
    };
  }
  return crossOriginUpdater;
};


/**
 * Resets the cross-origin mode.
 */
IntersectionObserver._resetCrossOriginUpdater = function() {
  crossOriginUpdater = null;
  crossOriginRect = null;
};


/**
 * Starts observing a target element for intersection changes based on
 * the thresholds values.
 * @param {Element} target The DOM element to observe.
 */
IntersectionObserver.prototype.observe = function(target) {
  var isTargetAlreadyObserved = this._observationTargets.some(function(item) {
    return item.element == target;
  });

  if (isTargetAlreadyObserved) {
    return;
  }

  if (!(target && target.nodeType == 1)) {
    throw new Error('target must be an Element');
  }

  this._registerInstance();
  this._observationTargets.push({element: target, entry: null});
  this._monitorIntersections(target.ownerDocument);
  this._checkForIntersections();
};


/**
 * Stops observing a target element for intersection changes.
 * @param {Element} target The DOM element to observe.
 */
IntersectionObserver.prototype.unobserve = function(target) {
  this._observationTargets =
      this._observationTargets.filter(function(item) {
        return item.element != target;
      });
  this._unmonitorIntersections(target.ownerDocument);
  if (this._observationTargets.length == 0) {
    this._unregisterInstance();
  }
};


/**
 * Stops observing all target elements for intersection changes.
 */
IntersectionObserver.prototype.disconnect = function() {
  this._observationTargets = [];
  this._unmonitorAllIntersections();
  this._unregisterInstance();
};


/**
 * Returns any queue entries that have not yet been reported to the
 * callback and clears the queue. This can be used in conjunction with the
 * callback to obtain the absolute most up-to-date intersection information.
 * @return {Array} The currently queued entries.
 */
IntersectionObserver.prototype.takeRecords = function() {
  var records = this._queuedEntries.slice();
  this._queuedEntries = [];
  return records;
};


/**
 * Accepts the threshold value from the user configuration object and
 * returns a sorted array of unique threshold values. If a value is not
 * between 0 and 1 and error is thrown.
 * @private
 * @param {Array|number=} opt_threshold An optional threshold value or
 *     a list of threshold values, defaulting to [0].
 * @return {Array} A sorted list of unique and valid threshold values.
 */
IntersectionObserver.prototype._initThresholds = function(opt_threshold) {
  var threshold = opt_threshold || [0];
  if (!Array.isArray(threshold)) threshold = [threshold];

  return threshold.sort().filter(function(t, i, a) {
    if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
      throw new Error('threshold must be a number between 0 and 1 inclusively');
    }
    return t !== a[i - 1];
  });
};


/**
 * Accepts the rootMargin value from the user configuration object
 * and returns an array of the four margin values as an object containing
 * the value and unit properties. If any of the values are not properly
 * formatted or use a unit other than px or %, and error is thrown.
 * @private
 * @param {string=} opt_rootMargin An optional rootMargin value,
 *     defaulting to '0px'.
 * @return {Array<Object>} An array of margin objects with the keys
 *     value and unit.
 */
IntersectionObserver.prototype._parseRootMargin = function(opt_rootMargin) {
  var marginString = opt_rootMargin || '0px';
  var margins = marginString.split(/\s+/).map(function(margin) {
    var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
    if (!parts) {
      throw new Error('rootMargin must be specified in pixels or percent');
    }
    return {value: parseFloat(parts[1]), unit: parts[2]};
  });

  // Handles shorthand.
  margins[1] = margins[1] || margins[0];
  margins[2] = margins[2] || margins[0];
  margins[3] = margins[3] || margins[1];

  return margins;
};


/**
 * Starts polling for intersection changes if the polling is not already
 * happening, and if the page's visibility state is visible.
 * @param {!Document} doc
 * @private
 */
IntersectionObserver.prototype._monitorIntersections = function(doc) {
  var win = doc.defaultView;
  if (!win) {
    // Already destroyed.
    return;
  }
  if (this._monitoringDocuments.indexOf(doc) != -1) {
    // Already monitoring.
    return;
  }

  // Private state for monitoring.
  var callback = this._checkForIntersections;
  var monitoringInterval = null;
  var domObserver = null;

  // If a poll interval is set, use polling instead of listening to
  // resize and scroll events or DOM mutations.
  if (this.POLL_INTERVAL) {
    monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL);
  } else {
    addEvent(win, 'resize', callback, true);
    addEvent(doc, 'scroll', callback, true);
    if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in win) {
      domObserver = new win.MutationObserver(callback);
      domObserver.observe(doc, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  this._monitoringDocuments.push(doc);
  this._monitoringUnsubscribes.push(function() {
    // Get the window object again. When a friendly iframe is destroyed, it
    // will be null.
    var win = doc.defaultView;

    if (win) {
      if (monitoringInterval) {
        win.clearInterval(monitoringInterval);
      }
      removeEvent(win, 'resize', callback, true);
    }

    removeEvent(doc, 'scroll', callback, true);
    if (domObserver) {
      domObserver.disconnect();
    }
  });

  // Also monitor the parent.
  if (doc != (this.root && this.root.ownerDocument || document)) {
    var frame = getFrameElement(doc);
    if (frame) {
      this._monitorIntersections(frame.ownerDocument);
    }
  }
};


/**
 * Stops polling for intersection changes.
 * @param {!Document} doc
 * @private
 */
IntersectionObserver.prototype._unmonitorIntersections = function(doc) {
  var index = this._monitoringDocuments.indexOf(doc);
  if (index == -1) {
    return;
  }

  var rootDoc = (this.root && this.root.ownerDocument || document);

  // Check if any dependent targets are still remaining.
  var hasDependentTargets =
      this._observationTargets.some(function(item) {
        var itemDoc = item.element.ownerDocument;
        // Target is in this context.
        if (itemDoc == doc) {
          return true;
        }
        // Target is nested in this context.
        while (itemDoc && itemDoc != rootDoc) {
          var frame = getFrameElement(itemDoc);
          itemDoc = frame && frame.ownerDocument;
          if (itemDoc == doc) {
            return true;
          }
        }
        return false;
      });
  if (hasDependentTargets) {
    return;
  }

  // Unsubscribe.
  var unsubscribe = this._monitoringUnsubscribes[index];
  this._monitoringDocuments.splice(index, 1);
  this._monitoringUnsubscribes.splice(index, 1);
  unsubscribe();

  // Also unmonitor the parent.
  if (doc != rootDoc) {
    var frame = getFrameElement(doc);
    if (frame) {
      this._unmonitorIntersections(frame.ownerDocument);
    }
  }
};


/**
 * Stops polling for intersection changes.
 * @param {!Document} doc
 * @private
 */
IntersectionObserver.prototype._unmonitorAllIntersections = function() {
  var unsubscribes = this._monitoringUnsubscribes.slice(0);
  this._monitoringDocuments.length = 0;
  this._monitoringUnsubscribes.length = 0;
  for (var i = 0; i < unsubscribes.length; i++) {
    unsubscribes[i]();
  }
};


/**
 * Scans each observation target for intersection changes and adds them
 * to the internal entries queue. If new entries are found, it
 * schedules the callback to be invoked.
 * @private
 */
IntersectionObserver.prototype._checkForIntersections = function() {
  if (!this.root && crossOriginUpdater && !crossOriginRect) {
    // Cross origin monitoring, but no initial data available yet.
    return;
  }

  var rootIsInDom = this._rootIsInDom();
  var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

  this._observationTargets.forEach(function(item) {
    var target = item.element;
    var targetRect = getBoundingClientRect(target);
    var rootContainsTarget = this._rootContainsTarget(target);
    var oldEntry = item.entry;
    var intersectionRect = rootIsInDom && rootContainsTarget &&
        this._computeTargetAndRootIntersection(target, targetRect, rootRect);

    var newEntry = item.entry = new IntersectionObserverEntry({
      time: now(),
      target: target,
      boundingClientRect: targetRect,
      rootBounds: crossOriginUpdater && !this.root ? null : rootRect,
      intersectionRect: intersectionRect
    });

    if (!oldEntry) {
      this._queuedEntries.push(newEntry);
    } else if (rootIsInDom && rootContainsTarget) {
      // If the new entry intersection ratio has crossed any of the
      // thresholds, add a new entry.
      if (this._hasCrossedThreshold(oldEntry, newEntry)) {
        this._queuedEntries.push(newEntry);
      }
    } else {
      // If the root is not in the DOM or target is not contained within
      // root but the previous entry for this target had an intersection,
      // add a new record indicating removal.
      if (oldEntry && oldEntry.isIntersecting) {
        this._queuedEntries.push(newEntry);
      }
    }
  }, this);

  if (this._queuedEntries.length) {
    this._callback(this.takeRecords(), this);
  }
};


/**
 * Accepts a target and root rect computes the intersection between then
 * following the algorithm in the spec.
 * TODO(philipwalton): at this time clip-path is not considered.
 * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
 * @param {Element} target The target DOM element
 * @param {Object} targetRect The bounding rect of the target.
 * @param {Object} rootRect The bounding rect of the root after being
 *     expanded by the rootMargin value.
 * @return {?Object} The final intersection rect object or undefined if no
 *     intersection is found.
 * @private
 */
IntersectionObserver.prototype._computeTargetAndRootIntersection =
    function(target, targetRect, rootRect) {
  // If the element isn't displayed, an intersection can't happen.
  if (window.getComputedStyle(target).display == 'none') return;

  var intersectionRect = targetRect;
  var parent = getParentNode(target);
  var atRoot = false;

  while (!atRoot && parent) {
    var parentRect = null;
    var parentComputedStyle = parent.nodeType == 1 ?
        window.getComputedStyle(parent) : {};

    // If the parent isn't displayed, an intersection can't happen.
    if (parentComputedStyle.display == 'none') return null;

    if (parent == this.root || parent.nodeType == /* DOCUMENT */ 9) {
      atRoot = true;
      if (parent == this.root || parent == document) {
        if (crossOriginUpdater && !this.root) {
          if (!crossOriginRect ||
              crossOriginRect.width == 0 && crossOriginRect.height == 0) {
            // A 0-size cross-origin intersection means no-intersection.
            parent = null;
            parentRect = null;
            intersectionRect = null;
          } else {
            parentRect = crossOriginRect;
          }
        } else {
          parentRect = rootRect;
        }
      } else {
        // Check if there's a frame that can be navigated to.
        var frame = getParentNode(parent);
        var frameRect = frame && getBoundingClientRect(frame);
        var frameIntersect =
            frame &&
            this._computeTargetAndRootIntersection(frame, frameRect, rootRect);
        if (frameRect && frameIntersect) {
          parent = frame;
          parentRect = convertFromParentRect(frameRect, frameIntersect);
        } else {
          parent = null;
          intersectionRect = null;
        }
      }
    } else {
      // If the element has a non-visible overflow, and it's not the <body>
      // or <html> element, update the intersection rect.
      // Note: <body> and <html> cannot be clipped to a rect that's not also
      // the document rect, so no need to compute a new intersection.
      var doc = parent.ownerDocument;
      if (parent != doc.body &&
          parent != doc.documentElement &&
          parentComputedStyle.overflow != 'visible') {
        parentRect = getBoundingClientRect(parent);
      }
    }

    // If either of the above conditionals set a new parentRect,
    // calculate new intersection data.
    if (parentRect) {
      intersectionRect = computeRectIntersection(parentRect, intersectionRect);
    }
    if (!intersectionRect) break;
    parent = parent && getParentNode(parent);
  }
  return intersectionRect;
};


/**
 * Returns the root rect after being expanded by the rootMargin value.
 * @return {ClientRect} The expanded root rect.
 * @private
 */
IntersectionObserver.prototype._getRootRect = function() {
  var rootRect;
  if (this.root) {
    rootRect = getBoundingClientRect(this.root);
  } else {
    // Use <html>/<body> instead of window since scroll bars affect size.
    var html = document.documentElement;
    var body = document.body;
    rootRect = {
      top: 0,
      left: 0,
      right: html.clientWidth || body.clientWidth,
      width: html.clientWidth || body.clientWidth,
      bottom: html.clientHeight || body.clientHeight,
      height: html.clientHeight || body.clientHeight
    };
  }
  return this._expandRectByRootMargin(rootRect);
};


/**
 * Accepts a rect and expands it by the rootMargin value.
 * @param {DOMRect|ClientRect} rect The rect object to expand.
 * @return {ClientRect} The expanded rect.
 * @private
 */
IntersectionObserver.prototype._expandRectByRootMargin = function(rect) {
  var margins = this._rootMarginValues.map(function(margin, i) {
    return margin.unit == 'px' ? margin.value :
        margin.value * (i % 2 ? rect.width : rect.height) / 100;
  });
  var newRect = {
    top: rect.top - margins[0],
    right: rect.right + margins[1],
    bottom: rect.bottom + margins[2],
    left: rect.left - margins[3]
  };
  newRect.width = newRect.right - newRect.left;
  newRect.height = newRect.bottom - newRect.top;

  return newRect;
};


/**
 * Accepts an old and new entry and returns true if at least one of the
 * threshold values has been crossed.
 * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
 *    particular target element or null if no previous entry exists.
 * @param {IntersectionObserverEntry} newEntry The current entry for a
 *    particular target element.
 * @return {boolean} Returns true if a any threshold has been crossed.
 * @private
 */
IntersectionObserver.prototype._hasCrossedThreshold =
    function(oldEntry, newEntry) {

  // To make comparing easier, an entry that has a ratio of 0
  // but does not actually intersect is given a value of -1
  var oldRatio = oldEntry && oldEntry.isIntersecting ?
      oldEntry.intersectionRatio || 0 : -1;
  var newRatio = newEntry.isIntersecting ?
      newEntry.intersectionRatio || 0 : -1;

  // Ignore unchanged ratios
  if (oldRatio === newRatio) return;

  for (var i = 0; i < this.thresholds.length; i++) {
    var threshold = this.thresholds[i];

    // Return true if an entry matches a threshold or if the new ratio
    // and the old ratio are on the opposite sides of a threshold.
    if (threshold == oldRatio || threshold == newRatio ||
        threshold < oldRatio !== threshold < newRatio) {
      return true;
    }
  }
};


/**
 * Returns whether or not the root element is an element and is in the DOM.
 * @return {boolean} True if the root element is an element and is in the DOM.
 * @private
 */
IntersectionObserver.prototype._rootIsInDom = function() {
  return !this.root || containsDeep(document, this.root);
};


/**
 * Returns whether or not the target element is a child of root.
 * @param {Element} target The target element to check.
 * @return {boolean} True if the target element is a child of root.
 * @private
 */
IntersectionObserver.prototype._rootContainsTarget = function(target) {
  return containsDeep(this.root || document, target) &&
    (!this.root || this.root.ownerDocument == target.ownerDocument);
};


/**
 * Adds the instance to the global IntersectionObserver registry if it isn't
 * already present.
 * @private
 */
IntersectionObserver.prototype._registerInstance = function() {
  if (registry.indexOf(this) < 0) {
    registry.push(this);
  }
};


/**
 * Removes the instance from the global IntersectionObserver registry.
 * @private
 */
IntersectionObserver.prototype._unregisterInstance = function() {
  var index = registry.indexOf(this);
  if (index != -1) registry.splice(index, 1);
};


/**
 * Returns the result of the performance.now() method or null in browsers
 * that don't support the API.
 * @return {number} The elapsed time since the page was requested.
 */
function now() {
  return window.performance && performance.now && performance.now();
}


/**
 * Throttles a function and delays its execution, so it's only called at most
 * once within a given time period.
 * @param {Function} fn The function to throttle.
 * @param {number} timeout The amount of time that must pass before the
 *     function can be called again.
 * @return {Function} The throttled function.
 */
function throttle(fn, timeout) {
  var timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(function() {
        fn();
        timer = null;
      }, timeout);
    }
  };
}


/**
 * Adds an event handler to a DOM node ensuring cross-browser compatibility.
 * @param {Node} node The DOM node to add the event handler to.
 * @param {string} event The event name.
 * @param {Function} fn The event handler to add.
 * @param {boolean} opt_useCapture Optionally adds the even to the capture
 *     phase. Note: this only works in modern browsers.
 */
function addEvent(node, event, fn, opt_useCapture) {
  if (typeof node.addEventListener == 'function') {
    node.addEventListener(event, fn, opt_useCapture || false);
  }
  else if (typeof node.attachEvent == 'function') {
    node.attachEvent('on' + event, fn);
  }
}


/**
 * Removes a previously added event handler from a DOM node.
 * @param {Node} node The DOM node to remove the event handler from.
 * @param {string} event The event name.
 * @param {Function} fn The event handler to remove.
 * @param {boolean} opt_useCapture If the event handler was added with this
 *     flag set to true, it should be set to true here in order to remove it.
 */
function removeEvent(node, event, fn, opt_useCapture) {
  if (typeof node.removeEventListener == 'function') {
    node.removeEventListener(event, fn, opt_useCapture || false);
  }
  else if (typeof node.detatchEvent == 'function') {
    node.detatchEvent('on' + event, fn);
  }
}


/**
 * Returns the intersection between two rect objects.
 * @param {Object} rect1 The first rect.
 * @param {Object} rect2 The second rect.
 * @return {?Object|?ClientRect} The intersection rect or undefined if no
 *     intersection is found.
 */
function computeRectIntersection(rect1, rect2) {
  var top = Math.max(rect1.top, rect2.top);
  var bottom = Math.min(rect1.bottom, rect2.bottom);
  var left = Math.max(rect1.left, rect2.left);
  var right = Math.min(rect1.right, rect2.right);
  var width = right - left;
  var height = bottom - top;

  return (width >= 0 && height >= 0) && {
    top: top,
    bottom: bottom,
    left: left,
    right: right,
    width: width,
    height: height
  } || null;
}


/**
 * Shims the native getBoundingClientRect for compatibility with older IE.
 * @param {Element} el The element whose bounding rect to get.
 * @return {DOMRect|ClientRect} The (possibly shimmed) rect of the element.
 */
function getBoundingClientRect(el) {
  var rect;

  try {
    rect = el.getBoundingClientRect();
  } catch (err) {
    // Ignore Windows 7 IE11 "Unspecified error"
    // https://github.com/w3c/IntersectionObserver/pull/205
  }

  if (!rect) return getEmptyRect();

  // Older IE
  if (!(rect.width && rect.height)) {
    rect = {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    };
  }
  return rect;
}


/**
 * Returns an empty rect object. An empty rect is returned when an element
 * is not in the DOM.
 * @return {ClientRect} The empty rect.
 */
function getEmptyRect() {
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0
  };
}


/**
 * Ensure that the result has all of the necessary fields of the DOMRect.
 * Specifically this ensures that `x` and `y` fields are set.
 *
 * @param {?DOMRect|?ClientRect} rect
 * @return {?DOMRect}
 */
function ensureDOMRect(rect) {
  // A `DOMRect` object has `x` and `y` fields.
  if (!rect || 'x' in rect) {
    return rect;
  }
  // A IE's `ClientRect` type does not have `x` and `y`. The same is the case
  // for internally calculated Rect objects. For the purposes of
  // `IntersectionObserver`, it's sufficient to simply mirror `left` and `top`
  // for these fields.
  return {
    top: rect.top,
    y: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    x: rect.left,
    right: rect.right,
    width: rect.width,
    height: rect.height
  };
}


/**
 * Inverts the intersection and bounding rect from the parent (frame) BCR to
 * the local BCR space.
 * @param {DOMRect|ClientRect} parentBoundingRect The parent's bound client rect.
 * @param {DOMRect|ClientRect} parentIntersectionRect The parent's own intersection rect.
 * @return {ClientRect} The local root bounding rect for the parent's children.
 */
function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
  var top = parentIntersectionRect.top - parentBoundingRect.top;
  var left = parentIntersectionRect.left - parentBoundingRect.left;
  return {
    top: top,
    left: left,
    height: parentIntersectionRect.height,
    width: parentIntersectionRect.width,
    bottom: top + parentIntersectionRect.height,
    right: left + parentIntersectionRect.width
  };
}


/**
 * Checks to see if a parent element contains a child element (including inside
 * shadow DOM).
 * @param {Node} parent The parent element.
 * @param {Node} child The child element.
 * @return {boolean} True if the parent node contains the child node.
 */
function containsDeep(parent, child) {
  var node = child;
  while (node) {
    if (node == parent) return true;

    node = getParentNode(node);
  }
  return false;
}


/**
 * Gets the parent node of an element or its host element if the parent node
 * is a shadow root.
 * @param {Node} node The node whose parent to get.
 * @return {Node|null} The parent node or null if no parent exists.
 */
function getParentNode(node) {
  var parent = node.parentNode;

  if (node.nodeType == /* DOCUMENT */ 9 && node != document) {
    // If this node is a document node, look for the embedding frame.
    return getFrameElement(node);
  }

  if (parent && parent.nodeType == 11 && parent.host) {
    // If the parent is a shadow root, return the host element.
    return parent.host;
  }

  if (parent && parent.assignedSlot) {
    // If the parent is distributed in a <slot>, return the parent of a slot.
    return parent.assignedSlot.parentNode;
  }

  return parent;
}


// Exposes the constructors globally.
window.IntersectionObserver = IntersectionObserver;
window.IntersectionObserverEntry = IntersectionObserverEntry;

}());

},{}],66:[function(require,module,exports){
var n,l,u,t,i,o,r,f={},e=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function a(n){var l=n.parentNode;l&&l.removeChild(n)}function p(n,l,u){var t,i,o,r=arguments,f={};for(o in l)"key"==o?t=l[o]:"ref"==o?i=l[o]:f[o]=l[o];if(arguments.length>3)for(u=[u],o=3;o<arguments.length;o++)u.push(r[o]);if(null!=u&&(f.children=u),"function"==typeof n&&null!=n.defaultProps)for(o in n.defaultProps)void 0===f[o]&&(f[o]=n.defaultProps[o]);return v(n,f,t,i,null)}function v(l,u,t,i,o){var r={type:l,props:u,key:t,ref:i,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o};return null==o&&(r.__v=r),null!=n.vnode&&n.vnode(r),r}function h(n){return n.children}function y(n,l){this.props=n,this.context=l}function d(n,l){if(null==l)return n.__?d(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?d(n):null}function _(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return _(n)}}function w(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!x.__r++||i!==n.debounceRendering)&&((i=n.debounceRendering)||t)(x)}function x(){for(var n;x.__r=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,t,i,o,r,f;n.__d&&(r=(o=(l=n).__v).__e,(f=l.__P)&&(u=[],(t=s({},o)).__v=t,i=z(f,o,t,l.__n,void 0!==f.ownerSVGElement,null,u,null==r?d(o):r),N(u,o),i!=r&&_(o)))})}function k(n,l,u,t,i,o,r,c,s,p){var y,_,w,x,k,g,b,A=t&&t.__k||e,P=A.length;for(s==f&&(s=null!=r?r[0]:P?d(t,0):null),u.__k=[],y=0;y<l.length;y++)if(null!=(x=u.__k[y]=null==(x=l[y])||"boolean"==typeof x?null:"string"==typeof x||"number"==typeof x?v(null,x,null,null,x):Array.isArray(x)?v(h,{children:x},null,null,null):null!=x.__e||null!=x.__c?v(x.type,x.props,x.key,null,x.__v):x)){if(x.__=u,x.__b=u.__b+1,null===(w=A[y])||w&&x.key==w.key&&x.type===w.type)A[y]=void 0;else for(_=0;_<P;_++){if((w=A[_])&&x.key==w.key&&x.type===w.type){A[_]=void 0;break}w=null}k=z(n,x,w=w||f,i,o,r,c,s,p),(_=x.ref)&&w.ref!=_&&(b||(b=[]),w.ref&&b.push(w.ref,null,x),b.push(_,x.__c||k,x)),null!=k?(null==g&&(g=k),s=m(n,x,w,A,r,k,s),p||"option"!=u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&w.__e==s&&s.parentNode!=n&&(s=d(w))}if(u.__e=g,null!=r&&"function"!=typeof u.type)for(y=r.length;y--;)null!=r[y]&&a(r[y]);for(y=P;y--;)null!=A[y]&&j(A[y],A[y]);if(b)for(y=0;y<b.length;y++)$(b[y],b[++y],b[++y])}function m(n,l,u,t,i,o,r){var f,e,c;if(void 0!==l.__d)f=l.__d,l.__d=void 0;else if(i==u||o!=r||null==o.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(o),f=null;else{for(e=r,c=0;(e=e.nextSibling)&&c<t.length;c+=2)if(e==o)break n;n.insertBefore(o,r),f=r}return void 0!==f?f:o.nextSibling}function g(n,l,u,t,i){var o;for(o in u)"children"===o||"key"===o||o in l||A(n,o,null,u[o],t);for(o in l)i&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||A(n,o,l[o],u[o],t)}function b(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||c.test(l)?u:u+"px"}function A(n,l,u,t,i){var o,r;if(i&&"className"==l&&(l="class"),"style"===l)if("string"==typeof u)n.style=u;else{if("string"==typeof t&&(n.style=t=""),t)for(l in t)u&&l in u||b(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||b(n.style,l,u[l])}else"o"===l[0]&&"n"===l[1]?(o=l!==(l=l.replace(/Capture$/,"")),(r=l.toLowerCase())in n&&(l=r),l=l.slice(2),n.l||(n.l={}),n.l[l]=u,u?t||n.addEventListener(l,P,o):n.removeEventListener(l,P,o)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&"download"!==l&&"href"!==l&&!i&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u))}function P(l){this.l[l.type](n.event?n.event(l):l)}function C(n,l,u){var t,i;for(t=0;t<n.__k.length;t++)(i=n.__k[t])&&(i.__=n,i.__e&&("function"==typeof i.type&&i.__k.length>1&&C(i,l,u),l=m(u,i,i,n.__k,null,i.__e,l),"function"==typeof n.type&&(n.__d=l)))}function z(l,u,t,i,o,r,f,e,c){var a,p,v,d,_,w,x,m,g,b,A,P=u.type;if(void 0!==u.constructor)return null;(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(m=u.props,g=(a=P.contextType)&&i[a.__c],b=a?g?g.props.value:a.__:i,t.__c?x=(p=u.__c=t.__c).__=p.__E:("prototype"in P&&P.prototype.render?u.__c=p=new P(m,b):(u.__c=p=new y(m,b),p.constructor=P,p.render=H),g&&g.sub(p),p.props=m,p.state||(p.state={}),p.context=b,p.__n=i,v=p.__d=!0,p.__h=[]),null==p.__s&&(p.__s=p.state),null!=P.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=s({},p.__s)),s(p.__s,P.getDerivedStateFromProps(m,p.__s))),d=p.props,_=p.state,v)null==P.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==P.getDerivedStateFromProps&&m!==d&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(m,b),!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(m,p.__s,b)||u.__v===t.__v){p.props=m,p.state=p.__s,u.__v!==t.__v&&(p.__d=!1),p.__v=u,u.__e=t.__e,u.__k=t.__k,p.__h.length&&f.push(p),C(u,e,l);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(m,p.__s,b),null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(d,_,w)})}p.context=b,p.props=m,p.state=p.__s,(a=n.__r)&&a(u),p.__d=!1,p.__v=u,p.__P=l,a=p.render(p.props,p.state,p.context),p.state=p.__s,null!=p.getChildContext&&(i=s(s({},i),p.getChildContext())),v||null==p.getSnapshotBeforeUpdate||(w=p.getSnapshotBeforeUpdate(d,_)),A=null!=a&&a.type==h&&null==a.key?a.props.children:a,k(l,Array.isArray(A)?A:[A],u,t,i,o,r,f,e,c),p.base=u.__e,p.__h.length&&f.push(p),x&&(p.__E=p.__=null),p.__e=!1}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=T(t.__e,u,t,i,o,r,f,c);(a=n.diffed)&&a(u)}catch(l){u.__v=null,n.__e(l,u,t)}return u.__e}function N(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u)})}catch(l){n.__e(l,u.__v)}})}function T(n,l,u,t,i,o,r,c){var s,a,p,v,h,y=u.props,d=l.props;if(i="svg"===l.type||i,null!=o)for(s=0;s<o.length;s++)if(null!=(a=o[s])&&((null===l.type?3===a.nodeType:a.localName===l.type)||n==a)){n=a,o[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=i?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,d.is&&{is:d.is}),o=null,c=!1}if(null===l.type)y!==d&&n.data!==d&&(n.data=d);else{if(null!=o&&(o=e.slice.call(n.childNodes)),p=(y=u.props||f).dangerouslySetInnerHTML,v=d.dangerouslySetInnerHTML,!c){if(null!=o)for(y={},h=0;h<n.attributes.length;h++)y[n.attributes[h].name]=n.attributes[h].value;(v||p)&&(v&&p&&v.__html==p.__html||(n.innerHTML=v&&v.__html||""))}g(n,d,y,i,c),v?l.__k=[]:(s=l.props.children,k(n,Array.isArray(s)?s:[s],l,u,t,"foreignObject"!==l.type&&i,o,r,f,c)),c||("value"in d&&void 0!==(s=d.value)&&s!==n.value&&A(n,"value",s,y.value,!1),"checked"in d&&void 0!==(s=d.checked)&&s!==n.checked&&A(n,"checked",s,y.checked,!1))}return n}function $(l,u,t){try{"function"==typeof l?l(u):l.current=u}catch(l){n.__e(l,t)}}function j(l,u,t){var i,o,r;if(n.unmount&&n.unmount(l),(i=l.ref)&&(i.current&&i.current!==l.__e||$(i,null,u)),t||"function"==typeof l.type||(t=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(i=l.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(l){n.__e(l,u)}i.base=i.__P=null}if(i=l.__k)for(r=0;r<i.length;r++)i[r]&&j(i[r],u,t);null!=o&&a(o)}function H(n,l,u){return this.constructor(n,u)}function I(l,u,t){var i,r,c;n.__&&n.__(l,u),r=(i=t===o)?null:t&&t.__k||u.__k,l=p(h,null,[l]),c=[],z(u,(i?u:t||u).__k=l,r||f,f,void 0!==u.ownerSVGElement,t&&!i?[t]:r?null:u.childNodes.length?e.slice.call(u.childNodes):null,c,t||f,i),N(c,l)}n={__e:function(n,l){for(var u,t;l=l.__;)if((u=l.__c)&&!u.__)try{if(u.constructor&&null!=u.constructor.getDerivedStateFromError&&(t=!0,u.setState(u.constructor.getDerivedStateFromError(n))),null!=u.componentDidCatch&&(t=!0,u.componentDidCatch(n)),t)return w(u.__E=u)}catch(l){n=l}throw n}},l=function(n){return null!=n&&void 0===n.constructor},y.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=s({},this.state),"function"==typeof n&&(n=n(s({},u),this.props)),n&&s(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),w(this))},y.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),w(this))},y.prototype.render=h,u=[],t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,x.__r=0,o=f,r=0,exports.render=I,exports.hydrate=function(n,l){I(n,l,o)},exports.createElement=p,exports.h=p,exports.Fragment=h,exports.createRef=function(){return{current:null}},exports.isValidElement=l,exports.Component=y,exports.cloneElement=function(n,l,u){var t,i,o,r=arguments,f=s({},n.props);for(o in l)"key"==o?t=l[o]:"ref"==o?i=l[o]:f[o]=l[o];if(arguments.length>3)for(u=[u],o=3;o<arguments.length;o++)u.push(r[o]);return null!=u&&(f.children=u),v(n.type,f,t||n.key,i||n.ref,null)},exports.createContext=function(n,l){var u={__c:l="__cC"+r++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n,u,t){return this.getChildContext||(u=[],(t={})[l]=this,this.getChildContext=function(){return t},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(w)},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u},exports.toChildArray=function n(l,u){return u=u||[],null==l||"boolean"==typeof l||(Array.isArray(l)?l.some(function(l){n(l,u)}):u.push(l)),u},exports.__u=j,exports.options=n;


},{}],67:[function(require,module,exports){
var n,t,r,u=require("preact"),o=0,i=[],c=u.options.__r,e=u.options.diffed,f=u.options.__c,a=u.options.unmount;function p(n,r){u.options.__h&&u.options.__h(t,n,o||r),o=0;var i=t.__H||(t.__H={__:[],__h:[]});return n>=i.__.length&&i.__.push({}),i.__[n]}function v(n){return o=1,s(A,n)}function s(r,u,o){var i=p(n++,2);return i.t=r,i.__c||(i.__c=t,i.__=[o?o(u):A(void 0,u),function(n){var t=i.t(i.__[0],n);i.__[0]!==t&&(i.__=[t,i.__[1]],i.__c.setState({}))}]),i.__}function x(r,o){var i=p(n++,4);!u.options.__s&&q(i.__H,o)&&(i.__=r,i.__H=o,t.__h.push(i))}function m(t,r){var u=p(n++,7);return q(u.__H,r)?(u.__H=r,u.__h=t,u.__=t()):u.__}function y(){i.some(function(n){if(n.__P)try{n.__H.__h.forEach(h),n.__H.__h.forEach(_),n.__H.__h=[]}catch(t){return n.__H.__h=[],u.options.__e(t,n.__v),!0}}),i=[]}u.options.__r=function(r){c&&c(r),n=0;var u=(t=r.__c).__H;u&&(u.__h.forEach(h),u.__h.forEach(_),u.__h=[])},u.options.diffed=function(n){e&&e(n);var t=n.__c;t&&t.__H&&t.__H.__h.length&&(1!==i.push(t)&&r===u.options.requestAnimationFrame||((r=u.options.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(u),l&&cancelAnimationFrame(t),setTimeout(n)},u=setTimeout(r,100);l&&(t=requestAnimationFrame(r))})(y))},u.options.__c=function(n,t){t.some(function(n){try{n.__h.forEach(h),n.__h=n.__h.filter(function(n){return!n.__||_(n)})}catch(r){t.some(function(n){n.__h&&(n.__h=[])}),t=[],u.options.__e(r,n.__v)}}),f&&f(n,t)},u.options.unmount=function(n){a&&a(n);var t=n.__c;if(t&&t.__H)try{t.__H.__.forEach(h)}catch(n){u.options.__e(n,t.__v)}};var l="function"==typeof requestAnimationFrame;function h(n){"function"==typeof n.u&&n.u()}function _(n){n.u=n.__()}function q(n,t){return!n||t.some(function(t,r){return t!==n[r]})}function A(n,t){return"function"==typeof t?t(n):t}exports.useState=v,exports.useReducer=s,exports.useEffect=function(r,o){var i=p(n++,3);!u.options.__s&&q(i.__H,o)&&(i.__=r,i.__H=o,t.__H.__h.push(i))},exports.useLayoutEffect=x,exports.useRef=function(n){return o=5,m(function(){return{current:n}},[])},exports.useImperativeHandle=function(n,t,r){o=6,x(function(){"function"==typeof n?n(t()):n&&(n.current=t())},null==r?r:r.concat(n))},exports.useMemo=m,exports.useCallback=function(n,t){return o=8,m(function(){return n},t)},exports.useContext=function(r){var u=t.context[r.__c],o=p(n++,9);return o.__c=r,u?(null==o.__&&(o.__=!0,u.sub(t)),u.props.value):r.__},exports.useDebugValue=function(n,t){u.options.useDebugValue&&u.options.useDebugValue(t?t(n):n)},exports.useErrorBoundary=function(r){var u=p(n++,10),o=v();return u.__=r,t.componentDidCatch||(t.componentDidCatch=function(n){u.__&&u.__(n),o[1](n)}),[o[0],function(){o[1](void 0)}]};


},{"preact":66}],68:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],69:[function(require,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.throttleDebounce = {}));
}(this, (function (exports) { 'use strict';

	/* eslint-disable no-undefined,no-param-reassign,no-shadow */

	/**
	 * Throttle execution of a function. Especially useful for rate limiting
	 * execution of handlers on events like resize and scroll.
	 *
	 * @param  {number}    delay -          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
	 * @param  {boolean}   [noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
	 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
	 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
	 *                                    the internal counter is reset).
	 * @param  {Function}  callback -       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
	 *                                    to `callback` when the throttled-function is executed.
	 * @param  {boolean}   [debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
	 *                                    schedule `callback` to execute after `delay` ms.
	 *
	 * @returns {Function}  A new, throttled, function.
	 */
	function throttle (delay, noTrailing, callback, debounceMode) {
	  /*
	   * After wrapper has stopped being called, this timeout ensures that
	   * `callback` is executed at the proper times in `throttle` and `end`
	   * debounce modes.
	   */
	  var timeoutID;
	  var cancelled = false; // Keep track of the last time `callback` was executed.

	  var lastExec = 0; // Function to clear existing timeout

	  function clearExistingTimeout() {
	    if (timeoutID) {
	      clearTimeout(timeoutID);
	    }
	  } // Function to cancel next exec


	  function cancel() {
	    clearExistingTimeout();
	    cancelled = true;
	  } // `noTrailing` defaults to falsy.


	  if (typeof noTrailing !== 'boolean') {
	    debounceMode = callback;
	    callback = noTrailing;
	    noTrailing = undefined;
	  }
	  /*
	   * The `wrapper` function encapsulates all of the throttling / debouncing
	   * functionality and when executed will limit the rate at which `callback`
	   * is executed.
	   */


	  function wrapper() {
	    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
	      arguments_[_key] = arguments[_key];
	    }

	    var self = this;
	    var elapsed = Date.now() - lastExec;

	    if (cancelled) {
	      return;
	    } // Execute `callback` and update the `lastExec` timestamp.


	    function exec() {
	      lastExec = Date.now();
	      callback.apply(self, arguments_);
	    }
	    /*
	     * If `debounceMode` is true (at begin) this is used to clear the flag
	     * to allow future `callback` executions.
	     */


	    function clear() {
	      timeoutID = undefined;
	    }

	    if (debounceMode && !timeoutID) {
	      /*
	       * Since `wrapper` is being called for the first time and
	       * `debounceMode` is true (at begin), execute `callback`.
	       */
	      exec();
	    }

	    clearExistingTimeout();

	    if (debounceMode === undefined && elapsed > delay) {
	      /*
	       * In throttle mode, if `delay` time has been exceeded, execute
	       * `callback`.
	       */
	      exec();
	    } else if (noTrailing !== true) {
	      /*
	       * In trailing throttle mode, since `delay` time has not been
	       * exceeded, schedule `callback` to execute `delay` ms after most
	       * recent execution.
	       *
	       * If `debounceMode` is true (at begin), schedule `clear` to execute
	       * after `delay` ms.
	       *
	       * If `debounceMode` is false (at end), schedule `callback` to
	       * execute after `delay` ms.
	       */
	      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
	    }
	  }

	  wrapper.cancel = cancel; // Return the wrapper function.

	  return wrapper;
	}

	/* eslint-disable no-undefined */
	/**
	 * Debounce execution of a function. Debouncing, unlike throttling,
	 * guarantees that a function is only executed a single time, either at the
	 * very beginning of a series of calls, or at the very end.
	 *
	 * @param  {number}   delay -         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
	 * @param  {boolean}  [atBegin] -     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
	 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
	 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
	 * @param  {Function} callback -      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
	 *                                  to `callback` when the debounced-function is executed.
	 *
	 * @returns {Function} A new, debounced function.
	 */

	function debounce (delay, atBegin, callback) {
	  return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
	}

	exports.debounce = debounce;
	exports.throttle = throttle;

	Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "v1", {
  enumerable: true,
  get: function () {
    return _v.default;
  }
});
Object.defineProperty(exports, "v3", {
  enumerable: true,
  get: function () {
    return _v2.default;
  }
});
Object.defineProperty(exports, "v4", {
  enumerable: true,
  get: function () {
    return _v3.default;
  }
});
Object.defineProperty(exports, "v5", {
  enumerable: true,
  get: function () {
    return _v4.default;
  }
});
Object.defineProperty(exports, "NIL", {
  enumerable: true,
  get: function () {
    return _nil.default;
  }
});
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function () {
    return _version.default;
  }
});
Object.defineProperty(exports, "validate", {
  enumerable: true,
  get: function () {
    return _validate.default;
  }
});
Object.defineProperty(exports, "stringify", {
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function () {
    return _parse.default;
  }
});

var _v = _interopRequireDefault(require("./v1.js"));

var _v2 = _interopRequireDefault(require("./v3.js"));

var _v3 = _interopRequireDefault(require("./v4.js"));

var _v4 = _interopRequireDefault(require("./v5.js"));

var _nil = _interopRequireDefault(require("./nil.js"));

var _version = _interopRequireDefault(require("./version.js"));

var _validate = _interopRequireDefault(require("./validate.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

var _parse = _interopRequireDefault(require("./parse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./nil.js":72,"./parse.js":73,"./stringify.js":77,"./v1.js":78,"./v3.js":79,"./v4.js":81,"./v5.js":82,"./validate.js":83,"./version.js":84}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (let i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  const output = [];
  const length32 = input.length * 32;
  const hexTab = '0123456789abcdef';

  for (let i = 0; i < length32; i += 8) {
    const x = input[i >> 5] >>> i % 32 & 0xff;
    const hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  const length8 = input.length * 8;
  const output = new Uint32Array(getOutputLength(length8));

  for (let i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

var _default = md5;
exports.default = _default;
},{}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports.default = _default;
},{}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports.default = _default;
},{"./validate.js":83}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports.default = _default;
},{}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rng;
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);

function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}
},{}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (let i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  const l = bytes.length / 4 + 2;
  const N = Math.ceil(l / 16);
  const M = new Array(N);

  for (let i = 0; i < N; ++i) {
    const arr = new Uint32Array(16);

    for (let j = 0; j < 16; ++j) {
      arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
    }

    M[i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (let i = 0; i < N; ++i) {
    const W = new Uint32Array(80);

    for (let t = 0; t < 16; ++t) {
      W[t] = M[i][t];
    }

    for (let t = 16; t < 80; ++t) {
      W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }

    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];

    for (let t = 0; t < 80; ++t) {
      const s = Math.floor(t / 20);
      const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

var _default = sha1;
exports.default = _default;
},{}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports.default = _default;
},{"./validate.js":83}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports.default = _default;
},{"./rng.js":75,"./stringify.js":77}],79:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _md = _interopRequireDefault(require("./md5.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports.default = _default;
},{"./md5.js":71,"./v35.js":80}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(require("./stringify.js"));

var _parse = _interopRequireDefault(require("./parse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
},{"./parse.js":73,"./stringify.js":77}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports.default = _default;
},{"./rng.js":75,"./stringify.js":77}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _sha = _interopRequireDefault(require("./sha1.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports.default = _default;
},{"./sha1.js":76,"./v35.js":80}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regex = _interopRequireDefault(require("./regex.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports.default = _default;
},{"./regex.js":74}],84:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports.default = _default;
},{"./validate.js":83}],85:[function(require,module,exports){
// get data
async function getData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

// post data
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  //patch
async function patchData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    // we don't need patch to return data
    // return response.json(); // parses JSON response into native JavaScript objects
  }



module.exports = {
    postData,
    getData,
    patchData
}


},{}],86:[function(require,module,exports){
const key = require('./key')
const GiphyJsFetchApi = require('@giphy/js-fetch-api')
const giphyComponents =  require('@giphy/js-components')
const renderCarousel = giphyComponents.renderCarousel
const GiphyFetch = GiphyJsFetchApi.GiphyFetch
const renderGif = giphyComponents.renderGif
const apiFuncs = require('./api')


//helper funcs for select styles
function toggleBorder(element){
    element.style.border = 'solid limegreen 4px'
}
function removeAllBorders(){
    const giphyGifs = document.getElementsByClassName('giphy-gif')
    for(let i=0; i<giphyGifs.length; i++) {
        giphyGifs[i].style.border = 'solid 4px transparent'
        giphyGifs[i].style.borderRadius = '12px'

    }
}
//async submit function in order to post then refresh on mobile browsers
async function submit(data) {
    await apiFuncs.postData('https://gossip-girl-api.herokuapp.com/posts', data)
    window.location.search = ''
    window.location.reload()
  }

const popupTextArea = document.querySelector('#popup-textarea')
const submitNewPost = document.querySelector('#submit-post')
let giphSelected = false
function prepPost(gifId){
    giphSelected = true
    let data = {}
    submitNewPost.onclick = () => {
        try {
            console.log(!document.getElementsByClassName('giphy-carousel')[0])
            if (!document.getElementsByClassName('giphy-carousel')[0]) gifId = null
            if (popupTextArea.value.length < 1) throw new Error('add some text!')
            data.text = popupTextArea.value
            data.date = new Date().toString()
            data.giphy = gifId
            console.log(data)
            submit(data)
        } catch(err) {
            alert('add some text!')
            throw err
        }
    }
}
submitNewPost.addEventListener("click", () => { 
    
    if (!giphSelected) {
        try {
            if (popupTextArea.value.length < 1) throw new Error('add some text!')
            let data = {}
            data.text = popupTextArea.value
            data.date = new Date().toString()
            submit(data)
        } catch(err) {
            alert('add some text!')
            throw err
        }
    }
})



// create a GiphyFetch with your api key
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch(key)

// Creating a carousel with window resizing and remove-ability
const makeCarousel = (targetEl, query) => {
    
    let selectedGif
    const fetchGifs = (offset) => {
        return gf.search(query, {offset, sort: 'relevant', lang: 'en', limit: 3})
    }
    const render = () => {
        // here is the @giphy/js-components import
        return renderCarousel(
            {
              gifHeight: 100,
              noLink: true,
              hideAttribution: true,
              user: {},
              fetchGifs,
              gutter: 0,
              onGifClick: (gif, event) => {
                  event.preventDefault();
                  removeAllBorders()
                  toggleBorder(event.currentTarget)
                  prepPost(gif.id)
                }
            },
            targetEl
          );
    }
    const remove = render()
    return {
        remove: () => {
            remove()
        },
    }
}

// create a GiphyFetch with your api key
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const vanillaJSGif = async (mountNode, id) => {
    // render a single gif
    const { data: gif1 } = await gf.gif(id)
    renderGif({ gif: gif1, width:  300, noLink: true }, mountNode)
}

// To remove
// grid.remove()

module.exports = { 
    makeCarousel,
    vanillaJSGif,
} 
},{"./api":85,"./key":89,"@giphy/js-components":30,"@giphy/js-fetch-api":36}],87:[function(require,module,exports){
const giphy = require('./giphy')
const renderGif = giphy.vanillaJSGif

const apiFuncs = require('./api')

function renderList(data) {
    for (item of data) {
        document.getElementById('root').append(renderItem(item))
    }
    //function to render data to the DOM
}

function renderItem(data) {
    // return a full post element with text and gif + class names
    const postContainer = document.createElement('div')
    postContainer.className = "blog-entry"

    //append the parsed date
    const postDate = document.createElement('p')
    postDate.textContent = data.dateFrom
    postDate.className = 'blog-entry-timestamp'
    postContainer.appendChild(postDate)

    //append the main text content for post
    const postText = document.createElement('p')
    postText.textContent = data.text

    function randomclass() {
        const differentFontClass = ["blog-entry-font-1", "blog-entry-font-2", "blog-entry-font-3", "blog-entry-font-4", "blog-entry-font-5"]
        const randNum = Math.floor(Math.random() * differentFontClass.length)
        return differentFontClass[randNum]
    }
    postText.className = `${randomclass()} blog-entry-main`

    postContainer.appendChild(postText)

    //apend a gif if post has one
    const postGif = document.createElement('div')
    postGif.className = 'gifCont'
    if (data.giphy) {
        postContainer.appendChild(postGif)
        renderGif(postGif, data.giphy)
    }


    //make like button
    const likeButton = document.createElement('button')
    likeButton.className = 'reaction-bttn'
    likeButton.textContent = '😍'
    postContainer.appendChild(likeButton)

    //make shocked/unhappy button 
    const shockedButton = document.createElement('button')
    shockedButton.className = 'reaction-bttn'
    shockedButton.textContent = '😱'
    postContainer.appendChild(shockedButton)

    //make laugh button 
    const laughButton = document.createElement('button')
    laughButton.className = 'reaction-bttn'
    laughButton.textContent = '😂'
    postContainer.appendChild(laughButton)

    // make comment button 
    const commentButton = document.createElement('button')
    commentButton.className = 'first-to-comment tertiary-bttn'
    commentButton.textContent = 'comment'
    postContainer.appendChild(commentButton)

    //show number of likes 
    const showTotalLikes = document.createElement('span')
    showTotalLikes.className = 'reaction-badge'
    showTotalLikes.textContent = data.reactions.happy
    likeButton.after(showTotalLikes)


    //show number of shocks
    const showTotalShocks = document.createElement('span')
    showTotalShocks.className = 'reaction-badge'
    showTotalShocks.textContent = data.reactions.unhappy
    shockedButton.after(showTotalShocks)


    //show number of laughs
    const showTotallaughs = document.createElement('span')
    showTotallaughs.className = 'reaction-badge'
    showTotallaughs.textContent = data.reactions.funny
    laughButton.after(showTotallaughs)

    
    likeButton.addEventListener('click', (event) => addReaction(event, 'happy', data.id))
    shockedButton.addEventListener('click', (event) => addReaction(event, 'unhappy', data.id))
    laughButton.addEventListener('click', (event) => addReaction(event, 'funny', data.id))

    //append share button 
    const shareButton = document.createElement('button')
    shareButton.className = 'tertiary-bttn share-button'

    // add fontawesome icon 
    const iElement = document.createElement('i')
    iElement.className = "fas fa-share-square"
    shareButton.append(iElement)

    postContainer.append(shareButton)
    //share click event
    shareButton.addEventListener("click", () => {
        copyUrl(data.id, postContainer)
    })

    //create div to append comment input container - before comments
    const commentPostCont = document.createElement('div')
    postContainer.append(commentPostCont)
    commentButton.addEventListener('click', () => addComment(commentPostCont, postContainer, data.id))

       //append the comments 
       const commentCont = document.createElement('div')
       commentCont.className = 'comment-cont'
       for (comment of data.comments) {
           //append each comment
           commentCont.appendChild(renderComment(comment))
       }
   
    //get the number of comments on a button
    const showCommentsBttn = document.createElement('button')
    showCommentsBttn.className = 'read-comment-bttn'
    showCommentsBttn.dataset.comments = commentCont.querySelectorAll('.comment-item').length
    
    if (showCommentsBttn.dataset.comments > 0) {
        showCommentsBttn.textContent = `show ${showCommentsBttn.dataset.comments} ${showCommentsBttn.dataset.comments == 1 ? 'comment' : 'comments'}`
        postContainer.append(showCommentsBttn)
        showCommentsBttn.addEventListener("click", () => {
            commentCont.classList.toggle('display-comments')
            const display = commentCont.classList.contains('display-comments')
            showCommentsBttn.textContent = `${display ? 'hide' : 'show'} ${showCommentsBttn.dataset.comments} ${showCommentsBttn.dataset.comments == 1 ? 'comment' : 'comments'}`
            // addComment(commentPostCont, postContainer, data.id, showCommentsBttn)
        })
    }
    else {
            showCommentsBttn.textContent = `be first comment!`
            postContainer.append(showCommentsBttn)
            showCommentsBttn.addEventListener("click", () => {
                commentCont.classList.toggle('display-comments')
                if (showCommentsBttn.dataset.comments == 0) addComment(commentPostCont, postContainer, data.id, showCommentsBttn)
            })
    }
    
    postContainer.append(commentCont)

    // firstToComment.textContent = firstToComment.dataset.comments
    // else if (numberOfComments > 1) {

    //     //button to display comments
    //     const readCommentsBttn = document.createElement('button')
    //     readCommentsBttn.classList.add("read-comment-bttn")
    //     readCommentsBttn.textContent = `read comments: ${numberOfComments}`
    //     readCommentsBttn.addEventListener('click', () => {
    //         commentCont.classList.toggle('display-comments')
    //         const numberOfComments = commentPostCont.querySelectorAll('.comment-item')
    //         console.log(numberOfComments)
    //     })

    //     postContainer.append(readCommentsBttn)
    // }

    // } else if (numberOfComments === 1) {
    //     const readCommentsBttn = document.createElement('button')
    //     readCommentsBttn.classList.add("read-comment-bttn")
    //     readCommentsBttn.textContent = `read comment`
    //     readCommentsBttn.addEventListener('click', () => {
    //         commentCont.classList.toggle('display-comments')
    //     });
    //     postContainer.append(readCommentsBttn)
    // }
    // else {
    //     const firstToComment = document.createElement('button')
    //     firstToComment.classList.add('read-comment-bttn')
    //     firstToComment.textContent = "Be the first to comment!"
    //     postContainer.append(firstToComment)
    //     firstToComment.addEventListener("click", () => {
    //         commentCont.classList.toggle('display-comments')
    //         addComment(commentPostCont, postContainer, data.id)
    //     })
    // }



    return postContainer

}

function addReaction(event, reactionType, id) {
    //send click to server
    const url = `https://gossip-girl-api.herokuapp.com/posts/${id}/reactions`
    const data = { reaction: reactionType }
    apiFuncs.patchData(url, data)
    //update emoji number for client
    event.currentTarget.nextSibling.textContent++
}



async function addComment(parent, topParent, id) {
    if (typeof parent.getElementsByClassName('post-comment-cont')[0] === 'undefined') {
        const newComment = document.createElement('div')
        newComment.className = 'post-comment-cont'
        //new text area
        const textArea = document.createElement('textarea')
        textArea.className = 'post-comment-textarea'
        textArea.placeholder = "Share your thoughts 💭"
        newComment.append(textArea)

        //comment button to post value from text area
        const commentSubmitBttn = document.createElement('button')
        commentSubmitBttn.classList.add('primary-bttn')
        commentSubmitBttn.textContent = 'reply'

        commentSubmitBttn.addEventListener('click', () => {
            try {
                const commentValue = textArea.value
                if (commentValue.length < 1) throw new Error('comment too short')
                const url = `https://gossip-girl-api.herokuapp.com/posts/${id}/comments`
                const date = new Date().toString()
                const data = { text: commentValue, date: date }
                apiFuncs.patchData(url, data)
                //apend comment for client too
                topParent.getElementsByClassName('comment-cont')[0].append(renderComment({ text: commentValue, new: true }))
                parent.getElementsByClassName('post-comment-cont')[0].remove()
                const showCommentBttn = topParent.getElementsByClassName('read-comment-bttn')[0]
                showCommentBttn.dataset.comments++
                topParent.getElementsByClassName('comment-cont')[0].classList.add('display-comments')
                showCommentBttn.textContent = `hide ${showCommentBttn.dataset.comments} ${showCommentBttn.dataset.comments == 1 ? 'comment' : 'comments'}`

            } catch (err) {
                alert(err)
                throw err
            }
        })
        newComment.append(commentSubmitBttn)

        await parent.append(newComment)
        textArea.focus()

    }
    else {
        parent.getElementsByClassName('post-comment-cont')[0].remove()
    }
}

function copyUrl(id, parent) {
    const copyText = document.createElement('textarea')
    copyText.value = `https://gossip-girl-xoxo.netlify.app/post?${id}`
    parent.append(copyText)
    copyText.select();
    document.execCommand("copy");
    copyText.remove()
    alert('link copied')
}

function renderComment(comment) {
    const commentPara = document.createElement('p')
    commentPara.classList.add('comment-item')
    commentPara.textContent = comment.text
    if (comment.new) {commentPara.style.fontWeight = 'bold'}
    return commentPara
}

function renderError(error) {
    const errorCont = document.createElement('div')
    errorCont.className = 'error'
    errorCont.textContent = `${error}`
    document.getElementById('root').prepend(errorCont)
}



module.exports = {
    renderList,
    renderItem,
    renderError
}
},{"./api":85,"./giphy":86}],88:[function(require,module,exports){
const giphy = require('./giphy')
const makeCarousel = giphy.makeCarousel
const renderGif = giphy.vanillaJSGif
const apiFuncs = require('./api')
const handlerFuncs = require('./handlers')

// on page load fetch all posts data and render them as post DOM items check url to find query to sort by.
async function runPage() {
  if (window.location.href.includes('post')) {
    try {
      const index = window.location.search.substring(1)
      const singleData = await apiFuncs.getData(`https://gossip-girl-api.herokuapp.com/posts/${index}`)
      handlerFuncs.renderList([singleData])
    } catch (err) {
      handlerFuncs.renderError('404: post not found 😞')
      throw err
    }
  }
  else {
    let currentIndex = 0
    window.addEventListener("load", async () => {

      const sortOrder = window.location.search
      if (sortOrder === '?hot') {
        const data = await apiFuncs.getData(`https://gossip-girl-api.herokuapp.com/posts/hot/${currentIndex}/${currentIndex + 5}`)
        handlerFuncs.renderList(data)
      }
      else {
        const data = await apiFuncs.getData(`https://gossip-girl-api.herokuapp.com/posts/${currentIndex}/${currentIndex + 5}`)
        handlerFuncs.renderList(data)
      }
      currentIndex += 5
      document.getElementById('get-more-posts').addEventListener("click", async () => {
        try {
          if (sortOrder === '?hot') {
            const newData = await apiFuncs.getData(`https://gossip-girl-api.herokuapp.com/posts/hot/${currentIndex}/${currentIndex + 5}`)
            if (newData.length === 0) throw new Error('You\'re up to date 🎉 ')
            handlerFuncs.renderList(newData)
          }
          else {
            const newData = await apiFuncs.getData(`https://gossip-girl-api.herokuapp.com/posts/${currentIndex}/${currentIndex + 5}`)
            if (newData.length === 0) throw new Error('You\'re up to date 🎉 ')
            handlerFuncs.renderList(newData)
          }
          currentIndex += 5
        } catch (err) {
          alert('You\'re up to date 🎉 ')
          throw err
        }
      })
    })

    function updateUrlQuery(query) {
      window.location.search = query
    }



function giphySearch() {
  const cancelGiphy = document.getElementById('cancel-giphy-bttn')
  const root = document.querySelector('#giphy-root')
  const query = document.querySelector('#giphy-search')
  const grid = makeCarousel(root, query.value)
  document.querySelector('#search-giphy').addEventListener("click", () => {
  try {
      if (query.value.length < 1) throw new Error('no query entered')
      cancelGiphy.classList.add('display')
      grid.remove()
      giphySearch()
      cancelGiphy.addEventListener("click", () => {
        query.value = ''
        cancelGiphy.classList.remove('display')
        grid.remove()
      })
  } catch(err) {
    alert('enter a query')
    throw err
  }
})
}
giphySearch()


    document.querySelector('#hot-sort').addEventListener("click", () => updateUrlQuery('hot'))
    document.querySelector('#new-sort').addEventListener("click", () => updateUrlQuery('new'))



    document.querySelector('#popup-post').addEventListener("click", (event) => {
      event.currentTarget.classList.toggle('rotate')
      const popupPostArea = document.querySelector('#popup-postarea')
      const popupTextArea = document.querySelector('#popup-textarea')
      popupPostArea.classList.toggle('display')
      popupTextArea.focus()
    })

  }
}
runPage()

// Nav button opens and closes on click
document.querySelector('.icon').addEventListener('click', () => {
  document.querySelector(".sidenav").style.width = "50%";
})

document.querySelector('.close-icon').addEventListener('click', () => {
  document.querySelector(".sidenav").style.width = "0%";
})

// Dark Mode 

document.querySelector('.dark-mode-button').addEventListener('click', () => {
  document.body.classList.toggle('dark')
})

},{"./api":85,"./giphy":86,"./handlers":87}],89:[function(require,module,exports){
const key = 'HPtiYWEeMXDaI1bJuNQ9L9ypMfbpwnKh'

module.exports = key
},{}]},{},[88]);
