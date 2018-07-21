import $ from 'jquery'

const app = window.app = {}

window.$ = $

// var YouTubeIframeLoader = require('youtube-iframe')

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
 * Scroll btn next
 */
;(() => {
  const $btnNext = $('.scroll-btn-next')
  const $sectionNext = $('.competition__profits')

  if (!$btnNext.length) return false

  $btnNext.on('click', () => {
    $('html, body').animate({scrollTop: $sectionNext.offset().top})
  })
})()

/**
 * Scroll btn form
 */
;(() => {
  const $btnForm = $('.scroll-btn-form, .binance__KYC')
  const $formSection = $('.KYC_wr h2')

  if (!$btnForm.length) return false

  $btnForm.on('click', () => {
    $('html, body').animate({scrollTop: $formSection.offset().top}); return false
  })
})()

/**
 * pop-up img
 */

// ;(() => {
//   const $imgClickTo = $('.how_it_works__img')
//   const $popUp = $('.pop_up-image')

//   if (!$imgClickTo.length) return false

//   $('.how_it_works').on('click touchend', $imgClickTo, () => {
//     if ($(window).width() <= 500) $popUp.removeClass('non_displayed'); $('html').css('overflow', 'hidden')
//   })

//   $(document).on('click touchend', '.close_pop_up, .close_pop_up_cross', (e) => {
//     e.stopPropagation()
//     $popUp.addClass('non_displayed')
//     $('html').css('overflow', 'visible')
//     return false
//   })
// })()

;(() => {
  const $imgClickTo = $('.how_it_works__img')
  const $popUp = $('.pop_up-image')
  let popTouchmoved = false

  if (!$imgClickTo.length) return false

  $('.how_it_works').on('touchend', $imgClickTo, () => {
    if ($(window).width() <= 500 && popTouchmoved !== true) {
      $popUp.removeClass('non_displayed'); $('html').css('overflow', 'hidden')
    }
  })

  $(document).on('touchmove', $imgClickTo, () => {
    popTouchmoved = true
  })

  $(document).on('touchstart', $imgClickTo, () => {
    popTouchmoved = false
  })

  $(document).on('click touchend', '.close_pop_up, .close_pop_up_cross', (e) => {
    e.stopPropagation()

    $popUp.addClass('non_displayed')

    $('html').css('overflow', 'visible')

    return false
  })
})()

/**
 * Subscription form
 */
