const pageScraper = require('./pageScraper');
const fs = require('fs');
async function scrapeAll(browserInstance){
	let browser;
	try{
		browser = await browserInstance;
		let scrapedData = {};
		for (let index = 20; index < 22; index++) {
			try {
				scrapedData = await pageScraper.scraper(browser,index);	
			} catch (error) {
				console.log(error)
			}
			

			fs.writeFile(`./page_data/data${index}.json`, JSON.stringify(scrapedData), 'utf8', function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("The data has been scraped and saved successfully! View it at './data.json'");
			});
			
		}
		
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance) => scrapeAll(browserInstance)