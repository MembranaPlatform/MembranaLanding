import $ from 'jquery'

const app = window.app = {}

window.$ = $

/**
 * Replace svg images with inline svg
 */
app.svgToInline = ($ctx = $('body')) => {
  const $images = $ctx.find('img[src$=".svg"]:not(.js-prevent-inline)')

  let imagesToLoad = $images.length

  $images.each(function () {
    const $img = $(this)
    const src = $img.attr('src')
    const className = ($img.attr('class') || '') + ' js-inlined-svg'

    $.get(src, (res) => {
      if (res.status !== 404) {
        const $svg = $(res).find('svg')

        $svg.find('title', 'desc').remove()

        $svg.attr('width') && $svg.css('width', (
          (parseInt(
            $svg.attr('width').replace('px', '')) / 10
          ) + 'rem')
        )

        $svg.attr('height') && $svg.css('height', (
          (parseInt(
            $svg.attr('height').replace('px', '')) / 10
          ) + 'rem')
        )

        !$svg.attr('viewBox') &&
        $svg.attr('height') &&
        $svg.attr('width') &&
        $svg.attr('viewBox', `0 0 ${$svg.attr('width')} ${$svg.attr('height')}`) &&
        $svg.attr('preserveAspectRatio', 'xMinYMin meet')

        $svg.find('*').each(function () {
          const $el = $(this)
          const urlRE = /^url\((.*)\)/g
          const hrefRE = /^#(.*)/g

          $.each($el.get(0).attributes, (i, attr) => {
            const name = attr.name
            const value = attr.value
            const url = urlRE.exec(value)
            const href = hrefRE.exec(value)
            const randId = ('id' + Math.random()).replace('.', '')

            if (url) {
              const id = url[1]
              $el.attr(name, `url(#${randId})`)
              $svg.find(id).attr('id', randId)
            }

            if (name === 'xlink:href' && href) {
              const id = href[0]
              $el.attr(name, `#${randId}`)
              $svg.find(id).attr('id', randId)
            }
          })
        })

        $svg.addClass(className).attr('ref', src)

        $img.replaceWith($svg)
      }

      imagesToLoad--
      if (imagesToLoad === 0) {
        $(window).trigger('imagesReady')
      }
    })
  })
}
app.svgToInline()

/**
 * Tabs
 */
app.initTabs = ($ctx) => {
  if (!$ctx) return console.error('initTabs', 'Please, provide context!')

  const $tabs = $ctx.find('.js-tab')
  const $links = $ctx.find('.js-tab-link')

  $links.on('click', function (e) {
    const $link = $(this)
    const tabId = $link.attr('href')
    const $tab = $tabs.filter(tabId)

    $link.addClass('active').siblings().removeClass('active')
    $tab.fadeIn(1000).css('display', 'flex').siblings().hide()

    e.preventDefault()
  })
}
app.initTabs($('.components'))

app.setPatternsSize = ($ctx = $('body')) => {
  $ctx.find('img.pattern').each(function () {
    $(this).get(0).onload = () => {
      $(this).css({
        height: $(this).height() / 10 + 'rem',
        width: $(this).width() / 10 + 'rem'
      })
    }
  })
}
app.setPatternsSize()

/**
 * Main navigation
 */
;(() => {
  const $win = $(window)
  const $headerWrapper = $('.header-wrapper')
  const $header = $('.header-wrapper').find('.header')

  $('.js-hamburger').on('click', function () {
    $('body').toggleClass('no-overflow')

    $(this).toggleClass('opened')
    $headerWrapper.find('.nav').toggleClass('opened')
  })

  if (!$('.app').is('.index')) return false

  $win.on('load scroll', () => {
    if ($win.scrollTop() > $('.js-section:nth-child(2)').offset().top - $header.height()) {
      $headerWrapper.addClass('fixed')
    } else {
      $headerWrapper.removeClass('fixed')
    }
  })
})()

/**
 * Scroll btn
 */
;(() => {
  const $win = $(window)
  const $btn = $('.scroll-btn')
  const $sections = $('.js-section')
  const sections = $sections.length
  let $nextSection = null
  const $secondSection = $sections.eq(1)
  const $beforeLastSection = $sections.eq(sections - 2)

  if (!$btn.length) return false

  $win.on('load scroll', () => {
    const scrollTop = $win.scrollTop()
    scrollTop > $secondSection.offset().top - 20 ? $btn.addClass('visible') : $btn.removeClass('visible')
    scrollTop > $beforeLastSection.offset().top ? $btn.addClass('disabled') : $btn.removeClass('disabled')
  })

  $btn.on('click', () => {
    const scrolledIndexes = []

    for (let i = 0; i < sections - 1; i++) {
      if ($win.scrollTop() >= $sections.eq(i).offset().top - 20) {
        scrolledIndexes.push(i)
      }
    }

    const currentIndex = scrolledIndexes.reverse()[0]
    $nextSection = $sections.eq(currentIndex + 1)

    $('html, body').animate({scrollTop: $nextSection.offset().top})
  })
})()

/**
 * Subscription
 */
