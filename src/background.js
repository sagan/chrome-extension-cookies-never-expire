
chrome.webRequest.onHeadersReceived.addListener( ({responseHeaders = []}) => {
	let mod = false;
	responseHeaders.forEach(header => {
		if( header.name.toLowerCase() == "set-cookie" ) {
			let cookie = parse(header.value);
			let expires = cookie["expires"] || cookie["Expires"];
			let maxAge = cookie["max-age"] || cookie["Max-Age"] || cookie["Max-age"];
			if( new Date(expires) > Date.now() || maxAge > 0 ) {
				mod = true;
				header.value = header.value.replace(/Expires=[^;]*/i, "").replace(/Max-Age=[^;]*/i, '') + ";Max-Age=3153600000"; // 86400 * 365 * 100
				//console.log("modify cookie", header.value);
			}
		}
	});
	if( mod ) return {responseHeaders};
}, {urls: ["<all_urls>"], types: ["main_frame", "xmlhttprequest", "sub_frame"]}, ["blocking", "responseHeaders"]);


/*
from cookie (HTTP server cookie parsing and serialization library)
https://github.com/jshttp/cookie
 */
function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {}
  var opt = options || {};
  var pairs = str.split(/; */);
  var dec = opt.decode || decodeURIComponent;

  pairs.forEach(function(pair) {
    var eq_idx = pair.indexOf('=')

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      return;
    }

    var key = pair.substr(0, eq_idx).trim()
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  });

  return obj;
}

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}
