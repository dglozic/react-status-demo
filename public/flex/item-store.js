/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2015. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

"use strict";

// Modules

var Constants = require("./action-constants");
var EventEmitter = require("events").EventEmitter;

// Globals

var AppDispatcher = require("./dispatcher");
var XhrUtils = require("./xhr-util");

var EVENT_CHANGE = "items";
var items;
var emitter = new EventEmitter();
var listeningForSocket = false;

// Public Methods ------------------------------------------------------------->

var ItemStore = {

	getItems: function(type) {
		return items;
	},

	emitChange: function(data) {
		emitter.emit(EVENT_CHANGE, data);
	},

	addChangeListener: function(callback) {
		emitter.on(EVENT_CHANGE, callback);
	},

	removeChangeListener: function(callback) {
		emitter.removeListener(EVENT_CHANGE, callback);
	}

};

module.exports = ItemStore;

// Private Methods ------------------------------------------------------------>

function fetchItems(url) {
	if (!url) {
		console.warn("Cannot fetch items - no URL provided");
		return;
	}

	// Fetch content
	XhrUtils.doXhr({url: url, json: true}, [200], function(err, result) {
		if (err) {
			console.warn("Error fetching assets from url: " + url);
			ItemStore.emitChange(Constants.STATE_ERROR);
			return;
		}

		items = result;
		ItemStore.emitChange(Constants.ITEMS);
	});
}

function serviceStatusUpdate(data) {
	for (var i in data) {
		var s = data[i];
		_updateStatus(s);
	}
	ItemStore.emitChange(Constants.ITEMS);
}

function _updateStatus(s) {
	for (var i in items) {
		var item = items[i];
		if (item.id===s.id) {
			item.status = s.status;
			break;
		}
	}
}

// Dispatcher ------------------------------------------------------------>

// Register dispatcher callback
AppDispatcher.register(function(payload) {
	var action = payload.action;

	// Define what to do for certain actions
	switch (action.actionType) {
		case Constants.SERVICE_STATUS_UPDATE:
			serviceStatusUpdate(action.data);
			break;
		case Constants.FETCH_ITEMS:
			fetchItems(action.data);
			break;
		default:
			return true;
	}

	return true;

});

