'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var reserved = 'attrs class directives domProps key nativeOn on props ref slot staticClass style'.split(' ').reduce(function (reserved, key) {
  reserved[key] = true;
  return reserved;
}, {});

function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}

module.exports = function (tag, data, children) {
  var beg = 1;

  // process boolean short circuit
  if (typeof data === 'boolean') {
    if (!data) { return; }
    data = children;
    children = arguments[3];
    beg++;
  }

  // adjust arguments
  if (data) {
    if (Array.isArray(data) || _typeof(data) !== 'object') {
      children = data;
      data = undefined;
    } else if (data.constructor.name !== 'Object') {
      children = toArray(arguments, beg);
      data = undefined;
    }
  }
  if (children && !(Array.isArray(children) || _typeof(children) !== 'object')) {
    children = toArray(arguments, beg + 1);
  }

  // process tag modifiers
  if (tag === '') {
    tag = 'div';
  } else if (typeof tag === 'string' && tag.match(/[.@!?]/)) {
    var cls = [];
    var eid;
    var raw;
    var dbg;

    // check tag for trailing "!" (raw HTML) or "?" (debug mode)
    var len = tag.length;
    var chr = tag.charAt(len - 1);
    if (chr === '!' || chr === '?') {
      chr === '!' ? raw = true : dbg = true;
      tag = tag.slice(0, len - 1);
    }

    // check tag for classes and id
    var all = tag.split(/([.@])/);
    tag = all[0] || 'div';
    len = all.length;
    for (var pos = 0; ++pos < len;) {
      if (all[pos++].charAt(0) === '.') {
        cls.push(all[pos]);
      } else {
        eid = all[pos];
      }
    }

    // set tag properties
    if (cls || eid || raw || dbg) {
      if (!data) { data = {}; }
      if (cls.length) { if (data.staticClass) { cls.unshift(data.staticClass) }; data.staticClass = cls.join(' '); }
      if (eid) { if (!data.attrs) { data.attrs = { id: eid } } else { data.attrs.id = eid } }
      if (raw) { data.domProps = { innerHTML: children }; children = undefined; }
      if (dbg) {
        tag = 'pre';
        data.style = {
          'margin': '0',
          'border': '1px solid red',
          'padding': '10px',
          'color': 'red',
          'background': '#fcfcb8',
          'line-height': '16px',
          'font-size': '12px',
          'white-space': 'pre-line',
          'overflow': 'auto'
        };
        // const spy = function spy (data) { }; // add function to deep-dive into children...
        children = (Array.isArray(children[0]) ? children[0] : children).map(function(val) {
          return "\n[" + (val.tag || val.text || JSON.stringify(val)) + ", " + JSON.stringify(val.data) + "]\n";
        });
        children.unshift("Debug:\n");
      }
    }
  }

  // process data object
  if (data && typeof tag === 'string') {
    Object.keys(data).forEach(function (key) {
      if (data.hasOwnProperty(key)) {
        if (!reserved[key]) {
          if (!data.attrs) { data.attrs = {}; }
          data.attrs[key] = data[key];
          delete data[key];
        }
      }
    });
  }

  // make sure to use real instance instead of proxy as context
  return Vue._createElement(this._self, tag, data, children);
};
