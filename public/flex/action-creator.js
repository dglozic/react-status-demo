/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2015. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

"use strict";

// TODO: require
var AppDispatcher = require("./dispatcher");

var ServiceConstants = require("./action-constants");

var ServiceActions = {
	fetchItems: function(data) {
		AppDispatcher.handleViewAction({
			actionType: ServiceConstants.FETCH_ITEMS,
			data: data
		});
	},
	serviceStatusUpdate: function(data) {
		AppDispatcher.handleViewAction({
			actionType: ServiceConstants.SERVICE_STATUS_UPDATE,
			data: data
		});
	}
};

module.exports = ServiceActions;
