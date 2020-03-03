const d3pie = require('./d3pie')
class MyPie {
	constructor() {
		return new d3pie("pie-chart", {
			"header": {
				"title": {
					"fontSize": 24,
					"font": "open sans"
				},
				"subtitle": {
					"color": "#999999",
					"fontSize": 12,
					"font": "open sans"
				},
				"titleSubtitlePadding": 9
			},
			"footer": {
				"color": "#999999",
				"fontSize": 10,
				"font": "open sans",
				"location": "bottom-left"
			},
			"size": {
				"canvasWidth": 900,
				"pieOuterRadius": "90%"
			},
			"data": {
				"sortOrder": "value-desc",
				"content": [
					{
						"label": "Alcohol",
						"value": 567,
						"color": "#2383c1"
					},
					{
						"label": "Marijuana",
						"value": 730,
						"color": "#64a61f"
					},
					{
						"label": "Cocaine",
						"value": 126,
						"color": "#7b6788"
					},
					{
						"label": "Crack",
						"value": 210.5,
						"color": "#a05c56"
					},
					{
						"label": "Heroin",
						"value": 1172.5,
						"color": "#961919"
					},
					{
						"label": "Hallucinogen",
						"value": 143,
						"color": "#d8d239"
					},
					{
						"label": "Inhalant",
						"value": 98.5,
						"color": "#e98125"
					},
					{
						"label": "Pain-Reliever",
						"value": 250,
						"color": "#d0743c"
					},
					{
						"label": "Oxycontin",
						"value": 237,
						"color": "#635122"
					},
					{
						"label": "Tranquilizer",
						"value": 199.5,
						"color": "#6ada6a"
					},
					{
						"label": "Stimulant",
						"value": 529.5,
						"color": "#0b6197"
					},
					{
						"label": "Meth",
						"value": 539.5,
						"color": "#7c9058"
					},
					{
						"label": "Sedative",
						"value": 329.5,
						"color": "#207f32"
					}
				]
			},
			"labels": {
				"outer": {
					"pieDistance": 24
				},
				"inner": {
					"hideWhenLessThanPercentage": 3
				},
				"mainLabel": {
					"font": "open sans",
					"color": "#FAFAFA",
					"fontSize": 24
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
				"string": "{label}: {value}, {percentage}%"
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
			"callbacks":{
				"onClickSegment": function(info) {
					console.log("click:", info);

				}
			}
		});
	}

	sayHi() {
		console.log('[MyPie]', 'Hello World.');
	}
}

module.exports = MyPie;

class AgePie {
	constructor() {
		return new d3pie("mainChart", {
			"header": {
				"title": {
					"fontSize": 24,
					"font": "open sans"
				},
				"subtitle": {
					"color": "#999999",
					"fontSize": 12,
					"font": "open sans"
				},
				"titleSubtitlePadding": 9
			},
			"footer": {
				"color": "#999999",
				"fontSize": 10,
				"font": "open sans",
				"location": "bottom-left"
			},
			"size": {
				"canvasWidth": 640,
				"pieOuterRadius": "90%"
			},
			"data": {
				"sortOrder": "value-desc",
				"content": [
					{
						"label": "Alcohol",
						"value": 567,
						"color": "#2383c1"
					},
					{
						"label": "Marijuana",
						"value": 730,
						"color": "#64a61f"
					},
					{
						"label": "Cocaine",
						"value": 126,
						"color": "#7b6788"
					},
					{
						"label": "Crack",
						"value": 210.5,
						"color": "#a05c56"
					},
					{
						"label": "Heroin",
						"value": 1172.5,
						"color": "#961919"
					},
					{
						"label": "Hallucinogen",
						"value": 143,
						"color": "#d8d239"
					},
					{
						"label": "Inhalant",
						"value": 98.5,
						"color": "#e98125"
					},
					{
						"label": "Pain-Reliever",
						"value": 250,
						"color": "#d0743c"
					},
					{
						"label": "Oxycontin",
						"value": 237,
						"color": "#635122"
					},
					{
						"label": "Tranquilizer",
						"value": 199.5,
						"color": "#6ada6a"
					},
					{
						"label": "Stimulant",
						"value": 529.5,
						"color": "#0b6197"
					},
					{
						"label": "Meth",
						"value": 539.5,
						"color": "#7c9058"
					},
					{
						"label": "Sedative",
						"value": 329.5,
						"color": "#207f32"
					}
				]
			},
			"labels": {
				"outer": {
					"pieDistance": 32
				},
				"inner": {
					"hideWhenLessThanPercentage": 3
				},
				"mainLabel": {
					"font": "helvetica",
					"fontSize": 12
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
				"string": "{label}: {value}, {percentage}%"
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
			"callbacks":{
				"onClickSegment": function(info) {
					console.log("click:", info);

				}
			}
		});
	}
  
	sayHi() {
		console.log('[AgePie]', 'Hello World.');
	}
}