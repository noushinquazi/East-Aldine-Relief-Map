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
//data points in east aldine
// set default location and zoom


//Display other info in popup

//Form to input 
//

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
			var payload = {
			  'lat': latitude,
			  'long': longitude
			};
			var loc_form = document.createElement('form');
			loc_form.style.visibility = 'hidden'; // no user interaction is necessary
			loc_form.method = 'GET'; // forms by default use GET query strings
			loc_form.action = 'form.html';
			console.log(payload);
			console.log(Object.keys(payload));
			Object.keys(payload).forEach(function(key) {
				var input = document.createElement('input');
			  input.name = key;
			  input.value = payload[key];
			  loc_form.appendChild(input); // add key/value pair to form
			})

			document.body.appendChild(loc_form); // forms cannot be submitted outside of body
			console.log(document.body);
			loc_form.submit(); // send the payload and navigate


			this.$refs.map.mapObject.off("click");
			this.newEventname = "New Event"

			//TODO get the post params and pre - fill in the form fields.
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



