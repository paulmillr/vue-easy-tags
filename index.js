var reserved = 'attrs directives domProps key nativeOn on props ref slot style'.split(' ').reduce(function (reserved, key) {
  reserved[key] = true;
  return reserved;
}, {})

module.exports = function (
  tag,
  data,
  children
) {
  var len = arguments.length;
  var str = typeof tag === 'string';

  // check for and process enhanced render arguments
  if (len > 3 || tag === '' || (str && (tag.charAt(0) === '.' || tag.match(/[.@!?]/))) || (data && typeof data === 'object')) {
    var chr;
    var raw;
    var dbg;
    var ary = Array.apply(null, arguments);
    var cls = [];
    var eid;

    // parse tag for class, id, or trailing "!" (unsafe HTML) or "?" (debug mode)
    tag = ary.shift();
    if (str) {
      len = tag.length;
      chr = tag.charAt(len - 1);
      if (chr === '!' || chr === '?') {
        chr === '!' ? (raw = true) : (dbg = true);
        tag = tag.slice(0, len - 1);
      }

      // check for tag, class, and id values
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
    }

    // process obj
    var obj = ary.shift();
    str = obj != null ? obj.constructor.name : null;
    if (str === 'Object') {
      obj.attrs = obj.attrs || {};
      Object.keys(obj).forEach(function (key) {
        if (!reserved[key]) {
          obj.attrs[key] = obj[key];
          delete obj[key];
        }
      });
    } else if (str === 'Boolean') {
      if (!obj) { return }
      obj = undefined;
    } else {
      ary.unshift(obj);
      obj = undefined;
    }

    // set easy-tags properties
    if (cls || eid || raw || dbg) {
      if (!obj) { obj = {}; }
      if (cls) { obj.staticClass = cls.join(' '); }
      if (eid) { obj.attrs = obj.attrs || {}; obj.attrs.id = eid; }
      if (raw) { obj.domProps = { innerHTML: ary.shift() }; }
      if (dbg) {
        tag = 'pre'; // override tag?
        obj.style = {
          'margin': '0',
          'border': '1px solid red',
          'padding': '10px',
          'color': 'red',
          'background': '#fcfcb8',
          'line-height': '16px',
          'font-size': '12px',
          'white-space': 'pre-line'
        };
        const spy = function spy (obj) { }; // add function to deep-dive into children...
        ary = (Array.isArray(ary[0]) ? ary[0] : ary).map(function(val) {
          return `\n[${val.tag || val.text || JSON.stringify(val)}, ${JSON.stringify(val.data)}]\n`;
        });
        ary.unshift("Debug:\n");
      }
    }

    // invoke virtual dom
    return vue._createElement(this._self, tag, obj, ary)
  }

  if (data && (Array.isArray(data) || typeof data !== 'object')) {
    children = data;
    data = undefined;
  }
  // make sure to use real instance instead of proxy as context
  return vue._createElement(this._self, tag, data, children)
}
