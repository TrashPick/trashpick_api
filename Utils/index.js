module.exports = {
	addMinutes: function(oldDate, minutes) {
		return new Date(oldDate.getTime() + minutes * 60000);
	}
};
