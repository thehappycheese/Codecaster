"use strict";

//This is a mixin class to allow objects to deal with events better
define(function () {

	function eclass() {

		this.events = {};

		this.on = (function (eventName, eventFunction) {
			if (typeof eventName !== "string" || typeof eventFunction !== "function") {
				console.log("Invalid event registration, " + eventName);
				return;
			}
			if (this.events[eventName] === undefined) {
				this.events[eventName] = [];
			}
			this.events[eventName].push(eventFunction);
		}).bind(this);

		this.clearListeners = (function (eventName) {
			if (this.events[eventName] !== undefined) {
				this.events[eventName] = [];
			}
		}).bind(this);

		this.dispatch = (function (eventName, eventData) {
			if (this.events[eventName] !== undefined) {
				for (var i = 0; i < this.events[eventName].length; i++) {
					this.events[eventName][i](eventData);
				}
			} else {
				//fail quietly, like a fish.
			}
		}).bind(this);

	}

	return eclass;
});
