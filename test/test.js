var assert = require("assert");
var soapclient = require("../src/soapclient");

describe("soapclient", function(){
    var req = new soapclient.SOAPClientRequest("hello");
    describe("#toXml()", function(){
        var xml = req.toXml();

        it("should return xml string", function() {
            assert.equal("string", typeof xml, typeof xml);
            console.log(xml);
        });
    });

    describe("#invoke()", function() {
        it("should return soap response", function(done) {
            var method = "listAllProcesses";
            var req = new soapclient.SOAPClientRequest(method);
            soapclient.SOAPClient.invoke(
                "http://140.136.155.2/ode/processes/ProcessManagement",
                req,
                function(data) {
                    assert.equal("string", typeof data, data);
                    done();
                });
        }); 
    });
});
