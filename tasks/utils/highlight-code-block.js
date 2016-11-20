var highlightjs = require('highlight.js');
var getTransform = require('transfob');

highlightjs.configure({
  classPrefix: ''
});

var hljsJavascript = highlightjs.getLanguage('javascript');
// highlight Packery
hljsJavascript.keywords.masonry_keyword = 'Masonry';
// highlight packery variables
hljsJavascript.keywords.masonry_var = 'msnry';

hljsJavascript.contains.push({
  className: 'jquery_var',
  begin: /\$grid/
});

var reFirstLine = /.*\n/;

function replaceCodeBlock( match, leadingWhiteSpace, block ) {
  var langMatch = block.match( reFirstLine );
  var language = langMatch && langMatch[0];
  // remove first line
  block = block.replace( reFirstLine, '' );
  if ( language ) {
    language = language.trim();
  }
  // remove leading whitespace from code block
  if ( leadingWhiteSpace && leadingWhiteSpace.length ) {
    var reLeadingWhiteSpace = new RegExp( '^' + leadingWhiteSpace, 'gim' );
    block = block.replace( reLeadingWhiteSpace, '' );
  }
  // highlight code
  var highlighted = language ? highlightjs.highlight( language, block, true ).value : block;
  // wrap in <pre><code>
  var html = '\n<pre><code' +
    ( language ? ' class="' + language + '"' : '' ) + '>' +
    highlighted + '</code></pre>';
  return html;
}

module.exports = function() {
  return getTransform( function( file, enc, callback ) {
    var contents = file.contents.toString();
    contents = contents.replace( /\n( *)```([^```]+)```/gi, replaceCodeBlock );
    file.contents = new Buffer( contents );
    this.push( file );
    callback();
  });
};
