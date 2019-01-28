var m2i = {}
var i2m = {}
var m2ik = []
var i2mk = []
var m2is = {}
var m2isk = []
var i2mo = {}
var prefix = [['a', 'ber'], ['ta', 'ter'], ['ma', 'memper'], ['ka', 'ke']]
var postfix = [['na', 'nya']]

var tingkat = {}

function set(s) {
	$('#input').val(s);
	$('#input').trigger('input');
}

// [tingkat,indo,madura]
$.getJSON("kamus.json", function(json) {
   json.forEach(el => {
	   // Guarateed unique
	   m2i[el[2]] = el[1];
	   var elm = removeDiacritics(el[2]);
	   if (elm != el[2])
	   m2is[elm] = el[2];
	   // Send as array
	   (i2m[el[1]] || (i2m[el[1]] = [])).push(el[2]);
	   tingkat[el[2]] = el[0];
   });
   m2ik = Object.keys(m2i);
   i2mk = Object.keys(i2m);
   m2isk = Object.keys(m2is);
});

function tryReplacePrefix(txt, func, before, after) {
	if (txt.startsWith(before)) {
		var s2 = txt.substring(before.length);
		var r2 = func(s2);
		if (r2 != s2) return after + r2;
	}
	return txt;
}


function tryReplacePostfix(txt, func, before, after) {
	if (txt.endsWith(before)) {
		var s2 = txt.substring(0, txt.length - before.length);
		var r2 = func(s2);
		if (r2 != s2) return r2 + after;
	}
	return txt;
}

function getM2I(s) {
	if (m2i[s]) return m2i[s];
	else if (m2is[s]) {
		return m2i[m2is[s]];
	}
	for (const pre of prefix) {
		var s2 = tryReplacePrefix(s, getM2I, pre[0], pre[1]);
		if (s != s2) {return s2;}
	}
	for (const post of postfix) {
		var s2 = tryReplacePostfix(s, getM2I, post[0], post[1]);
		if (s != s2) {return s2;}
	}
	return s;
}

function guessBestI2M(s, arr) {
	if (i2mo[s] !== undefined) return arr[i2mo[s]];
	idx = 0;
	if (arr.length == 1) idx = 0;
	else {
		// lomrah is priority
		idx = arr.findIndex((x) => tingkat[x] === 'lomrah');
		idx = Math.max(idx, 0);
	}
	i2mo[s] = idx;
	return arr[idx];
}

function getI2M(s) {
	if (i2m[s]) return guessBestI2M(s, i2m[s]);
	for (const pre of prefix) {
		var s2 = tryReplacePrefix(s, getI2M, pre[1], pre[0]);
		if (s != s2) {return s2;}
	}
	for (const post of postfix) {
		var s2 = tryReplacePostfix(s, getI2M, post[1], post[0]);
		if (s != s2) {return s2;}
	}
	return s;
}

function styleIfNotFound(translated, compare) {
	if (translated != compare) return translated;
	else return "<span style='color:gray'>"+translated+"</span>";
}

$('#input,input[name=mode]').on('input', function() {
	var t = $('#input').val().toLowerCase();
	var ismadura = $('input[name=mode]:checked').val() == "m2i";
	if (t == '') {
		$('#highlight').html('');
		$('#result').html('');
	}
	else
	{
		var f = ismadura ? getM2I : getI2M;

		$('#highlight').html(t.split(' ').map(x => styleIfNotFound(f(x),x)).join(' '));

		if (!t.includes(' ')) {
			var m = ismadura ? m2i : i2m;
			var k = ismadura ? m2ik : i2mk;

			var o = $('#highlight').html();
			if (!ismadura && m[t]) {
				o = '<p>' + t + '<br>'+ m[t].map(x => '&nbsp;&nbsp;&nbsp;<b>' + x + '</b> &raquo; '+tingkat[x]+'<br>').join('') + '</p>'
			}

			$('#highlight').html(o);

			var r = k.filter((x) => x.includes(t)).slice(0, 16).map(i => `<p onclick="set('${i}')"><b>${i}</b>: ${ismadura ? m[i] : m[i].join(', ')}</p>`);
			if (ismadura) {
				r = r.concat(m2isk.filter((x) => x.includes(t)).map(i => `<p onclick="set('${m2is[i]}')"><b>${m2is[i]}</b>: ${m[m2is[i]]}</p>`));
			}
			$('#result').html(r.join(''));
		} else {
			$('#result').html('');
		}
	}
})