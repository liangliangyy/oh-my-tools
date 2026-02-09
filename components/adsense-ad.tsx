'use client'

import { useEffect } from 'react'

interface AdSenseAdProps {
  /**
   * 广告位 ID (data-ad-slot)
   * 从 Google AdSense 后台获取
   */
  adSlot: string
  /**
   * 广告格式
   * - auto: 自适应
   * - fluid: 流式广告（适应内容）
   * - rectangle: 矩形
   * - vertical: 纵向
   * - horizontal: 横向
   */
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  /**
   * 是否启用全宽响应式
   */
  fullWidthResponsive?: boolean
  /**
   * 自定义样式类名
   */
  className?: string
  /**
   * 广告样式
   * - display: block（默认）
   * - display: inline-block
   */
  style?: React.CSSProperties
}

export function AdSenseAd({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style = { display: 'block' },
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // 推送广告到 AdSense
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID

  // 如果没有配置 AdSense ID，不渲染广告
  if (!adsenseId) {
    return null
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adsenseId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}
