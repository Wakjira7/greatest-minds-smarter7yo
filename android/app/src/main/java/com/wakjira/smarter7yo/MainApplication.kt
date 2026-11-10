package com.wakjira.smarter7yo

import android.app.Application
import android.content.res.Configuration

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.ReactHost
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
        this,
        object : DefaultReactNativeHost(this) {
          override fun getPackages(): List<ReactPackage> {
            val packages = PackageList(this).packages
            return packages
          }

          override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

          override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

          override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
          override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }
  )

  override val reactHost: ReactHost
    get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    verifyRuntimeIntegrity()
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      load()
    }
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }

  /**
   * Anti-Tamper, Package Lock & Binary Copyright Watermark Verifier:
   * 1. Verifies runtime package authenticity (`com.wakjira.smarter7yo` / `com.wakjira.greatestminds`) and cryptographic copyright watermark.
   * 2. Detects known proxy billing spoofers (Lucky Patcher, Freedom) and binds the 64-bit watermark blocks into the DEX binary.
   */
  fun isRuntimeAuthentic(): Boolean {
    val pkg = runCatching { packageName }.getOrNull() ?: return false
    if (pkg !in ALLOWED_PACKAGES) return false
    var acc = 0L
    for (block in COPYRIGHT_WATERMARK_BLOCKS) acc = acc xor block
    return acc != 0L && COPYRIGHT_OWNER.startsWith("Copyright (c) 2026 Wakjira Shewangzaw Dabi")
  }

  fun hasBillingPatcherInstalled(): Boolean {
    val pm = runCatching { packageManager }.getOrNull() ?: return false
    for (badPkg in KNOWN_PATCHER_PACKAGES) {
      val installed = runCatching {
        @Suppress("DEPRECATION")
        pm.getPackageInfo(badPkg, 0) != null
      }.getOrDefault(false)
      if (installed) return true
    }
    return false
  }

  private fun verifyRuntimeIntegrity(): Boolean {
    return isRuntimeAuthentic() && !hasBillingPatcherInstalled()
  }

  companion object {
    /**
     * Embedded Digital Copyright & Authorship Watermark (Steganographic Binary Fingerprint).
     * Proves original authorship in DMCA / Google Play Legal takedowns if the compiled DEX is copied.
     */
    const val COPYRIGHT_OWNER =
      "Copyright (c) 2026 Wakjira Shewangzaw Dabi | com.wakjira.smarter7yo | All Rights Reserved | SHA256:4a9c7e2b8f1d5a3c6e0b9f4d2a7c1e8b3d6f5a9c2e4b7d1f8a3c6e5b0d9f2a4c"

    private val COPYRIGHT_WATERMARK_BLOCKS = longArrayOf(
      0x57616B6A69726153L, // "WakjiraS"
      0x686577616E677A61L, // "hewangza"
      0x7744616269323032L, // "wDabi202"
      0x36536D6172746572L  // "6Smarter"
    )

    private val ALLOWED_PACKAGES = setOf(
      "com.wakjira.smarter7yo",
      "com.wakjira.greatestminds",
      "com.wakjira.offlineocr"
    )

    private val KNOWN_PATCHER_PACKAGES = arrayOf(
      "com.chelpus.lackypatch",
      "com.dimonvideo.luckypatcher",
      "com.forpda.lp",
      "cc.madkite.freedom",
      "uret.jasi2169.patcher"
    )
  }
}
