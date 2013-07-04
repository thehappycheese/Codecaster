"use strict";

//This is a mixin class to allow objects to deal with events better
function EventDispatcher() {

	this.events = {};

	this.on = (function (eventName, eventFunction) {
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
		if(this.events[eventName] !== undefined){
			this.events[eventName](eventData);
		}else{
			//fail quietly, like a fish.
		}
	}).bind(this);

}
