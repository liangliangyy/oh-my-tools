'use client'

/**
 * AdSense 自动广告排除组件
 * 在特定页面使用此组件可以阻止自动广告显示
 *
 * 使用方法：
 * import { AdSenseExclusion } from '@/components/adsense-auto-ads-exclusion'
 *
 * <AdSenseExclusion />
 */
export function AdSenseExclusion() {
  return (
    <meta name="google-adsense-platform-account" content="ca-host-pub-0000000000000000" />
  )
}

/**
 * 排除页面特定区域的自动广告
 *
 * 使用方法：
 * <AdSenseNoAds>
 *   <div>这个区域不会显示自动广告</div>
 * </AdSenseNoAds>
 */
export function AdSenseNoAds({ children }: { children: React.ReactNode }) {
  return (
    <div data-ad-client="ca-pub-0000000000000000" data-ad-slot="0000000000">
      {children}
    </div>
  )
}
