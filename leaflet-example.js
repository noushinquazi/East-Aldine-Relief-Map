var { LMap, LTileLayer, LMarker, LPopup, LControl } = Vue2Leaflet;


// event component
Vue.component('event-pin', {
	props: ["info", "loc"],
	components: {LMarker, LPopup},
	template: '<l-marker :lat-lng="loc"><l-popup>{{info}}</l-popup></l-marker>'}
);

/*
using address or clicking or st else to create event
what fields do we want when creating -- loc, date + time, about. (who else is going)
*/


//Display other info in popup

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
				//TODO check that event isnt a duplicate
				this.events.push({info: this.newEventname, loc: e.latlng});							
			}
			var latitude = e.latlng.lat;
			var longitude = e.latlng.lng;
			var part1 = 'https://docs.google.com/forms/d/e/1FAIpQLSfYCDZJFQZqp1VgA6fCYYUxQ8-2xgosAhGWv9h05OCa_DCbtg/viewform?entry.1633276536=';
			var part2 = '&entry.817343459=';
			var form_url = part1 + latitude + part2 + longitude;

			window.location.replace(form_url);

			this.$refs.map.mapObject.off("click");
			this.newEventname = "New Event"

		},
		fetch_data() {
			//load mock data
			// var url = "garbage"
			var url = "https://raw.githubusercontent.com/noushinquazi/East-Aldine-Relief-Map/map_branch/mock_data.json"
			fetch(url).then(response =>
				response.json().then(
					json => json["events"].map(
						event => this.events.push({info:event["info"], loc: [event["loc"][0], event["loc"][1]]})))
			, response => console.log("error loading json. Response received: ", response));
			console.log(this.events)	
		}

	}
});