;(() => {
  const $form = $('.js-subscribe-form')
  const $email = $form.find('.subscribe-form__email')
  const $submit = $form.find('.subscribe-form__submit')
  const $message = $('<div class="message"></div>')
  const error = $email.attr('data-error')

  $form.attr('novalidate', true)
  $form.after($message.hide())

  $email.on('keydown', (e) => {
    $form.removeClass('has-error')
    $message.fadeOut(200)
  })

  $submit.on('click', (e) => {
    if (!$form[0].checkValidity()) {
      $form.addClass('has-error')
      $message.html(`<span class="error">${error}</span>`).fadeIn(200)
    } else {
      $.ajax({
        type: 'POST',
        url: '/static/php/subscribe.php',
        data: {
          email: $email.val()
        },
        success (data) {
          $message.html(`<span class="success">${data}</span>`).fadeIn(200)

          location.hash = '#success'
        }
      })
    }
    e.preventDefault()
  })
})()

/**
 * Modals
 */
$('[data-open-modal]').on('click', function () {
  $('[data-modal="' + $(this).attr('data-open-modal') + '"]').fadeIn(400, () => {
    // Play video
    const $iframe = $('[data-modal="' + $(this).attr('data-open-modal') + '"]').children('iframe')[0]
    if ($iframe) {
      $iframe.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*')
      $('body').addClass('no-overflow')
    }
  })
})

$('[data-close-modal]').on('click', function () {
  $('[data-modal]').fadeOut(400, () => {
    // Stop video
    const $iframe = $(this).siblings('iframe')[0]
    if ($iframe) {
      $iframe.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*')
      $('body').removeClass('no-overflow')
    }
  })
})

/**
 * Preloader
 */
$(window).on('imagesReady', () => {
  const topImage = new Image()
  topImage.src = '/static/img/pictures/top/bg.svg'

  const hidePreloader = setTimeout(() => {
    $('.app-preloader, .app-preloader__circle').fadeOut(500, function () {
      $(window).trigger('preloaded')
    })
  }, 500)

  topImage.onload = hidePreloader
  topImage.onerror = hidePreloader
})

/**
 * Layers animation
 */
$(window).on('imagesReady', () => {
  const $layers = $('.layers')

  if (!$layers.length) return false

  const $imageGroup = $layers.find('.layers__image g')
  const $item = $layers.find('.layers-item')
  $(window).on('preloaded scroll', () => {
    if ($(window).scrollTop() >= $layers.offset().top - $layers.height()) {
      $layers.addClass('loaded')
    }
  })
  $imageGroup.hover(function () {
    $item.eq(3 - $(this).index()).addClass('is-active')
    $(this).addClass('is-active')
    $layers.addClass('is-hovered')
  }, function () {
    $item.eq(3 - $(this).index()).removeClass('is-active')
    $(this).removeClass('is-active')
    $layers.removeClass('is-hovered')
  })
  $item.hover(function () {
    $imageGroup.eq(2 - $(this).index()).addClass('is-active')
    $(this).addClass('is-active')
    $layers.addClass('is-hovered')
  }, function () {
    $imageGroup.eq(2 - $(this).index()).removeClass('is-active')
    $(this).removeClass('is-active')
    $layers.removeClass('is-hovered')
  })
})

/**
 * Roadmap page animation
 */
// Appear animation
;(() => {
  const $item = $('.roadmap-item')

  if (!$item.length) return false

  const $line = $('.roadmap-block__line')
  let $animating = $item.first()
  const duration = 1200
  const animate = () => {
    $animating.slideDown(duration, function () {
      $(this).height('auto')
    })
    $animating.children().fadeIn(duration * 1.5)
    setTimeout(animate, duration / 1.5)
    $animating = $animating.next()
  }

  $item.each(function () {
    $(this).height($(this).height())
  }).hide().children().hide()

  $line.hide()

  $(window).on('preloaded', () => {
    $line.fadeIn(duration)
    animate()
  })
})()

// Read more
$('.roadmap-item__read-more').on('click', function () {
  const $item = $(this).parents('.roadmap-item')
  const itemPositionTop = $item.offset().top
  const toggleHiddenText = () => {
    $(this)
      .toggleClass('active')
      .prev('.roadmap-item__text-hidden').slideToggle(400)
  }

  toggleHiddenText()

  if ($(window).scrollTop() >= itemPositionTop - 30) {
    $('html').animate({scrollTop: itemPositionTop - 30}, 400)
  }
})

/**
 * FAQ page animation
 */
$('.faq-item').on('click', function () {
  const $item = $(this)
  $item.toggleClass('active')
  $item.find('.faq-item__answer').slideToggle()
})
$('.faq-item__answer').on('click', (e) => e.stopPropagation())

/**
 * Select language
 */
;(() => {
  const $select = $('.js-select-language')
  const $current = $select.find('.select-language__current')
  const $item = $select.find('.select-language__item')

  $select.on('click', function (e) {
    $(this).addClass('active')
    e.stopPropagation()
  })

  $item.on('click', function (e) {
    $select.removeClass('active')
    e.stopPropagation()
  })

  $(document).on('click', function () {
    $select.removeClass('active')
  })

  $item.on('click', function () {
    $current.html($(this).html())
    $(this).addClass('active').siblings().removeClass('active')
  })
})()

// Load youtube video
$(window).on('preloaded', () => {
  $('.js-youtube-iframe').each(function () {
    const $item = $(this)
    const dataSet = $item.data()
    const $iframe = $('<iframe></iframe>')

    $iframe.attr('class', $item.attr('class'))

    for (let attr in dataSet) {
      $iframe.attr(attr, dataSet[attr])
    }

    $item.replaceWith($iframe)
  })
})
