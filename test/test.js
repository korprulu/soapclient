var assert = require("assert");
var soapclient = require("../src/soapclient");

describe("soapclient", function(){
    var params = new soapclient.SOAPClientRequest();
    describe("#toXml()", function(){
        var root = params.addRootElement("hello"),
            xml = params.toXml();

        it("should return xml string", function() {
            assert.equal("string", typeof xml, typeof xml);
            console.log(xml);
        });
    });
});
