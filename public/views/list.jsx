/*-------------------------------------------------------------------------------------------------------------------*\
|  Copyright (C) 2016 dejanglozic.com
|  Modified from the original react-engine example by PayPal (see react-engine for details)                           |
|                                                                                                                     |
|  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance     |
|  with the License.                                                                                                  |
|                                                                                                                     |
|  You may obtain a copy of the License at                                                                            |
|                                                                                                                     |
|       http://www.apache.org/licenses/LICENSE-2.0                                                                    |
|                                                                                                                     |
|  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed   |
|  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for  |
|  the specific language governing permissions and limitations under the License.                                     |
\*-------------------------------------------------------------------------------------------------------------------*/

'use strict';

var React = require('react');
var Router = require('react-router');
var ItemStore = require('../flex/item-store');
var ActionCreator = require('../flex/action-creator');
var ActionConstants = require('../flex/action-constants');

module.exports = React.createClass({
  getInitialState: function() {
    return { loading: true, items: [] };
  },

  componentDidMount: function() {
    ItemStore.addChangeListener(this._handleAssetsChanged);
    ActionCreator.fetchItems("/api/items");
  },

  componentWillUnmount: function() {
    ItemStore.removeChangeListener(this._handleAssetsChanged);
  },

  _handleAssetsChanged: function(type) {
    if(type === ActionConstants.STATE_ERROR) {
      this.setState({
        error: "Error while loading servers"
      });
    } else {
      this.setState({
        loading: false,
        error: null,
        items: ItemStore.getItems() || []
      });
    }
  },

  render: function render() {
    var loading;
    var items;
    var error;

    if (this.state.loading) {
      loading = (
        <div className="items-loading"><div className="LoadingSpinner-dark"></div></div>
      );
    }
    else {
      items = (
        <ul>
          {this.state.items.map(function(item) {
            var statusClass = "status-indicator";
            if (item.status==="active")
              statusClass+= " status-active";
            else if (item.status==="error")
              statusClass+= " status-error";
            else
              statusClass+= " status-loading";
            return (
              <li className="service-card" key={item.id}>
                <div className="service-card-status"><div className={statusClass}/></div>
                <div className="service-card-name">{item.title}</div>
                <div className="service-card-type">{item.dist}</div>
              </li>
            );
          })}
        </ul>
      );
    }
    if (this.state.error) {
      error = (
        <div className="error-box">{this.state.error}</div>
      );
    }

    return (
      <div id='list'>
        <h1>Servers</h1>
        <p>This list shows currently available servers and their status (
          <span className="text-loading">gray</span> - loading,&nbsp; 
          <span className="text-active">green</span> - active,&nbsp; 
          <span className="text-error">red</span> - error)</p>
        {loading}
        {items}
        {error}
      </div>
    );
  }
});
