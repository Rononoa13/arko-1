domain/
What does our application mean?
For example:
What is a beer event?
What is a water event?
How do we count beers?

storage/
How do we save and retrieve events?
IndexedDB

ui/
How do we display things?
Buttons, counters, timeline, etc.
It shouldn’t need to know how IndexedDB works.

app.js

This is the composition/wiring layer.
It connects everything:
UI
 ↓
Application/domain logic
 ↓
Storage
“When the user does X, call Y, then update Z.”