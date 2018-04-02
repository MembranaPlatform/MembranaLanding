import $ from 'jquery'

const app = window.app = {}

/**
 * Replace svg images with inline svg
 */
app.svgToInline = ($ctx = $('body')) => {
  $ctx.find('img[src$=".svg"]').each(function () {
    const $img = $(this)
    const src = $img.attr('src')
    const className = ($img.attr('class') || '') + ' js-inlined-svg'

    $.get(src, (res) => {
      if (res.status !== 404) {
        const $svg = $(res).find('svg')

        $svg.find('title', 'desc').remove()

        $svg.attr('width') && $svg.attr('width', (
          (parseInt(
            $svg.attr('width').replace('px', '')) / 10
          ) + 'rem')
        )

        $svg.attr('height') && $svg.attr('height', (
          (parseInt(
            $svg.attr('height').replace('px', '')) / 10
          ) + 'rem')
        )

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
$(() => {
  const $win = $(window)
  const $header = $('.header-wrapper')

  $win.on('load scroll', () => {
    if ($win.scrollTop() > 32) {
      $header.addClass('fixed')
    } else {
      $header.removeClass('fixed')
    }
  })

  $('.js-hamburger').on('click', function () {
    $('body').toggleClass('no-overflow')

    $(this).toggleClass('opened')
    $header.find('.nav').toggleClass('opened')
  })
})

/**
 * Scroll btn
 */
$(() => {
  const $win = $(window)
  const $btn = $('.scroll-btn')
  const $sections = $('.js-section')
  const sections = $sections.length
  let $nextSection = null

  $win.on('load scroll', () => {
    $win.scrollTop() >= $sections.eq(1).offset().top - 20 ? $btn.addClass('visible') : $btn.removeClass('visible')
    $win.scrollTop() > $sections.eq(sections - 2).offset().top ? $btn.addClass('disabled') : $btn.removeClass('disabled')
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
})

/**
 * Subscription validate
 */
$(() => {
  const $form = $('.js-subscribe-form')
  const $email = $form.find('.subscribe-form__email')
  const $submit = $form.find('.subscribe-form__submit')
  const $error = $('<div class="error"></div>')
  const error = $email.attr('data-error')

  $form.attr('novalidate', true)
  $form.after($error.hide())

  $email.on('keydown', (e) => {
    $form.removeClass('has-error')
    $error.fadeOut(200)
  })

  $submit.on('click', (e) => {
    if (!$form[0].checkValidity()) {
      $form.addClass('has-error')
      $error.text(error).fadeIn(200)

      e.preventDefault()
    }
  })
})

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
$(window).on('load', () => {
  $('.app-preloader, .app-preloader__circle').fadeOut(500)
})