;(() => {
  const $form = $('.js-subscribe-form')
  const $email = $form.find('[type="email"]')
  const $submit = $form.find('[type="submit"]')
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
 * Join form
 */
;(() => {
  const $form = $('.js-join-form.form_one')
  const $email = $form.find('[type="email"]')
  const $trnum = $form.find('[type="text"]')
  const $submit = $form.find('[type="submit"]')
  const $message = $('<div class="message"></div>')
  const emailError = $email.attr('data-error')
  const trnumError = $trnum.attr('data-error')

  const $form2 = $('.js-join-form.form_two')
  const $email2 = $form2.find('[type="email"]')
  const $trnum2 = $form2.find('[type="text"]')
  const $submit2 = $form2.find('[type="submit"]')
  const $message2 = $('<div class="message"></div>')
  const emailError2 = $email2.attr('data-error')
  const trnumError2 = $trnum2.attr('data-error')

  $form.attr('novalidate', true)
  $form.prepend($message.hide())

  $form2.attr('novalidate', true)
  $form2.prepend($message2.hide())

  $submit.on('click', (e) => {
    if (!$form[0].checkValidity()) {
      $form.addClass('has-error')
      let errors = ''
      if (!$email[0].checkValidity()) {
        errors += `<span class="error">${emailError}</span>`
      }
      if (!$trnum[0].checkValidity()) {
        errors += `<span class="error">${trnumError}</span>`
      }
      $message.html(errors).fadeIn(200)
      e.preventDefault()
    } else {
      $.ajax({
        type: 'POST',
        url: $form.attr('action'),
        data: {
          email: $email.val(),
          trnum: $trnum.val()
        },
        success (data) {
          // window.location.href = '/registration/'
        }
      })
    }
  })

  $submit2.on('click', (e) => {
    if (!$form2[0].checkValidity()) {
      $form2.addClass('has-error')
      let errors = ''
      if (!$email2[0].checkValidity()) {
        errors += `<span class="error">${emailError2}</span>`
      }
      if (!$trnum2[0].checkValidity()) {
        errors += `<span class="error">${trnumError2}</span>`
      }
      $message2.html(errors).fadeIn(200)
      e.preventDefault()
    } else {
      $.ajax({
        type: 'POST',
        url: $form.attr('action'),
        data: {
          email: $email2.val(),
          trnum: $trnum2.val()
        },
        success (data) {
          // window.location.href = '/registration/'
        }
      })
    }
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
  $('body').css('overflow', 'hidden')
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
  $('body').css('overflow', 'auto')
})

$('[data-prevent-modal-close]').on('click', function (e) {
  e.stopPropagation()
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
$(window).one('preloaded', () => {
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

$(document).ready(function () {
  $('.team__group:first-child .member__avatar').hover(function () {
    var dataImage = $(this).data('image')
    $(this).css('transition', 'all .2s ease')
    if ((dataImage !== 'undefined') && (dataImage !== undefined)) {
      $(this).css('background-image', 'url(' + dataImage + ')')
    }
  },
  function () {
    var dataImage = $(this).data('image')
    if ((dataImage !== 'undefined') && (dataImage !== undefined)) {
      var curImage = $(this).data('cur_image')
      $(this).css('background-image', 'url(' + curImage + ')')
    }
  })
  $(document).on('touchend click', '.js-videoPoster, .video_wrapper', function (e) {
  // отменяем стандартное действие button
    e.preventDefault()
    var poster = $(this)
    // ищем родителя ближайшего по классу
    var wrapper = poster.closest('.js-videoWrapper')
    if ($(window).width() >= 1024) {
      videoPlay(wrapper)
    } else {
      videoPlayMob()
    }
  })
  $('.close_video').click(function (e) {
    e.preventDefault()
    e.stopPropagation()
    $('.video_wrapper').removeClass('video-on')
    $('.js-videoIframe').attr('src', '')
    $('.js-videoWrapper').removeClass('videoWrapperActive')
    $('html, body').css('overflow', 'auto')
  })
  // var tag = document.createElement('script')
  // tag.src = 'https://www.youtube.com/iframe_api'
  // вопроизводим видео, при этом скрывая постер
  function videoPlay (wrapper) {
    var iframe = wrapper.find('.js-videoIframe')
    // Берем ссылку видео из data
    var src = iframe.data('src')
    $('html, body').css('overflow', 'hidden')
    // скрываем постер
    wrapper.addClass('videoWrapperActive')
    // подставляем в src параметр из data
    iframe.attr('src', src)
    $('.video_wrapper').addClass('video-on')
  }
  function videoPlayMob () {
    $('<script>var player = new YT.Player("video_wrapper", {videoId: "_XLvCRkjZJY",playerVars: { "autoplay": 1, "controls": 0, "iv_load_policy": 3, "showinfo": 0, "modestbranding": 0, "rel": 0},events: {"onReady": onPlayerReady} });    function onPlayerReady (event) {      player.playVideo()    }</script>').appendTo(document.body)
  }
  var count = 1
  var counter = 0
  if ($('.events__item').length > 3) {
    var script = document.createElement('script')
    script.src = 'https://code.jquery.com/jquery-3.3.1.min.js'
    document.body.appendChild(script)
    script.onload = function () {
      var script2 = document.createElement('script')
      script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js'
      document.body.appendChild(script2)
      script2.onload = function () {
        $('<script>var owl = $(".possbile_slider_cont").owlCarousel({loop:true,items:1});</script>').appendTo(document.body)
      }
      // script2.onerror = function () {
      //   alert('Проблемы с интернетом, попробуйте обновить страницу')
      // }
    }
    // script.onerror = function () {
    //   alert('Проблемы с интернетом, попробуйте обновить страницу')
    // }
    $.each($('.events__item'), function (i, e) {
      if ((i + 1) % 3 === 0) $('.possbile_slider_cont').append("<div class='events__list'></div>")
      if (i > 2) {
        if (counter === 3) {
          count++
          counter = 0
        }
        counter++
        var elem = $(this).detach()
        var eventList = $('.events__list')[count]
        elem.appendTo(eventList)
        elem = null
      }
    })
  }
  $('.item__check').click(function () {
    $(this).toggleClass('active')
    $('.registr_page').removeClass('socials_done')
    if (($('.item__check').eq(0).hasClass('active')) && ($('.item__check').eq(1).hasClass('active'))) {
      $('.registr_page').addClass('socials_done')
    }
  })
  $('.registr_page__btn').click(function () {
    $('.item__check').removeClass('not_done')
    if (!$('.registr_page').hasClass('socials_done')) {
      $('html, body').animate({scrollTop: $('.registr_page__social_check').offset().top})
      $('.item__check:not(.active)').addClass('not_done')
      return false
    }
  })
})
