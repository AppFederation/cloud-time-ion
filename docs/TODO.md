* ensure timers set on one device ring on another (reset timeouts on receiving timers list)
* Detect platform: don't alert or notify on android coz it blocks and prevents sound notif

Prepare for Sunday

* V set timer names
* V start/stop timer (allows templates like laundry)
* schedule notifs via cordova, with sound
  * test after killing app
  * button "+1 min"
* open ionic inertial picker
* timer-details layout

* schedule notifs via TS service, instead of notifying immediately
* login via google
* timer ended dialog
* separate running timers from non-running (templates)
  * 2/3 times bigger font for running timers
* Logo
  * top-left
  * app icon
* theme(s) (green / orange)
* preferences page (lazy loading)
  * as a tab
* fix negative times modulo being -1 instead of 0 (do math.abs if negative)
* better icon for plus FAB
* icon for running timers
