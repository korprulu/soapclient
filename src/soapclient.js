/*****************************************************************************\

 Javascript "SOAP Client" library

 @version: 1.5 - 2012.12.20
 @author: Kevin Chiu - http://korprulu.blogspot.tw/
 @description: Rewrite for used in NodeJS

 @version: 1.4 - 2005.12.10
 @author: Matteo Casati, Ihar Voitka - http://www.guru4.net/
 @description: (1) SOAPClientParameters.add() method returns 'this' pointer.
               (2) "_getElementsByTagName" method added for xpath queries.
               (3) "_getXmlHttpPrefix" refactored to "_getXmlHttpProgID" (full 
                   ActiveX ProgID).
               
 @version: 1.3 - 2005.12.06
 @author: Matteo Casati - http://www.guru4.net/
 @description: callback function now receives (as second - optional - parameter) 
               the SOAP response too. Thanks to Ihar Voitka.
               
 @version: 1.2 - 2005.12.02
 @author: Matteo Casati - http://www.guru4.net/
 @description: (1) fixed update in v. 1.1 for no string params.
               (2) the "_loadWsdl" method has been updated to fix a bug when 
               the wsdl is cached and the call is sync. Thanks to Linh Hoang.
               
 @version: 1.1 - 2005.11.11
 @author: Matteo Casati - http://www.guru4.net/
 @description: the SOAPClientParameters.toXML method has been updated to allow
               special characters ("<", ">" and "&"). Thanks to Linh Hoang.

 @version: 1.0 - 2005.09.08
 @author: Matteo Casati - http://www.guru4.net/
 @notes: first release.

\*****************************************************************************/

var xmlbuilder = require("xmlbuilder"),
    util = require("util"),
    http = require("http"),
    urllib = require("url");

function SOAPClientRequest(method, prefix, ns)
{
    var _soap = xmlbuilder.create("soap:Envelope", {"version": "1.0", "encoding": "UTF-8"})
        .att("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
        .att("xmlns:xsd", "http://www.w3.org/2001/XMLSchema")
        .att("xmlns:soap", "http://schemas.xmlsoap.org/soap/envelope/"),
        _soapbody = _soap.ele("soap:Body");
    if (method && method !== "") {
        if (prefix && prefix !== "")
            method = util.format("%s:%s", prefix, method);

        var attr = {};
        if (ns && ns !== "") {
            attr["xmlns:" + prefix] = ns;
        }
        _rootEl = _soapbody.ele(method, '', attr);
    }
	var _root = {};
	this.addRootElement = function(tagName) 
	{
        var element = _rootEl.ele(tagName);
		_root[tagName] = element;
		return element;
	}
    this.getRootElement = function(tagName) {
        return _root[tagName];
    }
	this.toXml = function()
	{
		return _soap.end();	
	}
}

function SOAPClient() {}

SOAPClient.invoke = function(url, request, callback)
{
    SOAPClient._sendSoapRequest(url, request, callback);
}

// send soap
SOAPClient._sendSoapRequest = function(url, request, callback)
{
	// build SOAP request
	var sr = request.toXml();
    // parse url
    var p = urllib.parse(url);
	// send request
    var soapaction = "http://schemas.xmlsoap.org/soap/envelope/", // ((ns.lastIndexOf("/") != ns.length - 1) ? ns + "/" : ns) + method,
	    req = http.request({
            "hostname": p.hostname,
            "port": p.port ? p.port : 80,
            "method": "POST",
            "path": p.pathname,
            "headers": {
                "SOAPAction": soapaction,
                "Content-Type": "text/xml; charset=utf-8",
                "Content-Length": sr.length
            }
        }, function(res){
            res.setEncoding("UTF-8");
            var rs = new String;
            res.on("data", function(data) {
                rs += data;
            }).on("end", function() {
                callback(rs);
            });
        });
    req.write(sr);
    req.end();
}

exports.SOAPClientRequest = SOAPClientRequest;
exports.SOAPClient = SOAPClient;
