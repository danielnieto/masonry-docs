var cheerio = require('cheerio');
var getTransform = require('transfob');

module.exports = function pageNav() {
  return getTransform( function( file, enc, next ) {
    var $ = cheerio.load( file.contents.toString() );
    var pageNavHtml = '\n';
    // query each h2, h3, h4
    $('.content h2, .content h3, .content h4').each( function( i, header ) {
      var $header = $( header );
      // replace non alphanumeric to hyphens
      var title = $header.text();
      var slug = title.replace( /[^\w\d]+/gi, '-' )
        // trim trailing hyphens
        .replace( /^\-+/, '' ).replace( /\-+$/, '' ).toLowerCase();
      // set id slug
      $header.attr( 'id', slug );
      // add item to pageNav
      pageNavHtml += '<li class="page-nav__item page-nav__item--' +
        header.name + '">' + '<a href="#' + slug + '">' + title +
        '</a></li>\n';
    });
    // add pageNavHtml to page
    $('.page-nav').html( pageNavHtml );

    file.contents = new Buffer( $.html() );
    next( null, file );
  });
};
