export default class DateManager {
	constructor(stringDate) {
		this.date = stringDate ? new Date(stringDate) : new Date();
	}
	
	// set date
	setDate = str => {
		this.date = new Date(str);
	}
	
	// get date
	getDate = () => {
		return this.date;
	}
	
	// Lapse time from now to the date:
	lapseTime = str => {
		const date = new Date(str);
		const now = new Date();
		const diff = now - date;
		const sec = Math.floor(diff / 1000);
		const min = Math.floor(sec / 60);
		const hour = Math.floor(min / 60);
		const day = Math.floor(hour / 24);
		const week = Math.floor(day / 7);
		const month = Math.floor(week / 4);
		const year = Math.floor(month / 12);
		
		if (year > 0) {
			return `${year} year${year > 1 ? "s" : ""} ago`;
		} else if (month > 0) {
			return `${month} month${month > 1 ? "s" : ""} ago`;
		} else if (week > 0) {
			return `${week} week${week > 1 ? "s" : ""} ago`;
		} else if (day > 0) {
			return `${day} day${day > 1 ? "s" : ""} ago`;
		} else if (hour > 0) {
			return `${hour} hour${hour > 1 ? "s" : ""} ago`;
		} else if (min > 0) {
			return `${min} minute${min > 1 ? "s" : ""} ago`;
		} else {
			return `${sec} second${sec > 1 ? "s" : ""} ago`;
		}
	}
	
	formatDateTime = str => {
		const date = new Date(str);

		// get th, st, nd, rd for the date
		const day = date.getDate();
		const dayStr = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
		
		// format: 12th August 2021 at 12:00 PM
		return /* html */`
      <span class="date">${date.getDate()}${dayStr} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}</span>
    `;
	}

	getGreeting = () => {
		const date = new Date(Date.now());

		// Return greeting based on time
		if (date.getHours() < 12) {
			return "Good Morning";
		} else if (date.getHours() < 18) {
			return "Good Afternoon";
		} else {
			return "Good Evening";
		}
	}
}