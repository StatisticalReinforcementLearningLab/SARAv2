//
//  NotificationService.m
//  OneSignalNotificationServiceExtension
//
//  Created by Mash2 on 5/25/20.
//

#import <OneSignal/OneSignal.h>

#import "NotificationService.h"

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNNotificationRequest *receivedRequest;
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.receivedRequest = request;
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];
    
    [OneSignal didReceiveNotificationExtensionRequest:self.receivedRequest withMutableNotificationContent:self.bestAttemptContent];
    NSLog(@"Running NotificationServiceExtension");
    
    NSDateFormatter *dateFormatter=[[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"dd-MMM-yyyy"];
    NSString* formattedDate = [dateFormatter stringFromDate:[NSDate date]];
    
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss.SSS Z"];
    NSString* formattedReadbleTs = [dateFormatter stringFromDate:[NSDate date]];
    
    long long whenReceivedTs = (long long)[[NSDate date] timeIntervalSince1970] * 1000;
    
    NSDictionary* additionalData = request.content.userInfo;
    NSLog(@"additionalData = %@", additionalData);
    NSString* notificationID = [[additionalData objectForKey:@"custom"] objectForKey:@"i"];
    NSString* participantID = [[[additionalData objectForKey:@"custom"] objectForKey:@"a"]
                               objectForKey:@"user"];
    NSString* notificationType = [[[additionalData objectForKey:@"custom"] objectForKey:@"a"]
                                  objectForKey:@"type"];
    
    
    //content is JSON format
    NSDictionary *jsonBodyDict = @{
        @"PARTICIAPANT_ID": participantID,
        @"DATE": formattedDate,
        @"Notification_Id": notificationID,
        @"whenReceivedTs": [NSString stringWithFormat:@"%lld", whenReceivedTs],
        @"whenReceivedReadableTs": formattedReadbleTs,
        @"typeOfNotification": notificationType,
        @"JSON_dump": @"empty",
        @"device_type": @"iOS"
    };
    
    NSData *jsonBodyData = [NSJSONSerialization dataWithJSONObject:jsonBodyDict options:kNilOptions error:nil];
    
    
    
    NSMutableURLRequest *requestPost = [[NSMutableURLRequest alloc] init];
    //
    // TODO: change the URL to a flask end-point. 
    // The flask file is available in the 'flask' directory of 'copy_these_files'.
    //
    [requestPost setURL:[NSURL URLWithString:@"http://SERVER-IP-ADDRESS:PORT/adapts-notification-insert"]];
    [requestPost setHTTPMethod:@"POST"];
    [requestPost setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [requestPost setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [requestPost setHTTPBody:jsonBodyData];

    
    NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
    [[session dataTaskWithRequest:requestPost completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        NSString *requestReply = [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
        NSLog(@"Request reply: %@", requestReply);
    }] resume];
    
    
    self.contentHandler(self.bestAttemptContent);
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    
    [OneSignal serviceExtensionTimeWillExpireRequest:self.receivedRequest withMutableNotificationContent:self.bestAttemptContent];
    
    self.contentHandler(self.bestAttemptContent);
}

@end
