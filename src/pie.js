var pie;
(function(){
	executePie = function() {
		pie = new d3pie("pie-chart", {
			"header": {
				"title": {
					"text": "Average Annual Dosage Distribution",
					"fontSize": 28,
					"font": "open sans"
				},
				"subtitle": {
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
				"canvasWidth": 900,
				"canvasHeight": 600,
				"pieOuterRadius": "70%"
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
					console.log("click:", info);
				}
			}
		});	
	}
})();
