var pie;
var EXECUTED = false;
(function(){

	var drugDef = {};

	resetDef = function() {
		$('#pie-defs-container').hide();
		$('#pie-instr').show();
	}

	generateDef = function() {
	}


	executePie = function() {
		$("#pie-defs-container").hide();
		if (EXECUTED == false) {
			pie = new d3pie("pie-chart", {
				"header": {
					"title": {
						"text": "Annual Dosage Frequency",
						"fontSize": 24,
						"font": "open sans"
					},
					"subtitle": {
						"text": "  ",
						"color": "#999999",
						"fontSize": 12,
						"font": "open sans"
					},
					"titleSubtitlePadding": 0
				},
				"footer": {
					"color": "#999999",
					"fontSize": 10,
					"font": "open sans",
					"location": "bottom-left"
				},
				"size": {
					"canvasWidth": 590,
					"pieOuterRadius": "90%"
				},
				"data": {
					"sortOrder": "value-desc",
					"content": [
						{
							"label": "Alcohol",
							"value": 567,
							"color": "#FFA07A"
						},
						{
							"label": "Marijuana",
							"value": 730,
							"color": "#FA8072"
						},
						{
							"label": "Cocaine",
							"value": 126,
							"color": "#E9967A"
						},
						{
							"label": "Crack",
							"value": 210.5,
							"color": "#F08080"
						},
						{
							"label": "Heroin",
							"value": 1172.5,
							"color": "#CD5C5C"
						},
						{
							"label": "Hallucinogen",
							"value": 143,
							"color": "#DC143C"
						},
						{
							"label": "Inhalant",
							"value": 98.5,
							"color": "#B22222"
						},
						{
							"label": "Pain-Reliever",
							"value": 250,
							"color": "#FF0000"
						},
						{
							"label": "Oxycontin",
							"value": 237,
							"color": "#8B0000"
						},
						{
							"label": "Tranquilizer",
							"value": 199.5,
							"color": "#FF6347"
						},
						{
							"label": "Stimulant",
							"value": 529.5,
							"color": "#800000"
						},
						{
							"label": "Meth",
							"value": 539.5,
							"color": "#DB7093"
						},
						{
							"label": "Sedative",
							"value": 329.5,
							"color": "#FF4500"
						}
					]
				},
				"labels": {
					"outer": {
						"pieDistance": 36
					},
					"inner": {
						"hideWhenLessThanPercentage": 3
					},
					"mainLabel": {
						"font": "open sans",
						"color": "#1A1A1A",
						"fontSize": 16
					},
					"percentage": {
						"color": "#ffffff",
						"font": "open sans",
						"fontSize": 12,
						"decimalPlaces": 0
					},
					"value": {
						"color": "#adadad",
						"font": "open sans",
						"fontSize": 12
					},
					"lines": {
						"enabled": true
					},
					"truncation": {
						"enabled": true
					}
				},
				"tooltips": {
					"enabled": true,
					"type": "placeholder",
					"string": "{label}: {percentage}%"
				},
				"effects": {
					"pullOutSegmentOnClick": {
						"effect": "back",
						"speed": 400,
						"size": 20
					}
				},
				"misc": {
					"gradient": {
						"enabled": true,
						"percentage": 100
					}
				},
				"callbacks": {
					"onClickSegment": function(info) {
						var name = info.data.label.toLowerCase();
						console.log("click:", info.data.label);
						$('#pie-defs-container').show();
						$("#pie-instr").hide();
						$("#pie-definition").empty();
						$("#pie-definition-effects").empty();
						$("#pie-defs-header").empty();
						$("#pie-defs-effects-header").empty();
						$("#pie-defs-header").append(name.charAt(0).toUpperCase() + name.slice(1));
						$("#pie-defs-effects-header").append("Effects")
						$("#pie-definition").append("<span class='text-def'>" + drugDef[name]["how"] + "</span>");
						$("#pie-definition-effects").append("<span class='text-def'>" + drugDef[name]["effects"] + "</span>")
					}
				}
			});
			EXECUTED = true;
			d3.csv('https://raw.githubusercontent.com/UW-CSE442-WI20/FP-understanding-drug-abuse/master/static/definitions.csv').then(function(data) {
				data.forEach(function(d) {
					drugDef[d.name] = {};
					drugDef[d.name]["how"] = d.how;
					drugDef[d.name]["effects"] = d.effects;
				});
			});
			resetDef();
		}
		
	}
})();
