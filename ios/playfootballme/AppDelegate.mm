#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h> 

// Add the header at the top of the file:
#import <React/RCTLinkingManager.h>


// firebase settings
// #import UIKit;
#import <Firebase.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"playfootballme";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  // firebase settings
  [FIRApp configure];  

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
- (void)applicationDidBecomeActive:(UIApplication *)application{
   [UIApplication sharedApplication].applicationIconBadgeNumber = 0; 
   [[UNUserNotificationCenter currentNotificationCenter] removeAllDeliveredNotifications];
 }

-(void)applicationDidEnterBackground:(UIApplication *)application{
   [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
   [[UNUserNotificationCenter currentNotificationCenter] removeAllDeliveredNotifications];
 } 

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

// Add this inside `@implementation AppDelegate` above `@end`:
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}  
@end
