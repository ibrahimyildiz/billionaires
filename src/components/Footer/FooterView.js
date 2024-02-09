import React, {memo} from 'react';
import {View, Image, Linking, TouchableOpacity} from 'react-native';

const FooterView = () => {
    const openExternalLink = (url) => {
        Linking.openURL(url).catch((err) => console.error('Error opening link:', err));
      };

      const openLinkedInProfile = () => {
        const linkedinUsername = 'ibrahimyildiz';
        const linkedinProfileURL = `https://www.linkedin.com/in/${linkedinUsername}`;
        Linking.openURL(`linkedin://profile/${linkedinUsername}`).catch(() => {
          // If the LinkedIn app is not installed, open the LinkedIn profile in the browser
          Linking.openURL(linkedinProfileURL).catch(err =>
            console.error('Could not open LinkedIn profile:', err)
          );
        });
      };

      const openGitHubProfile = () => {
        const githubUsername = 'ibrahimyildiz';
        const githubProfileURL = `https://github.com/${githubUsername}`;
        // Try to open the GitHub app
        Linking.openURL(`github://user?username=${githubUsername}`).catch(() => {
          // If the GitHub app is not installed, open the GitHub profile in the browser
          Linking.openURL(githubProfileURL).catch(err =>
            console.error('Could not open GitHub profile:', err)
          );
        });
      };

      const openLeetCodeProfile = () => {
        const leetcodeUsername = 'yildizibrahim';
        // LeetCode profile URL
        const leetcodeProfileURL = `https://leetcode.com/${leetcodeUsername}/`;
        // Try to open the LeetCode app
        Linking.openURL(`leetcode://${leetcodeUsername}`).catch(() => {
          // If the LeetCode app is not installed, open the LeetCode profile in the browser
          Linking.openURL(leetcodeProfileURL).catch(err =>
            console.error('Could not open LeetCode profile:', err)
          );
        });
      };

    return (
        <View style={{marginLeft:20, marginRight:20, marginTop:10}}>
            <View style = {{borderWidth: 0.5, borderColor:'black'}} />
            <View style={{flexDirection: 'row', marginBottom: 20, marginTop:10}}>
                <View style={{marginRight: 20}}>
                    <TouchableOpacity onPress={openLinkedInProfile}>
                        <Image
                            style={{width: 24, height: 24, marginTop:0}}
                            source={require('../../images/linkedin-footer-logo.png')}
                            />
                    </TouchableOpacity>
                </View>
                <View style={{marginRight: 20}}>
                    <TouchableOpacity onPress={openGitHubProfile}>
                        <Image
                            style={{width: 24, height: 24, marginTop:0}}
                            source={require('../../images/github-footer-logo.png')}
                            />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={openLeetCodeProfile}>
                        <Image
                            style={{width: 24, height: 24, marginTop:0}}
                            source={require('../../images/leetcode-footer-logo.png')}
                            />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default memo(FooterView);
