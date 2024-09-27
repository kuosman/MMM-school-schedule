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
        updateInterval: 1 * 60 * 60 * 1000, // 1 hour
        fadeSpeed: 4000,
        large: false,
    },

    requiresVersion: '2.1.0', // Required version of MagicMirror

    /**
     * Get styles
     *
     * @function getStyles
     * @returns {Array} styles array
     */
    getStyles: function () {
        return [this.file('css/styles.css')];
    },

    /**
     * Get translations
     *
     * @function getTranslations
     * @returns {Array} translations jsons
     */
    getTranslations: function () {
        return {
            en: 'translations/en.json',
            fi: 'translations/fi.json',
        };
    },

    /**
     * Start module after all modules have been loaded
     * by the MagicMirror framework
     *
     * @function start
     */
    start: function () {
        // Schedule update timer.
        var self = this;
        setInterval(function () {
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
    getHeader: function () {
        var header = this.data.header;
        return header;
    },

    getValidFirstSchedule: function () {
        const schedules = this.config.schedules;
        let validSchedule = null;

        if (schedules) {
            const currentDay = moment();
            validSchedule = schedules.find((schedule) => {
                return !schedule.valid
                    ? schedule
                    : schedule.valid.from && schedule.valid.to
                    ? moment(schedule.valid.from).isSameOrBefore(currentDay) &&
                      moment(schedule.valid.to).isSameOrAfter(currentDay)
                    : schedule.valid.from
                    ? moment(schedule.valid.from).isSameOrBefore(currentDay)
                    : schedule.valid.to
                    ? moment(schedule.valid.to).isSameOrAfter(currentDay)
                    : true;
            });
        }
        return validSchedule;
    },

    /**
     * Get dom
     *
     * @function getDom
     * @returns {object} html wrapper
     */
    getDom: function () {
        const self = this;
        const schedule = this.getValidFirstSchedule();
        if (!schedule) {
            return document.createElement('div');
        }

        const date = this.getDisplayDate();

        // get day of week
        const dow = date.locale('en').format('dd').toLowerCase();
        const days = schedule.days;
        const times = schedule.times;

        var wrapper = document.createElement('table');
        wrapper.className = 'school-schedule-table';

        // Create header
        const thead = document.createElement('thead');
        const thead_tr = document.createElement('tr');
        const thead_tr_th_clock = document.createElement('th');
        thead_tr_th_clock.appendChild(
            document.createTextNode(this.translate('clock'))
        );
        thead_tr_th_clock.className =
            'school-schedule-th' + (self.config.large ? ' large' : '');
        thead_tr.appendChild(thead_tr_th_clock);

        // Create body
        const tbody = document.createElement('tbody');

        const weekdaysEn = moment.localeData('en-us').weekdaysMin();
        const weekdaysCurrentLoc = moment.weekdaysMin();

        // Create weekdays
        weekdaysEn.forEach((day, index) => {
            const lowerCaseDay = day.toLowerCase();
            if (days[lowerCaseDay]) {
                const localeDay = weekdaysCurrentLoc[index];
                const thead_tr_th_day = document.createElement('th');

                thead_tr_th_day.className =
                    'school-schedule-th' + (self.config.large ? ' large' : '');
                thead_tr_th_day.appendChild(
                    document.createTextNode(localeDay.toUpperCase())
                );
                thead_tr.appendChild(thead_tr_th_day);
            }
        });

        // Create times
        times.forEach((t, i) => {
            const tbody_tr = document.createElement('tr');
            const tbody_tr_td = document.createElement('td');
            tbody_tr_td.className =
                'school-schedule-td' +
                (self.config.large ? ' large bright' : ' bright');
            tbody_tr_td.appendChild(document.createTextNode(t.toUpperCase()));
            tbody_tr.appendChild(tbody_tr_td);

            weekdaysEn.forEach((day) => {
                const lowerCaseDay = day.toLowerCase();
                if (days[lowerCaseDay]) {
                    const d = days[lowerCaseDay];
                    const text = d[i] || '';
                    const tbody_tr_td_day = document.createElement('td');
                    const activeClass = lowerCaseDay === dow ? 'active' : '';
                    tbody_tr_td_day.className =
                        'school-schedule-td' +
                        (self.config.large ? ' large bright ' : ' bright ') +
                        activeClass;
                    tbody_tr_td_day.appendChild(document.createTextNode(text));
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
    getDisplayDate: function () {
        var threshold = moment().endOf('day');

        // get the current time and increment by one day if threshold time has passed
        var now = moment();
        if (now.isAfter(threshold)) {
            now = now.add(1, 'day');
        }

        return now;
    },

    /**
     * Get script files
     *
     * @returns {Array} script files
     */
    getScripts: function () {
        return ['moment.js'];
    },
});
