// Sone manipulation to allow the global SayCheese variable to be available to Meteor code
var SayCheese = this.SayCheese;
try {
    delete this.SayCheese;
	} catch (e) {
	}

