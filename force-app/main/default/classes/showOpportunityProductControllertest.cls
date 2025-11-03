@isTest
public with sharing class showOpportunityProductControllertest {

    @testSetup static void createTestOpportunityProducts() {
        //Account
        Account acc = new Account(Name='Test Account');
        insert acc;
        // Produits
        List<Product2> products = new List<Product2>();
        products.add(new Product2(Name='Tesla Model S', ProductCode='TES-MS', Description='Voiture électrique haut de gamme avec une autonomie de 652 km et une accélération de 0 à 100 km/h en 2,5 secondes', Family='Voitures électriques', QuantityInStock__c=50));
        products.add(new Product2(Name='Ford Mustang Mach-E', ProductCode='FORD-MM', Description='SUV électrique avec une autonomie de 491 km et une accélération de 0 à 100 km/h en 3,7 secondes', Family='Voitures électriques', QuantityInStock__c=75));
        products.add(new Product2(Name='Audi e-Tron', ProductCode='AUDI-ET', Description='SUV électrique avec une autonomie de 436 km et une accélération de 0 à 100 km/h en 5,7 secondes', Family='Voitures électriques', QuantityInStock__c=100));
        products.add(new Product2(Name='Toyota Corolla Hybride', ProductCode='TOY-CH', Description='Voiture hybride compacte avec une consommation de carburant de 4,2 L/100 km et une puissance de 122 ch', Family='Voitures hybrides', QuantityInStock__c=150));
        products.add(new Product2(Name='Honda Civic', ProductCode='HON-CIV', Description='Voiture compacte avec une consommation de carburant de 6,2 L/100 km et une puissance de 158 ch', Family='Voitures à essence', QuantityInStock__c=200));
        insert products;
        // Créer opprtunity
        Opportunity newOpp = new Opportunity( AccountId = acc.Id, Name = 'Test Name', CloseDate = System.today() + 90, StageName = 'Prospecting');
        insert newOpp;
        //PriceBook entry
        List<PricebookEntry> pbeList = new List<PricebookEntry>();
        pbeList.add(new PricebookEntry(Pricebook2Id=Test.getStandardPricebookId(), Product2Id=products[0].Id, UnitPrice=25000, IsActive=true));
        insert pbeList;
        //Créer opportunity product  
        OpportunityLineItem oppLine = new OpportunityLineItem(
        OpportunityId = newOpp.Id,
        PricebookEntryId = pbeList[0].Id,
        Quantity = 2,
        UnitPrice = 25000
    );
        insert oppLine;     
    }
    @isTest static void testName() {
        // Simuler une page 
        Opportunity testOpp = [SELECT Id FROM Opportunity LIMIT 1];
        List<OpportunityLineItem> productList = showOpportunityProductController.getOpportunityProduct(testOpp.Id);
        Assert.areEqual(1, productList.size());
       
}
}