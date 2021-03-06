'use strict';

// Adapted from several packages by <https://github.com/sindresorhus>
// Individual packages involved:
// * <https://github.com/sindresorhus/pretty-ms>
// * <https://github.com/sindresorhus/plur>
// * <https://github.com/sindresorhus/irregular-plurals>
// * <https://github.com/sindresorhus/parse-ms>

var IRREGULAR = {
	"addendum": "addenda",
	"aircraft": "aircraft",
	"alga": "algae",
	"alumna": "alumnae",
	"alumnus": "alumni",
	"amoeba": "amoebae",
	"analysis": "analyses",
	"antenna": "antennae",
	"antithesis": "antitheses",
	"apex": "apices",
	"appendix": "appendices",
	"automaton": "automata",
	"axis": "axes",
	"bacillus": "bacilli",
	"bacterium": "bacteria",
	"barracks": "barracks",
	"basis": "bases",
	"beau": "beaux",
	"bison": "bison",
	"buffalo": "buffalo",
	"bureau": "bureaus",
	"cactus": "cacti",
	"calf": "calves",
	"carp": "carp",
	"census": "censuses",
	"chassis": "chassis",
	"cherub": "cherubim",
	"child": "children",
	"château": "châteaus",
	"cod": "cod",
	"codex": "codices",
	"concerto": "concerti",
	"corpus": "corpora",
	"crisis": "crises",
	"criterion": "criteria",
	"curriculum": "curricula",
	"datum": "data",
	"deer": "deer",
	"diagnosis": "diagnoses",
	"die": "dice",
	"dwarf": "dwarfs",
	"echo": "echoes",
	"elf": "elves",
	"elk": "elk",
	"ellipsis": "ellipses",
	"embargo": "embargoes",
	"emphasis": "emphases",
	"erratum": "errata",
	"faux pas": "faux pas",
	"fez": "fezes",
	"firmware": "firmware",
	"fish": "fish",
	"focus": "foci",
	"foot": "feet",
	"formula": "formulae",
	"fungus": "fungi",
	"gallows": "gallows",
	"genus": "genera",
	"goose": "geese",
	"graffito": "graffiti",
	"grouse": "grouse",
	"half": "halves",
	"hero": "heroes",
	"hoof": "hooves",
	"hovercraft": "hovercraft",
	"hypothesis": "hypotheses",
	"index": "indices",
	"kakapo": "kakapo",
	"knife": "knives",
	"larva": "larvae",
	"leaf": "leaves",
	"libretto": "libretti",
	"life": "lives",
	"loaf": "loaves",
	"locus": "loci",
	"louse": "lice",
	"man": "men",
	"matrix": "matrices",
	"means": "means",
	"medium": "media",
	"memorandum": "memoranda",
	"millennium": "millennia",
	"minutia": "minutiae",
	"moose": "moose",
	"mouse": "mice",
	"nebula": "nebulae",
	"nemesis": "nemeses",
	"neurosis": "neuroses",
	"news": "news",
	"nucleus": "nuclei",
	"oasis": "oases",
	"offspring": "offspring",
	"opus": "opera",
	"ovum": "ova",
	"ox": "oxen",
	"paralysis": "paralyses",
	"parenthesis": "parentheses",
	"person": "people",
	"phenomenon": "phenomena",
	"phylum": "phyla",
	"pike": "pike",
	"polyhedron": "polyhedra",
	"potato": "potatoes",
	"prognosis": "prognoses",
	"quiz": "quizzes",
	"radius": "radii",
	"referendum": "referenda",
	"salmon": "salmon",
	"scarf": "scarves",
	"self": "selves",
	"series": "series",
	"sheep": "sheep",
	"shelf": "shelves",
	"shrimp": "shrimp",
	"spacecraft": "spacecraft",
	"species": "species",
	"spectrum": "spectra",
	"squid": "squid",
	"stimulus": "stimuli",
	"stratum": "strata",
	"swine": "swine",
	"syllabus": "syllabi",
	"symposium": "symposia",
	"synopsis": "synopses",
	"synthesis": "syntheses",
	"tableau": "tableaus",
	"that": "those",
	"thesis": "theses",
	"thief": "thieves",
	"tomato": "tomatoes",
	"tooth": "teeth",
	"trout": "trout",
	"tuna": "tuna",
	"vertebra": "vertebrae",
	"vertex": "vertices",
	"veto": "vetoes",
	"vita": "vitae",
	"vortex": "vortices",
	"watercraft": "watercraft",
	"wharf": "wharves",
	"wife": "wives",
	"wolf": "wolves",
	"woman": "women"
}

var parse_ms = function(ms) {
	if (typeof ms !== 'number') {
		throw new TypeError('Expected a number');
	}
	var round_to_zero = ms > 0 ? Math.floor : Math.ceil;
	return {
		days: round_to_zero(ms / 86400000),
		hours: round_to_zero(ms / 3600000) % 24,
		minutes: round_to_zero(ms / 60000) % 60,
		seconds: round_to_zero(ms / 1000) % 60,
		milliseconds: round_to_zero(ms) % 1000
	};
};

var plur = function(str, plural, count) {
	if (typeof plural === 'number') {
		count = plural;
	}

	if (str in IRREGULAR) {
		plural = IRREGULAR[str];
	} else if (typeof plural !== 'string') {
		plural = (str.replace(/(?:s|x|z|ch|sh)$/i, '$&e').replace(/([^aeiou])y$/i, '$1ie') + 's')
			.replace(/i?e?s$/i, function (m) {
				var isTailLowerCase = str.slice(-1) === str.slice(-1).toLowerCase();
				return isTailLowerCase ? m.toLowerCase() : m.toUpperCase();
			});
	}

	return count === 1 ? str : plural;
};

var ms = function(ms, opts) {
	if (!Number.isFinite(ms)) {
		throw new TypeError('Expected a finite number');
	}

	opts = opts || {};

	if (ms < 1000) {
		var msDecimalDigits = typeof opts.msDecimalDigits === 'number' ? opts.msDecimalDigits : 0;
		return (msDecimalDigits ? ms.toFixed(msDecimalDigits) : Math.ceil(ms)) + (opts.verbose ? ' ' + plur('millisecond', Math.ceil(ms)) : 'ms');
	}

	var ret = [];

	var add = function(val, long, short, valStr) {
		if (val === 0) {
			return;
		}
		var postfix = opts.verbose ? ' ' + plur(long, val) : short;
		ret.push((valStr || val) + postfix);
	};

	var parsed = parse_ms(ms);

	add(Math.trunc(parsed.days / 365), 'year', 'y');
	add(parsed.days % 365, 'day', 'd');
	add(parsed.hours, 'hour', 'h');
	add(parsed.minutes, 'minute', 'm');

	if (opts.compact) {
		add(parsed.seconds, 'second', 's');
		return '~' + ret[0];
	}

	var sec = ms / 1000 % 60;
	var secDecimalDigits = typeof opts.secDecimalDigits === 'number' ? opts.secDecimalDigits : 1;
	var secStr = sec.toFixed(secDecimalDigits).replace(/\.0$/, '');
	add(sec, 'second', 's', secStr);

	return ret.join(' ');
};


module.exports = ms;
