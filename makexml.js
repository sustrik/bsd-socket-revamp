#!/usr/bin/env nodejs

// This script converts the (almost) plain input file into XML.
// XML can then be converted to RFC draft at https://xml2rfc.tools.ietf.org/

function escape(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

var abstract = "Blah. Blah."

var prologue = `<?xml version="1.0" encoding="US-ASCII"?>
<!DOCTYPE rfc SYSTEM "rfc2629.dtd">
<?rfc toc="yes"?>

<rfc category="info" docName="sock-api-revamp-01">

  <front>

    <title abbrev="BSD Socket API Revamp">
    BSD Socket API Revamp
    </title>

    <author fullname="Martin Sustrik" initials="M." surname="Sustrik" role="editor">
      <address>
        <email>sustrik@250bpm.com</email>
      </address>
    </author>

    <date month="April" year="2018" />

    <area>Applications</area>
    <workgroup>Internet Engineering Task Force</workgroup>

    <keyword>BSD sockets</keyword>
    <keyword>API</keyword>
    <keyword>composability</keyword>

    <abstract>
      <t>` + escape(abstract) + `</t>
    </abstract>

  </front>

  <middle>
` 

var epilogue = `
  </middle>

</rfc>
`

var fs = require('fs');
var lns = fs.readFileSync('source.txt', 'utf8').split('\n')

var t = prologue

var level = 0
for(var i = 0; i < lns.length; i++) {
    var ln = lns[i]
    if(ln.length == 0) continue
    if(ln[0] === '#') {
        lvl = parseInt(ln[1])
        if(lvl > level + 1) {
            console.log('Error')
            process.exit(1)
        }
        else if(lvl == level + 1) {
        }
        else if (lvl == level) {
            t += '</section>\n'     
        }
        else {
            for(var j = 0; j != level - lvl + 1; j++) {
                t += '</section>\n'
            }
        }
        t += '<section title="' + ln.substring(3) + '">\n'
        level = lvl
        continue
    }
    if(ln === "%") {
       t += '<figure>\n'
       t += '<artwork>\n'
       while(true) {
           i++
           ln = lns[i]
           if(ln === "%") break
           t += escape(ln) + "\n"
       }
       t += '</artwork>\n'
       t += '</figure>\n'
       continue
    }
    t += "<t>" + escape(ln) + "</t>\n"
}
for(var j = 0; j != level; j++) {
    t += '</section>\n'
}

t += epilogue

fs.writeFile("source.xml", t)

