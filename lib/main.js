// moment.js makes `moment` global on the window (or global) object, while Meteor expects a file-scoped global variable
var SayCheese = this.SayCheese;
try {
    delete this.SayCheese;
	} catch (e) {
	}

//if (typeof Package !== 'undefined') {
//  /*global async:true*/  // Meteor.js creates a file-scope global for exporting. This comment prevents a potential JSHint warning.
//  var SayCheese = this.SayCheese();
//  delete this.SayCheese;
//}
