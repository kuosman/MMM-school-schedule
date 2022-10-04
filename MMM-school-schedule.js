/* eslint-disable prettier/prettier */
/* global Module */

/*
 * Magic Mirror
 * Module: MMM-school-schedule
 *
 *
 *  By Marko Kuosmanen http://github.com/kuosman
 *  MIT Licenced.
 */
Module.register('MMM-school-schedule', {
	// Default module config
	defaults: {
		updateInterval: 1 * 60 * 60 * 1000,     // 1 hour
		fadeSpeed: 4000
	},

	requiresVersion: '2.1.0', // Required version of MagicMirror

	/**
	 * Get styles
	 *
	 * @function getStyles
	 * @returns {Array} styles array
	 */
	getStyles: function () {
		return [
		  this.file('MMM-school-schedule.css')
		];
	},

	/**
	 * Get translations
	 *
	 * @function getTranslations
	 * @returns {Array} translations jsons
	 */
	getTranslations: function() {
		return {
			en: 'translations/en.json',
			fi: 'translations/fi.json'
		};
	},

	/**
	 * Start module after all modules have been loaded
	 * by the MagicMirror framework
	 *
	 * @function start
	 */
	start: function() {
		// Schedule update timer.
		var self = this;
		setInterval(function() {
			self.updateDom(self.config.fadeSpeed);
		}, this.config.updateInterval);

		this.loaded = true;
	},

	/**
	 * Create the module header.
	 *
	 * @function getHeader
	 * @returns {string} header
	 */
	getHeader: function() {
		var header = this.data.header;
		return header;
	},

	/**
	 * Get dom
	 *
	 * @function getDom
	 * @returns {object} html wrapper
	 */
	getDom: function() {
		var date = this.getDisplayDate();

		// get day of week
		var dow = date.locale('en').format('dd').toLowerCase();
		var days = this.config.schedule.days;
		var times = this.config.schedule.times;

		var wrapper = document.createElement('table');
		wrapper.className = 'school-schedule-table';

		// Create header
		var thead = document.createElement('thead');
		var thead_tr = document.createElement('tr');
		var thead_tr_th_clock = document.createElement('th');
		thead_tr_th_clock.appendChild(
			document.createTextNode(this.translate('clock'))
		);
		thead_tr_th_clock.className = 'school-schedule-th bright';
		thead_tr.appendChild(thead_tr_th_clock);

		// Create body
		var tbody = document.createElement('tbody');

		var weekdaysEn = moment.localeData('en-us').weekdaysMin();
		var weekdaysCurrentLoc = moment.weekdaysMin();
		console.log(weekdaysEn, weekdaysCurrentLoc);

		// Create weekdays
		weekdaysEn.forEach((day, index) => {
			var lowerCaseDay = day.toLowerCase();
			if (days[lowerCaseDay]) {
				var localeDay = weekdaysCurrentLoc[index];
				var thead_tr_th_day = document.createElement('th');

				thead_tr_th_day.className = 'school-schedule-th bright';
				thead_tr_th_day.appendChild(
					document.createTextNode(localeDay.toUpperCase())
				);
				thead_tr.appendChild(thead_tr_th_day);
			}
		});

		// Create times
		times.forEach((t,i) => {
			var tbody_tr = document.createElement('tr');
			var tbody_tr_td = document.createElement('td');
			tbody_tr_td.className = 'school-schedule-td bright';
			tbody_tr_td.appendChild(
				document.createTextNode(t.toUpperCase())
			);
			tbody_tr.appendChild(tbody_tr_td);

			weekdaysEn.forEach(day => {
				var lowerCaseDay = day.toLowerCase();
				if (days[lowerCaseDay]) {
					var d = days[lowerCaseDay];
					var text = d[i] || '';
					var tbody_tr_td_day = document.createElement('td');
					var activeClass = lowerCaseDay === dow ? 'active' : '';
					tbody_tr_td_day.className = 'school-schedule-td bright ' + activeClass;
					tbody_tr_td_day.appendChild(
						document.createTextNode(text)
					);
					tbody_tr.appendChild(tbody_tr_td_day);
				}
			});
			tbody.appendChild(tbody_tr);
		});

		thead.appendChild(thead_tr);
		wrapper.appendChild(thead);
		wrapper.appendChild(tbody);

		return wrapper;
	},

	/**
	 * Get display date
	 *
	 * @function getDisplayDate
	 * @returns {object} date
	 */
	getDisplayDate: function() {
		var threshold = moment().endOf('day');

		// get the current time and increment by one day if threshold time has passed
		var now  = moment();
		if(now.isAfter(threshold)) {
			now = now.add(1, 'day');
		}

		return now;
	},

	/**
	 * Get script files
	 *
	 * @returns {Array} script files
	 */
	getScripts: function() {
		return ['moment.js'];
	}

});
