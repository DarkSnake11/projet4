public with sharing class ShowOpportunityProductController { //permet de récupérer les produits liés à une opportunité.
    @AuraEnabled(cacheable=true) // rend la méthode accessible depuis LWC/Aura et permet la mise en cache côté client
    public static List<OpportunityLineItem> getOpportunityProduct(String OpportunityId ) {
       return [select Quantity, UnitPrice, TotalPrice, Product2.Name,Product2.QuantityInStock__c from OpportunityLineItem WHERE OpportunityId = :OpportunityId];
    }
}
