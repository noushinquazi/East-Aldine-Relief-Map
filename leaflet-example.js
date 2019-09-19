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
//data points in east aldine
// set default location and zoom


// App instance
new Vue({
	el: '#app',
	components: { LMap, LTileLayer, LControl },
	data:  {
		zoom:14,
		center: L.latLng(29.9276387, -455.333089),
		url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
		attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		events: [],		
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
			// var url = "garbage"
			var url = "https://raw.githubusercontent.com/noushinquazi/East-Aldine-Relief-Map/map_branch/mock_data.json"
			fetch(url).then(response =>
				response.json().then(json => json["events"].map(event => this.events.push({info:event["info"], loc: [event["loc"][0], event["loc"][1]]})))
			, response => console.log("error loading json. Response received: ", response));
			
		}
	}
});



