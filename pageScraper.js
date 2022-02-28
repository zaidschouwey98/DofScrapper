const scraperObject = {
  url: `https://www.dofus-touch.com/fr/mmorpg/encyclopedie/equipements?size=96&page=`,
  async scraper(browser) {
    let scrapedData = [];
    
    for (let index = 1; index < 84; index++) {
		let page = await browser.newPage();
      this.url = `https://www.dofus-touch.com/fr/mmorpg/encyclopedie/equipements?page=${index}`;
      console.log(`Navigating to ${this.url}...`);
      await page.goto(this.url);

      // Wait for the required DOM to be rendered
      await page.waitForSelector("table");
      // Get the link to all the required books
      let urls = await page.$$eval("tbody tr", (links) => {
        // Make sure the book to be scraped is in stock
        // links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
        // Extract the links from the data
        links = links.map((el) => el.querySelector("span > a").href);
        return links;
      });

      // Loop through each of those links, open a new page instance and get the relevant data from them
      let pagePromise = (link) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let newPage = await browser.newPage();

          await newPage.goto(link);
          try {
            let is404 = await newPage.$eval(
              ".ak-404",
              (text) => text.textContent
            );
            if (is404) {
              resolve(dataObj);
              await newPage.close();
            }
          } catch (error) {}
          dataObj["name"] = await newPage.$eval(
            ".ak-return-link",
            (text) => text.innerText
          );
          dataObj["type"] = await newPage.$eval(
            ".ak-encyclo-detail-type > span",
            (text) => text.textContent
          );
          dataObj["lvl"] = await newPage.$eval(
            ".ak-encyclo-detail-level",
            (text) => text.textContent
          );
			try {
				
			
          dataObj["statistics"] = await newPage.$$eval(
            ".ak-encyclo-detail-right .ak-content-list > .ak-list-element",
            (elements) => {
              // Extract the links from the data
              elements = elements.map((el) => {
                let element = {};
                let valueRegex = /-?[0-9]\d*(\.\d+)?/g;
                let value = el
                  .querySelector(".ak-title")
				  .innerHTML.match(valueRegex);
				

                const elementsName = [
                  "Vitalité",
                  "Agilité",
                  "Chance",
                  "Coups Critiques",
                  "Force",
                  "Intelligence",
                  "Invocations",

                  "% Résistance Air",
                  "% Résistance Air JCJ",
                  "% Résistance Eau",
                  "% Résistance Eau JCJ",
                  "% Résistance Feu",
                  "% Résistance Feu JCJ",
                  "% Résistance Neutre",
                  "% Résistance Neutre JCJ",
                  "% Résistance Terre",
                  "% Résistance Terre JCJ",
                  "CC sur le sort",
                  "Dommages sur le sort",
                  "Soins sur le sort",
                  "Augmente de le nombre de lancer maximal par cible du sort",
                  "Augmente de le nombre de lancer maximal par tour du sort",
                  "Augmente la PO du sort de",
                  "Augmente les dégâts de base du sort de",
                  "Change les paroles",

                  "Dommages Air",
                  "Dommages Critiques",
                  "Dommages Eau",
                  "Dommages Feu",
                  "Dommages Neutre",
                  "Dommages Pièges",
                  "Dommages Poussée",
                  "Dommages Terre",
                  "Dommages",
                  "Désactive la ligne de vue du sort",
                  "Désactive le lancer en ligne du sort",
                  "Esquive PA",
                  "Esquive PM",
                  "Fuite",
                  "Initiative",
                  "Lance le sort au debut du combat",
                  "Lié au personnage",
                  "Nombre de victimes :",
                  "Permet d'utiliser l'attitude",
                  "Permet l'utilisation du sort:",
                  "Pods",
                  "Prospection",
                  "Puissance (pièges)",
                  "Puissance",

                  "Quelqu'un vous suit !",
                  "Rang",
                  "Rend la portée du sort modifiable",
                  "Renvoie dommages",
                  "Retrait PA",
                  "Retrait PM",
                  "Réduit de le coût en PA du sort",
                  "Réduit de le délai de relance du sort",
                  "PA",
                  "PM",
                  "PO",
                  "Résistance Air",
                  "Résistance Critiques",
                  "Résistance Eau",
                  "Résistance Feu",
                  "Résistance Neutre",
                  "Résistance Poussée",
                  "Résistance Terre",
                  "Résistance",
                  "Sagesse",
                  "Soins",
                  "Tacle",
                ];
                let founded = false;
                elementsName.forEach((elementName) => {
                  let regex = new RegExp(elementName);
                  if (
                    regex.test(el.querySelector(".ak-title").innerHTML) &&
                    !founded
                  ) {
                    founded = true;
					let minmax = {};
					if(parseFloat(value[0])<0)
						value[1] = "-"+ value[1];
                    minmax.min = value[0];
                    minmax.max = value[1] ? value[1] : "";
                    element[elementName] = {};
                    element[elementName] = minmax;
                  }
                });
                return element;
              });
              return elements;
            }
          );
		} catch (error) {
				
		}
          resolve(dataObj);
          await newPage.close();
        });

      for (link in urls) {
        let currentPageData;
        try {
          currentPageData = await pagePromise(urls[link]);
          scrapedData.push(currentPageData);
        } catch (error) {}
      }
      await page.close();
    }
    return scrapedData;
  },
};

module.exports = scraperObject;
