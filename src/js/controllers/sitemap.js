
export default class SitemapController {
	constructor(){
		this.process();
	}
	
	process(){
		console.log("Hello from controller?");
		$(document).ready(function(){
			let controller = this;
			// $('#sitemapTable').DataTable({
			// 	"ajax": {
			// 		"dataType": "xml",
			// 		"url": "./sitemap.xml",
			// 		"dataSrc": function(xmlData){
			// 			return convert.xml2json(xmlData, {compact:true, spaces:4});
			// 		}
			// 	},
			// 	retrieve: true,
			// 	sAjaxDataProp: ""
			//	
			// });
			let xml;
			$.ajax({
				type: "GET",
				url: "./sitemap.xml",
				dataType: "xml",
				success: function(response){
					xml = response;
					let json = xmlToJson(xml);
					console.log("hello?");
					console.log(json);
					console.log(json.urlset.url);
					$('#sitemapTable').DataTable({
						"data": json.urlset.url,
						"columns" :[
							{ "data" : "loc.#text"},
							{ "data" : "lastmod.#text"},
							{ "data" : "changefreq.#text"},
							{ "data" : "priority.#text"}
						]
					});				
					
					
					function 	xmlToJson(xml) {
						
						// Create the return object
						var obj = {};
						
						if (xml.nodeType == 1) { // element
							// do attributes
							if (xml.attributes.length > 0) {
								obj["@attributes"] = {};
								for (var j = 0; j < xml.attributes.length; j++) {
									var attribute = xml.attributes.item(j);
									obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
								}
							}
						} else if (xml.nodeType == 3) { // text
							obj = xml.nodeValue;
						}
						
						// do children
						if (xml.hasChildNodes()) {
							for(var i = 0; i < xml.childNodes.length; i++) {
								var item = xml.childNodes.item(i);
								var nodeName = item.nodeName;
								if (typeof(obj[nodeName]) == "undefined") {
									obj[nodeName] = xmlToJson(item);
								} else {
									if (typeof(obj[nodeName].push) == "undefined") {
										var old = obj[nodeName];
										obj[nodeName] = [];
										obj[nodeName].push(old);
									}
									obj[nodeName].push(xmlToJson(item));
								}
							}
						}
						return obj;
					};
				}
			});
		});
	}
	
	

	
	
}