/**
 * @description Controller class for retrieving user profile information
 * @author OpenClassroom Project
 * @date 2026
 */
public with sharing class ProfilesController {
    
    /**
     * @description Retrieves the profile name of the current user
     * @return String The name of the current user's profile
     */
    @AuraEnabled(cacheable=true)
    public static String getUsersProfiles() {
        Id profileId=userinfo.getProfileId();
        String profileName=[Select Id,Name from Profile where Id=:profileId WITH USER_MODE].Name;
        system.debug('ProfileName'+profileName);
        return profileName;
    }

}
