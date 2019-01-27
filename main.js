var m2i = {}
var i2m = {}
var m2ik = []
var i2mk = []

var tingkat = {}

function set(s) {
	$('#input').val(s);
	$('#input').trigger('input');
}

// [tingkat,indo,madura]
$.getJSON("kamus.json", function(json) {
   json.forEach(el => {
	   (m2i[el[2]] || (m2i[el[2]] = [])).push(el[1]);
	   (i2m[el[1]] || (i2m[el[1]] = [])).push(el[2]);
	   tingkat[el[2]] = el[0];
   });
   m2ik = Object.keys(m2i);
   i2mk = Object.keys(i2m);
});

$('#input,input[name=mode]').on('input', function() {
	var t = $('#input').val().toLowerCase();
	if (t.length < 2) {
		$('#highlight').html('');
		$('#result').html('');
	} else {
		var ismadura = $('input[name=mode]:checked').val() == "m2i";
		var m = ismadura ? m2i : i2m;
		var k = ismadura ? m2ik : i2mk;

		var o = '';
		if (!ismadura && m[t]) {
			o = '<p>' + t + '<br>'+ m[t].map(x => '&nbsp;&nbsp;&nbsp;<b>' + x + '</b> => '+tingkat[x]+'<br>').join('') + '</p>'
		}

		var r = k.filter((x) => x.includes(t)).map(i => `<p onclick="set('${i}')"><b>${i}</b>: ${m[i].join(', ')}</p>`);

		$('#highlight').html(o);
		$('#result').html(r.join(''));
	}

})