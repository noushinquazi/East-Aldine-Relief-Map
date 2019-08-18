var { LMap, LTileLayer, LMarker, LPopup, LControl } = Vue2Leaflet;


// event component
Vue.component('event-pin', {
	props: ["info", "loc"],
	components: {LMarker, LPopup},
	template: '<l-marker :lat-lng="loc"><l-popup>{{info}}</l-popup></l-marker>'}
);

// Load events from DB

// App instance
new Vue({
	el: '#app',
	components: { LMap, LTileLayer, LControl },
	data:  {
		zoom:13,
		center: L.latLng(47.413220, -1.219482),
		url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
		attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		events: [
			{info: "event 1", loc: L.latLng(47.413820, -1.219582)},
			{info: "event 2", loc: L.latLng(47.414120, -1.219382)},
			{info: "event 3", loc: L.latLng(47.413220, -1.219482)}
		]
	},
	methods: {
		listenEventLoc(e) {
			console.log("wix test");
			if (confirm("add event? click on desired location")) {
				this.$refs.map.mapObject.on("click", this.trackEventLoc);
			}
		},
		trackEventLoc(e) {
			console.log(e)
			if (confirm("creat event at this location? "+e.latlng.lat+", "+e.latlng.lng)) {
				this.events.push({info: "new event", loc: e.latlng});							
			}
			this.$refs.map.mapObject.off("click");
		}
	}
});


