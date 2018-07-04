const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let url = 'https://medium.com';

fs.writeFile('output.txt','', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('created');
        console.log('scraping...');
    }
});
let allLinks = [];
let connections = 0;
let pattern = /medium.com/;

function getUrls(url) {
    connections++;
    return request(url, function (err, response, html) {
        if (!err) {
            let $ = cheerio.load(html);
            let links = $('a');
            $(links).each(function (i, link) {
                if ($(link) && $(link).attr('href')) {
                    if ($(link) && $(link).attr('href').match(pattern) && $(link).attr('href').match(/^(https:\/\/)/)) {
                        if (allLinks.indexOf($(link).attr('href')) === -1) {
                            allLinks.push($(link).attr('href'));

                            fs.open('output.txt', 'a', '0o666', function (err, id) {
                                fs.write(id, $(link).attr('href') + '\n', null, 'utf8', function () {
                                    fs.close(id, function () {
                                        
                                    });
                                });

                            });
                            while(connections<5){
                                getUrls($(link).attr('href'));
                                
                            }
                            connections--;
                        }
                    }
                }
            });


        }
    });
}

getUrls(url);

