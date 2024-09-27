# Module for [MagicMirror](https://magicmirror.builders/): School schedule

The `MMM-school-schedule` module shows school schedule.


## Screenshot

- School schedule

![School schedule screenshot](screenshot.png)

## Using the module

1) Clone this repository under `MagicMirror/modules` folder
2) Run `npm install` in `MagicMirror/modules/MMM-school-schedule` folder
3) Add to the modules array in the `MagicMirror/config/config.js` file:
```javascript
modules: [
	{
		module: "MMM-school-schedule",
		position: "top_left",
		header: "School schedule",
		config: {
			schedules: [{
				times: [ "08:30 - 09:15", "09:15 - 10:00", "10:30 - 12:15", "12:30 - 13:15"],
				days: {
					mo: [ "A", "X", "B", "B" ],
					tu: [ "X", "X", "X", "" ],
					we: [ "", "X", "X", "A" ],
					th: [ "", "X", "X", "B" ],
					fr: [ "A", "X", "X", "X" ]
				},
				valid: { // optional
					from: '2023-04-18 08:00:00', // valid from
					to: '2023-05-18 16:00:00' // valid to
				}
			}],
			updateInterval: 1 * 60 * 60 * 1000, // every hour
			large: false
		}
	}]
```

## Configuration options

The following properties can be configured:


| Option                       	| Description
| -----------------------------	| -----------
| `schedules`					| Schedules Array of Schedule Object(s), contains `times`, `days` keys and optionally also `valid` Object with optional `from` and/or `to` keys.
|								| Schedule Object: <table><tr><td>`times`</td><td>Times String array</td></tr><tr><td>`days`</td><td>Days keys and String array of lessons. Days can be `mo`, `tu`, `we `, `th`, `fr`, `sa` or `su`. And value is Array of lessons (same length. than times Array)</td></tr><tr><td>`valid`</td><td>When schedule is valid. Object contains `from` or `to` keys or both `from` and `to` keys. <table><tr><td>`from`</td><td>Optional start time when schelude is valid, format `yyyy-mm-dd hh:mm:ss`</td></tr><tr><td>`to`</td><td>Optional end time when schelude is valid, format `yyyy-mm-dd hh:mm:ss`</td></tr></table></td></table>
| `updateInterval`				| Update interval in milliseconds, default `1800000`
| `large`						| `false` 							|  Need to use larger experience ?
