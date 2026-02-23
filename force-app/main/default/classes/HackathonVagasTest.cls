@isTest
private class HackathonVagasTest {
    @isTest
    static void testGetVagasAvailable() {
        Lead l = new Lead(
            FirstName = 'Test',
            LastName = 'Lead',
            Company = 'FECAP',
            LeadSource = 'Hackathon Salesforce 2026'
        );
        insert l;

        RestRequest req = new RestRequest();
        req.requestURI = '/services/apexrest/hackathon/vagas';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = new RestResponse();

        Test.startTest();
        HackathonVagas.getVagas();
        Test.stopTest();

        String body = RestContext.response.responseBody.toString();
        System.assert(body.contains('"available":true'), 'Should be available with 1 lead');
        System.assert(body.contains('"count":1'), 'Should have count 1');
    }

    @isTest
    static void testGetVagasEmpty() {
        RestRequest req = new RestRequest();
        req.requestURI = '/services/apexrest/hackathon/vagas';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = new RestResponse();

        Test.startTest();
        HackathonVagas.getVagas();
        Test.stopTest();

        String body = RestContext.response.responseBody.toString();
        System.assert(body.contains('"available":true'), 'Should be available with 0 leads');
        System.assert(body.contains('"count":0'), 'Should have count 0');
    }
}
