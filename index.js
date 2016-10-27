(function(vue) {

module.exports = function (tag, data, children) {
  var len = arguments.length;
  var str = typeof tag === 'string';
  var yes;

  // check for enhanced render arguments
  if (len > 3 || tag === '' || (str && (tag.charAt(0) === '.' || tag.match(/[.@!?]/)))) {
    yes = 1;
  } else if (str && len > 1) {
    var end = arguments[len - 1];
    var aos = Array.isArray(end) || typeof end === 'string';
    if (!(len === 2 && aos)) {
      var uno = data === undefined || data === null || typeof data === 'object' && data.constructor.name === 'Object';
      yes = !((len === 2 && uno) || (len === 3 && uno && aos));
    }
  }

  // process enhanced render arguments
  if (yes) {
    var chr;
    var raw;
    var dbg;
    var ary = Array.apply(null, arguments);
    var cls = [];
    var eid;

    // check for tag, class, id, and trailing "!" (unsafe HTML)
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
    if (str === 'Number' || str === 'Boolean') {
      if (!obj) { return }
      obj = undefined;
    } else if (str !== 'Object') {
      ary.unshift(obj);
      obj = undefined;
    }

    // set properties
    if (cls || eid || raw || dbg) {
      if (!obj) { obj = {}; }
      if (cls) { obj.staticClass = cls.join(' '); }
      if (eid) { obj.attrs = { id: eid }; }
      if (raw) { obj.domProps = { innerHTML: ary.shift() }; }
      if (dbg) {
        tag = 'pre'; // override tag?
        obj.style = {
          'color': 'red',
          'margin': '0',
          'padding': '10px',
          'border': '1px solid red',
          'background': '#fcfcb8',
          'line-height': '16px',
          'font-size': '12px',
          'white-space': 'pre-line'
        };
        const spy = function spy (obj) {
        };
        console.log(ary, typeof ary);
        ary = (Array.isArray(ary[0]) ? ary[0] : ary).map(function(val) {
          return `\n[${val.tag || val.text}, ${JSON.stringify(val.data)}]\n`;
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

})(window.vue);
