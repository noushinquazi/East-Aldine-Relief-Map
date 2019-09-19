var { LMap, LTileLayer, LMarker, LPopup, LControl } = Vue2Leaflet;


// event component
Vue.component('event-pin', {
	props: ["info", "loc"],
	components: {LMarker, LPopup},
	template: '<l-marker :lat-lng="loc"><l-popup>{{info}}</l-popup></l-marker>'}
);

// Load events from DB - the data str
// adding event enter name -- should it be a form with details or should they just enter it immediately
/*
using address or clicking or st else to create event
what fields do we want when creating -- loc, date + time, about. (who else is going)
*/

//on startup -- request all the data from backend -- component mounting lifecycle --(for run on startup)

//mock get data function - function to request something from backend - how do and where put
//data points in east aldine
// set default location and zoom


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
			// {info: "event simran", loc: L.latLng(47.413820, -1.219582)},
			// {info: "event 2", loc: L.latLng(47.414120, -1.219382)},
			// {info: "event 3", loc: L.latLng(47.413220, -1.219482)}
		],
		newEventname: "New event"
	},
	mounted: function() {this.fetch_data()},
	methods: {
		listenEventLoc(e) {
			console.log("wix test");
			var newEventname = prompt("Please enter event name", "New event")
			if (newEventname != null) {
				this.newEventname = newEventname

				if (confirm("add event? click on desired location")) {
					this.$refs.map.mapObject.on("click", this.trackEventLoc);
				}	
			}
			
		},
		trackEventLoc(e) {
			console.log(e)
			if (confirm("create event at this location? "+e.latlng.lat+", "+e.latlng.lng)) {
				//check that event isnt a duplicate
				this.events.push({info: this.newEventname, loc: e.latlng});							
			}
			this.$refs.map.mapObject.off("click");
			this.newEventname = "New Event"

			//add to database of events
		},
		fetch_data() {
			//load mock data
			var url = "https://gist.githubusercontent.com/stevenkuipers/1c0284ce4bb8a25a634613c37b60a333/raw/5de5c6d77ef3879474bd7e9a0dce70d032c2ca17/placeholder.json"
			fetch(url).then(function(response) {
				response.json().then(function(json) {
					console.log("recevied json", json)

				});

			}, response => console.log("error loading json", response));
		}
	}
});



