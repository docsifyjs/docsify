export const UA = window.navigator.userAgent.toLowerCase()

export const isIE = UA && /msie|trident/.test(UA)

export const isMobile = document.body.clientWidth <= 600
