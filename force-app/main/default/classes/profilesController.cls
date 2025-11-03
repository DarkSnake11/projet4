public with sharing class profilesController {
    @AuraEnabled(cacheable=true)
    public static String getUsersProfiles() {
        Id profileId=userinfo.getProfileId();
        String profileName=[Select Id,Name from Profile where Id=:profileId].Name;
        system.debug('ProfileName'+profileName);
        return profileName;
    }

}