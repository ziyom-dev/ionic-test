import { defineNuxtPlugin } from '#imports'
import { createAnimation, getIonPageElement, setupConfig } from '@ionic/core'

const DURATION = 350
const EASING = 'cubic-bezier(0.33, 1, 0.68, 1)'

/**
 * Custom Ionic page transition that adds a subtle slide + fade in both directions.
 */
const customNavAnimation: NonNullable<Parameters<typeof setupConfig>[0]['navAnimation']> = (_baseEl, opts) => {
  const enteringPage = getIonPageElement(opts.enteringEl)
  const leavingPage = opts.leavingEl ? getIonPageElement(opts.leavingEl) : undefined

  const isBack = opts.direction === 'back'
  const offset = isBack ? -48 : 48

  const enteringTransition = createAnimation()
    .addElement(enteringPage)
    .beforeRemoveClass('ion-page-invisible')
    .duration(DURATION)
    .easing(EASING)
    .fromTo('transform', `translate3d(${offset}px, 12px, 0) scale(${isBack ? 1.015 : 0.985})`, 'translate3d(0, 0, 0) scale(1)')
    .fromTo('opacity', 0.01, 1)

  if (leavingPage) {
    const leavingTransition = createAnimation()
      .addElement(leavingPage)
      .duration(Math.max(220, DURATION - 80))
      .easing(EASING)
      .fromTo('transform', 'translate3d(0, 0, 0) scale(1)', `translate3d(${isBack ? 60 : -60}px, -8px, 0) scale(${isBack ? 0.975 : 1.02})`)
      .fromTo('opacity', 1, 0.1)

    enteringTransition.addAnimation(leavingTransition)
  }

  return enteringTransition
}

export default defineNuxtPlugin(() => {
  if (!import.meta.client) {
    return
  }

  if (window.__IONIC_CUSTOM_NAV_ANIMATION__) {
    return
  }

  setupConfig({
    navAnimation: customNavAnimation,
  })

  window.__IONIC_CUSTOM_NAV_ANIMATION__ = true
})

declare global {
  interface Window {
    __IONIC_CUSTOM_NAV_ANIMATION__?: boolean
  }
}
