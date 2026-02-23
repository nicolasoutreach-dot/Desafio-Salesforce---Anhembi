@RestResource(urlMapping='/hackathon/vagas')
global with sharing class HackathonVagas {
    @HttpGet
    global static void getVagas() {
        Integer total = [SELECT COUNT() FROM Lead WHERE LeadSource = 'Hackathon Salesforce 2026'];
        Boolean available = total < 90;

        RestResponse res = RestContext.response;
        res.addHeader('Content-Type', 'application/json');
        res.addHeader('Access-Control-Allow-Origin', '*');
        res.responseBody = Blob.valueOf(
            '{"count":' + total + ',"limit":90,"available":' + available + '}'
        );
    }
}
