# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# 100ms proguard rules
-keep class org.webrtc.** { *; }

# Keep only required Agora core classes
-keep class io.agora.rtc.** { *; }
-keep class io.agora.common.** { *; }

# Keep interfaces used via reflection
-keep class io.agora.** implements java.lang.reflect.* { *; }

# Optional: keep enums
-keepclassmembers enum io.agora.** { *; }

# Suppress warnings
-dontwarn io.agora.**
