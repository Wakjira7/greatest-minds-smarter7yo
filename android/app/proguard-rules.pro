# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Explicit Keep Rules for Expo Modules, ML Kit OCR, Play Billing, AdMob & Copyright Watermarks
-keep class expo.modules.** { *; }
-keep class com.google.mlkit.** { *; }
-keep class com.google.android.gms.ads.** { *; }
-keep class com.android.billingclient.** { *; }
-keepclassmembers class com.wakjira.smarter7yo.MainApplication$Companion {
    public static final java.lang.String COPYRIGHT_OWNER;
}
