const scrapeIt = require("scrape-it");

// Promise interface
// scrapeIt("http://ionicabizau.net", {
//     title: ".header h1"
//   , desc: ".header h2"
//   , avatar: {
//         selector: ".header img"
//       , attr: "src"
//     }
// }).then(page => {
//     console.log(page);
// });


//
// // Callback interface
scrapeIt("https://www.washingtonpost.com/", {
    // Fetch the articles
    articles: {
        listItem: ".full .pb-feature"
      , data: {
          title: ".headline > a"
        , content: ".blurb"
        , url: {
              selector: ".headline > a"
            , attr: "href"
          }
      }
    }

}, (err, page) => {
    console.log(err || page);
});
