@isTest
public with sharing class profilesControllerTest {

    @isTest
    static void testGetUsersProfiles() {
        // la méthode de la classe à tester
        String value = profilesController.getUsersProfiles();

        // vérification Log
        System.debug('Profil retourné : ' + value);

        // Vérification valeur n'est pas nulle
        Assert.isNotNull(value);
    }
}
