# Note we will be using cordova as build tools
# We are not using capacitor. We haven't tried Capacitor yet.

# Jave 18 is needed to correctly compile
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_321.jdk/Contents/Home

# Android sdk
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk

# if you have not update the build tools from the Android studio
# specifically, Build tolls, Android SDK, Android Emulator, Android SDK platforms tools

# TODO: replace the files onesignal tracking


# Todo: run for on device
ionic cordova build android --prod --release
# keytool -genkey -v -keystore sarav2-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
rm ./app-release.aab
rm ./app-release-signed.aab
rm ./sarav3.apk
rm ./sara-release.apk
mv ./platforms/android/app/build/outputs/bundle/release/app-release.aab ./app-release.aab
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore sarav2-release-key.keystore app-release.aab alias_name
~/Library/Android/sdk/build-tools/32.0.0/zipalign -v 4 app-release.aab app-release-signed.aab

# ToDo: run for production

