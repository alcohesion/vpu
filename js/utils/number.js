export default class NumberManager {
	constructor() {
		console.log("NumberManager");
	}
	
	formatNumber(number, locale, options) {
		return new Intl.NumberFormat(locale, options).format(number);
	}
	
	formatCurrency(number, locale, currency) {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currency
		}).format(number);
	}
	
	shortenNumber = str => {
		try {
			const num = parseInt(str);
			
			// less than a thousand: return the number
			if (num < 1000) return num;
			
			// less than a 10,000: return the number with a k with two decimal places
			if (num < 10000) return `${(num / 1000).toFixed(2)}k`;
			
			// less than a 100,000: return the number with a k with one decimal place
			if (num < 100000) return `${(num / 1000).toFixed(1)}k`;
			
			// less than a million: return the number with a k with no decimal places
			if (num < 1000000) return `${Math.floor(num / 1000)}k`;
			
			// less than a 10 million: return the number with an m with two decimal places
			if (num < 10000000) return `${(num / 1000000).toFixed(2)}M`;
			
			// less than a 100 million: return the number with an m with one decimal place
			if (num < 100000000) return `${(num / 1000000).toFixed(1)}M`;
			
			// less than a billion: return the number with an m with no decimal places
			if (num < 1000000000) return `${Math.floor(num / 1000000)}M`;
			
			// a billion or more: return the number with a B+
			if (num >= 1000000000) return `${Math.floor(num / 1000000000)}B+`;
			
			// else return the zero
			return '0';
		} catch (error) {
			return '0';
		}
	}

	shorten = str => {
		try {
			const num = parseInt(str);
			
			// less than a thousand: return the number
			if (num < 1000) return num;
			
			// less than a 10,000: return the number with a k with two decimal places
			if (num < 10000) return `${Math.floor(num / 1000)}k`;
			
			// less than a 100,000: return the number with a k with one decimal place
			if (num < 100000) return `${Math.floor(num / 1000)}k`;
			
			// less than a million: return the number with a k with no decimal places
			if (num < 1000000) return `${Math.floor(num / 1000)}k`;
			
			// less than a 10 million: return the number with an m with two decimal places
			if (num < 10000000) return `${(num / 1000000).toFixed(2)}M`;
			
			// less than a 100 million: return the number with an m with one decimal place
			if (num < 100000000) return `${Math.floor(num / 1000000)}M`;
			
			// less than a billion: return the number with an m with no decimal places
			if (num < 1000000000) return `${Math.floor(num / 1000000)}M`;
			
			// a billion or more: return the number with a B+
			if (num >= 1000000000) return `${Math.floor(num / 1000000000)}B+`;
			
			// else return the zero
			return '0';
		} catch (error) {
			return '0';
		}
	}
	
	withCommas = num => {
		const parts = num.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	}

	withCommasWithoutDecimals = num => {
		let x = parseFloat(num).toFixed(0);
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	balanceWithCommas = (str) => {
		try {
			let x = parseFloat(str).toFixed(2);

			// if x is NaN, return 0.00
			if (isNaN(x)) return '0.00';

			// return the number with two decimal places with commas
			let parts = x.toString().split(".");
    	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    	return parts.join(".");
		} catch (error) {
			return '0.00';
		}
	}

	format = (num, decimal = 2) => {
		try {
			// return the number with the specified decimal places
			return parseFloat(num).toFixed(decimal);
		} catch (error) {
			return `0.${'0'.repeat(decimal)}`;
		}
	}
	
	parse = (str) => {
		try {
			let x  = parseFloat(str);
			// if x is NaN, return 0
			if (isNaN(x)) return 0;
			// else return x
			return x;
		} catch (error) {
			return 0;
		}
	}

	parseInteger = (str) => {
		try {
			let x  = parseInt(str);
			// if x is NaN, return 0
			if (isNaN(x)) return 0;
			// else return x
			return x;
		} catch (error) {
			return 0;
		}
	}

	intWithCommas = (num) => {
		try {
			// return the number with commas
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		} catch (error) {
			return '0';
		}
	}
}