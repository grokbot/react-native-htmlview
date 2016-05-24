var React = require('react')
var ReactNative = require('react-native')
var htmlparser = require('./vendor/htmlparser2')
var entities = require('./vendor/entities')

var {
  Text,
  View,
} = ReactNative


var LINE_BREAK = '\n'
var PARAGRAPH_BREAK = '\n\n'
var BULLET = '\u2022 '

function htmlToElement(rawHtml, opts, done) {
  function domToElement(dom, parent) {
    if (!dom) return null

    return dom.map((node, index, list) => {
      if (opts.customRenderer) {
        var rendered = opts.customRenderer(node, index, list)
        if (rendered || rendered === null) return rendered
      }

      if (node.type == 'text') {
        return (
          <Text key={index} style={parent ? opts.styles[parent.name] : null}>
            {entities.decodeHTML(node.data)}
          </Text>
        )
      }

      if (node.type == 'tag') {
        var linkPressHandler = null
        if (node.name == 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.href))
        }
        switch(node.name){
    			case 'pre':
    				return (
    					<View style={opts.styles.preBox} key={index}>
    						{domToElement(node.children, node)}
    					</View>
    				)
    			case 'ul':
    				return (
    					<View style={opts.styles.ulBox} key={index}>
    						{domToElement(node.children, node)}
    					</View>
    				)
          case 'ol':
    				return (
    					<View style={opts.styles.ulBox} key={index}>
    						{domToElement(node.children, node)}
    					</View>
    				)
    			case 'li':
    				return (
    					<View style={opts.styles.liBox} key={index}>
    					  <View style={opts.styles.bulletBox}>
    							<Text style={opts.styles.bullet}>{BULLET}</Text>
    						</View>
    						<View style={opts.styles.bulletContent}>
    						  {domToElement(node.children, node)}
    						</View>
    					</View>
    				)
    			case 'p':
    			  return (
    					<View style={opts.styles.pBox} key={index}>
    						<Text>{domToElement(node.children, node)}</Text>
    					</View>
    				)
    			case 'br':
    			  return (
    					<Text key={index}>{LINE_BREAK}</Text>
    				)
    			case 'h1':
            return (
              <View style={opts.styles.h1Box} key={index}>
                {domToElement(node.children, node)}
              </View>
            )
    			case 'h2':
            return (
              <View style={opts.styles.h2Box} key={index}>
                {domToElement(node.children, node)}
              </View>
            )
    			case 'h3':
            return (
              <View style={opts.styles.h3Box} key={index}>
                {domToElement(node.children, node)}
              </View>
            )
    			case 'h4':
            return (
              <View style={opts.styles.h4Box} key={index}>
                {domToElement(node.children, node)}
              </View>
            )
    			case 'h5':
    			  return (
    					<View style={opts.styles.h5Box} key={index}>
    						{domToElement(node.children, node)}
    					</View>
    				)
          case 'table':
            return (
              <View style={opts.styles.tableBox} key={index}>
                {domToElement(node.children, node)}
              </View>
            )
          case 'thead':
          case 'tbody':
            return (
              <View style={opts.styles.tableBox} key={index}>
                {domToElement(node.children, node)}
              </View>
            )
          case 'colgroup':
          case 'tr':
            return (
              <View style={opts.styles.trBox} key={index}>
                {domToElement(node.children, node)}
              </View>
            )
          case 'th':
            return (
              <View style={opts.styles.thBox} key={index}>
                {domToElement(node.children, node)}
              </View>
            )
          case 'col':
          case 'td':
            return (
              <View style={opts.styles.tdBox} key={index}>
                {domToElement(node.children, node)}
              </View>
            )
    			default:
    				return (<Text key={index} style={parent ? opts.styles[parent.name] : opts.styles.htmlText}>{domToElement(node.children, node)}</Text>);
    		}
      }
    })
  }

  var handler = new htmlparser.DomHandler(function(err, dom) {
    if (err) done(err)
    done(null, domToElement(dom))
  })
  var parser = new htmlparser.Parser(handler)
  parser.write(rawHtml)
  parser.done()
}

module.exports = htmlToElement
