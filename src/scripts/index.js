import $ from 'jquery'
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'owl.carousel'
// import * as d3 from 'd3'

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
      .fail((e) => {
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

    $('html, body').animate({ scrollTop: $nextSection.offset().top })
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
    $('html, body').animate({ scrollTop: $sectionNext.offset().top })
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
    $('html, body').animate({ scrollTop: $formSection.offset().top }); return false
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
      e.preventDefault()
      const email = $email.val()
      const trnum = $trnum.val()
      $.ajax({
        type: 'POST',
        url: '/static/php/unique_join.php',
        data: {
          trnum: trnum,
          email: email
        },
        success (data) {
          if (data.isNew) {
            window.yaCounter47624572.reachGoal('NEW_COMPETITION_JOIN', function () {
              const locationnew = '/registration?email=' + email + '&trnum=' + trnum
              window.location = locationnew
            })
          } else {
            const locationnew = '/registration?email=' + email + '&trnum=' + trnum
            window.location = locationnew
          }
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
      e.preventDefault()
      const email = $email2.val()
      const trnum = $trnum2.val()
      $.ajax({
        type: 'POST',
        url: '/static/php/unique_join.php',
        data: {
          email: email,
          trnum: trnum
        },
        success (data) {
          if (data.isNew) {
            window.yaCounter47624572.reachGoal('NEW_COMPETITION_JOIN', function () {
              const locationnew = '/registration?email=' + email + '&trnum=' + trnum
              window.location = locationnew
            })
          } else {
            const locationnew = '/registration?email=' + email + '&trnum=' + trnum
            window.location = locationnew
          }
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
    $('html').animate({ scrollTop: itemPositionTop - 30 }, 400)
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
  AOS.init()
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
  function moving () {
    if ($(window).width() < 1024) return false
    var windowPosTop = $(document).scrollTop()
    if (windowPosTop >= posTopMov) {
      var posTopDif = windowPosTop - posTopMov + 40
      $('.moving').css('transform', 'translateY(' + posTopDif + 'px)')
    } else if (windowPosTop < posTopMov) {
      $('.moving').css('transform', 'translateY(0px)')
    }
    if (windowPosTop >= posTopMov + blHeight - movHeight) {
      var finalTrf = blHeight - movHeight
      $('.moving').css('transform', 'translateY(' + finalTrf + 'px)')
    }
  }
  if ($('.moving').length) {
    var posTopMov = $('.moving').offset().top
    var movHeight = $('.moving').height()
    var blHeight = $('.career_wr__left').height()
    $(window).scroll(moving)
  }
  moving()
  $(window).resize(function () {
    // if ($('.moving').length) {
    //   var posTopMov = $('.moving').offset().top
    //   var movHeight = $('.moving').height()
    //   var blHeight = $('.career_wr__left').height()
    //   $(window).scroll(moving)
    // }
    $('.moving').css('transform', 'translateY(0px)')
  })
  // form
  $(document).click(function () {
    $('.drpdwn_menu').removeClass('opened')
    $('.hidden_opt').removeClass('opened')
  })
  $('.input_grp__btn').click(function (e) {
    e.stopPropagation()
    $('.drpdwn_menu').toggleClass('opened')
  })
  $('.citizenship').click(function (e) {
    e.stopPropagation()
    $('.hidden_opt').toggleClass('opened')
    return false
  })
  $('.drpdwn_menu__item').click(function (e) {
    var whatMoney = $(this).data('money')
    $('.change_money').text(whatMoney).attr('data-money', whatMoney)
    $('.what_money').val(whatMoney)
  })
  $('.pre_sale_form .option').click(function (e) {
    var country = $(this).data('value')
    var countryName = $(this).text()
    $('.citizenship.text_input.showed').text(countryName)
    $('.citizenship.hidden').val(country)
  })
  var boolForm = false
  $('.pre_sale_form .sm-form-btn').click(function (e) {
    // e.preventDefault()
    $('.bold').removeClass('alert')
    $('.me_understand .custom_input').removeClass('alert')
    var formData = $('.pre_sale_form').serializeArray()
    var whatMoney = $('.change_money').data('money')
    formData[4].money = whatMoney
    var boolCounter = true
    if (!formData[9]) {
      boolCounter = false
      $('.me_understand .custom_input').addClass('alert')
    }
    if (!formData[0].value) {
      $('.form_grp:nth-child(1) .bold').addClass('alert')
      boolCounter = false
    }
    if (!formData[1].value) {
      $('.form_grp:nth-child(2) .bold').addClass('alert')
      boolCounter = false
    }
    if (!formData[4].value) {
      $('.form_grp:nth-child(5) .bold').addClass('alert')
      boolCounter = false
    }
    if (!formData[5].value) {
      $('.form_grp:nth-child(6) .bold').addClass('alert')
      boolCounter = false
    }
    if (!boolCounter) return false
    const name = formData[0].value
    const email = formData[1].value
    const isAccreditedInvestor = formData[2].value
    const entityType = formData[3].value
    const amount = formData[4].value
    const currency = whatMoney
    const citizenship = formData[5].value
    const address = formData[6].value
    const comment = formData[7].value
    $('.pre_sale_form .sm-form-btn').prop('disabled', true)
    $.ajax({
      type: 'POST',
      url: '/static/php/presale.php',
      data: {
        email,
        name,
        isAccreditedInvestor,
        entityType,
        amount,
        currency,
        citizenship,
        address,
        comment
      },
      success (data) {
        $('<div class="confirm_form">Your data has been send</div>').appendTo('.sm-form__submit')
        $('.pre_sale_form').addClass('opacity')
        $('<div class="confirm_form_bg"></div>').appendTo('.pre_sale_form')
        boolForm = true
        history.pushState(null, null, '/presale/form-sended/')
        // window.location.href = '/registration/'
      }
    }).fail(function () {
      alert('Failed to submit')
    }).always(function () {
      $('.pre_sale_form .sm-form-btn').prop('disabled', false)
    })
    return false
  })
  $(document).click(function () {
    if (boolForm) {
      $('.pre_sale_form').removeClass('opacity')
      $('.confirm_form, .confirm_form_bg').remove()
      boolForm = false
    }
  })
  $('.pos_name').click(function () {
    $(this).closest('.career__wr').toggleClass('open')
    return false
  })
  // lane graph
  $('.lane_gr_cont__btn, .lane_gr__item').hover(function () {
    $('.lane_gr_cont__btn').eq($(this).data('number')).addClass('colored')
    $('.lane_gr__item').eq($(this).data('number')).addClass('colored')
  }, function () {
    $('.lane_gr_cont__btn, .lane_gr__item').removeClass('colored')
  })
  $('.lane_gr_cont__btn').click(function () {
    return false
  })
  // pie chart
  var script4 = document.createElement('script')
  script4.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js'
  document.body.appendChild(script4)
  script4.onload = function () {
    $('<script>var datasPie=[{label:"Label1",number:"7",color:"#32ba94"},{label:"Label4",number:"36.4",color:"#32ba94"},{label:"Label5",number:"11.6",color:"#32ba94"},{label:"Label2",number:"15",color:"#32ba94"},{label:"Label3",number:"5",color:"#32ba94"},{label:"Label9",number:"4",color:"#32ba94"},{label:"Label10",number:"20",color:"#32ba94"},{label:"Label11",number:"1",color:"#32ba94"}];function drawPie(t){$(".js-pie-chart");var e=226,a=Math.PI,l=d3.layout.pie();l.padAngle(.02).sort(null).value(function(t){return t.number}).startAngle(a/180*-270).endAngle(a/180*90);var r=d3.svg.arc().outerRadius(216).innerRadius(2.0625),o=d3.svg.arc().outerRadius(e).innerRadius(2.0625),n=d3.select("#pieChart").append("object").attr("width","100%").attr("height","auto").style("display","block").style("position","relative").style("padding-top","452px").append("svg").data([t]).attr("width","100%").attr("height","100%").attr("viewBox","0 0 452 452").attr("preserveAspectRatio","xMinYMin").style("position","absolute").style("top","0").style("left","0").append("g").attr("transform","translate(226,226)").selectAll("g.slice").data(l).enter().append("g").attr("class","slice");n.on("mouseover",function(t){}).on("mouseout",function(t){}),n.append("path").attr("fill","#3e4053").attr("d",r).on("mouseover",function(e,a){d3.select(this).attr("fill",t[a].color).attr("d",o)}).on("mouseout",function(t){d3.select(this).attr("fill","#3e4053").attr("d",r)}),$(".graph__desc1").on("mouseover",function(){$($(".slice path")[0]).attr("fill","#32ba94");var t=d3.selectAll(".slice path"),e=t;e[0][0]=t[0][0],e[0][1]=t[0][0],e[0][2]=t[0][0],e[0][3]=t[0][0],e[0][4]=t[0][0],e[0][5]=t[0][0],e[0][6]=t[0][0],e[0][7]=t[0][0],e.attr("d",o)}).on("mouseout",function(){$($(".slice path")[0]).attr("fill","#3e4053");var t=d3.selectAll(".slice path"),e=t;e[0][0]=t[0][0],e[0][1]=t[0][0],e[0][2]=t[0][0],e[0][3]=t[0][0],e[0][4]=t[0][0],e[0][5]=t[0][0],e[0][6]=t[0][0],e[0][7]=t[0][0],e.attr("d",r)}),$(".graph__desc2").on("mouseover",function(){$($(".slice path")[1]).attr("fill","#32ba94");var t=d3.selectAll(".slice path"),e=t;e[0][0]=t[0][1],e[0][1]=t[0][1],e[0][2]=t[0][1],e[0][3]=t[0][1],e[0][4]=t[0][1],e[0][5]=t[0][1],e[0][6]=t[0][1],e[0][7]=t[0][1],e.attr("d",o)}).on("mouseout",function(){$($(".slice path")[1]).attr("fill","#3e4053");var t=d3.selectAll(".slice path"),e=t;e[0][0]=t[0][1],e[0][1]=t[0][1],e[0][2]=t[0][1],e[0][3]=t[0][1],e[0][4]=t[0][1],e[0][5]=t[0][1],e[0][6]=t[0][1],e[0][7]=t[0][1],e.attr("d",r)}),$(".percents_block__string").on("mouseover",function(){var t=$(this).data("number");$($(".slice path")[t]).attr("fill","#32ba94");var e=d3.selectAll(".slice path"),a=e;a[0][0]=e[0][t],a[0][1]=e[0][t],a[0][2]=e[0][t],a[0][3]=e[0][t],a[0][4]=e[0][t],a[0][5]=e[0][t],a[0][6]=e[0][t],a[0][7]=e[0][t],a.attr("d",o)}).on("mouseout",function(){var t=$(this).data("number");$($(".slice path")[t]).attr("fill","#3e4053");var e=d3.selectAll(".slice path"),a=e;a[0][0]=e[0][t],a[0][1]=e[0][t],a[0][2]=e[0][t],a[0][3]=e[0][t],a[0][4]=e[0][t],a[0][5]=e[0][t],a[0][6]=e[0][t],a[0][7]=e[0][t],a.attr("d",r)})}drawPie(datasPie);</script>').appendTo(document.body)
    for (var k = 0; k < $('.slice').length; k++) {
      var p = k - 2
      $('.slice').eq(k).attr('data-hover', '.percents_block__string:eq(' + p + ')')
    }
    for (var i = 0; i < 2; i++) {
      var c = i + 1
      $('.slice').eq(i).attr('data-hover', '.graph__desc' + c)
    }
    $('.slice').hover(function () {
      var dataHover = $(this).data('hover')
      $(dataHover).toggleClass('hovered')
    })
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
    }
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
    $(this).closest('.social_check__item').toggleClass('hidden')
    $('.registr_page').removeClass('socials_done')
    if (($('.item__check').eq(0).hasClass('active')) && ($('.item__check').eq(1).hasClass('active'))) {
      $('.registr_page').addClass('socials_done')
    }
  })

  if ($('div.check_email')[0]) {
    const url = new URL(window.location)
    const email = url.searchParams.get('email')
    if (email) {
      $.ajax({
        type: 'GET',
        url: '/static/php/is_subscribed.php',
        data: {
          email: email
        },
        success (data) {
          if (!data || !data.subscribed) {
            $('div.check_email').text('Please, accept email subscription. We sent email to ' + email + '. Note, email can be found in "Promotions" or "SPAM"')
          }
        }
      })
    }
  }
  $('.registr_page__btn').click(function (e) {
    $('.item__check').removeClass('not_done')
    if (!$('.registr_page').hasClass('socials_done')) {
      $('html, body').animate({ scrollTop: $('.registr_page__social_check').offset().top })
      $('.item__check:not(.active)').addClass('not_done')
      return false
    } else {
      e.preventDefault()
      const formFields = $('form.check_sub_form').serializeArray()
      const twitter = formFields[0].value
      const telegram = formFields[0].value
      const url = new URL(window.location)
      const trnum = url.searchParams.get('trnum')
      const email = url.searchParams.get('email')
      $.ajax({
        type: 'POST',
        url: '/static/php/social_subscribe.php',
        data: {
          twitter: twitter,
          telegram: telegram,
          email: email,
          trnum: trnum
        },
        success (data) {
          $.ajax({
            type: 'GET',
            url: '/static/php/is_subscribed.php',
            data: {
              email: email
            },
            success (data) {
              if (!data || !data.subscribed) {
                alert('Please, accept email subscription. We sent email to ' + email + '. Note, email can be found in "Promotions" or "SPAM"')
                return
              }
              const form = $('<form/>',
                {
                  action: '/static/php/idnow.php',
                  method: 'post',
                  css: {
                    display: 'none'
                  }
                }
              )
              form.append($('<input/>',
                {
                  type: 'text',
                  name: 'email',
                  value: email
                }
              ))
              form.append($('<input/>',
                {
                  type: 'text',
                  name: 'trnum',
                  value: trnum
                }
              ))
              $('body').append(form)
              form.submit()
            }
          })
        }
      })
    }
  })
  $(document).on('touchend click', '.how-we-help .video_wrapper', function (e) {
  // отменяем стандартное действие button
    e.preventDefault()
    var poster = $(this)
    // ищем родителя ближайшего по классу
    var wrapper = poster.closest('.js-videoWrapper')
    if ($(window).width() >= 1024) {
      videoPlay(wrapper)
    } else {
      console.log('heh')
      videoPlayMob2()
    }
  })
  $(document).on('touchend click', '.registr_page__video_wr .video_wrapper', function (e) {
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
    $('.registr_page__video_wr').removeClass('video-on')
    $('.js-videoIframe').attr('src', '')
    $('.js-videoWrapper').removeClass('videoWrapperActive')
    $('html, body').css('overflow', 'auto')
    player.pause()
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
  // $('<script>var player = new YT.Player("video_wrapper", {videoId: "_XLvCRkjZJY",playerVars: { "autoplay": 1, "controls": 0, "iv_load_policy": 3, "showinfo": 0, "modestbranding": 0, "rel": 0},events: {"onReady": onPlayerReady} });    function onPlayerReady (event) {      player.playVideo()    }</script>').appendTo(document.body)
  const YTPlayer = require('yt-player')
  const player = new YTPlayer('#video_wrapper', {
    autoplay: true,
    controls: false,
    info: false,
    annotations: false,
    modestbranding: false,
    related: false
  })
  function videoPlayMob () {
    $('.video_wrapper').addClass('video-on')
    $('.registr_page__video_wr').addClass('video-on')
    player.load('_XLvCRkjZJY')
    player.play()
  }
  function videoPlayMob2 () {
    $('.video_wrapper').addClass('video-on')
    $('.registr_page__video_wr').addClass('video-on')
    player.load('zFs9AZn27HQ')
    player.play()
  }
})

function validate (_this, trigger) {
  var ckName = /^[А-Яа-яA-Za-z\s]{1,20}$/
  var ckText = /^[А-Яа-яA-Za-z0-9,.!?\s]{1,5000}$/
  var ckNumber = /^\d+$/
  var ckEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

  var type = $(_this).attr('data-type')
  if (type === 'number') {
    if (!ckNumber.test($(_this).val())) {
      return false
    } else {
      return true
    }
  } if (type === 'text') {
    if (!ckText.test($(_this).val())) {
      return false
    } else {
      return true
    }
  } if (type === 'email') {
    if (!ckEmail.test($(_this).val())) {
      return false
    } else {
      return true
    }
  } if (type === 'name') {
    if (!ckName.test($(_this).val())) {
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

$(document).ready(function () {
  $('.trust_form__label-text').click(function () {
    $(this).closest('.trust_form__inp_grp').find('.hid_input').prop('checked', false)
    $(this).closest('.trust_form__container').find('.hid_input').prop('checked', true)
  })
  $('.trust_form__button').click(function () {
    $('.trust_form__label').removeClass('danger')
    var trigger = true
    $(this).closest('form').find('.trust_form__input-nes').each(function (i) {
      var _this = this
      if (!validate(_this, trigger)) {
        $(this).closest('.trust_form__inp_grp').find('.trust_form__label').addClass('danger')
        trigger = false
      }
    })
    if ($('.hid_input:checked').length < 2) {
      $('.trust_form__marg').addClass('danger')
      $('.hid_input:checked').closest('.trust_form__inp_grp').find('.trust_form__label').removeClass('danger')
      return false
    }
    if (!trigger) return false
  })
})

$(document).ready(function () {
  // press slider
  $('.live-sale__pr-owl').owlCarousel({
    items: 1,
    loop: true,
    dots: false,
    nav: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    autoplaySpeed: 3000,
    smartSpeed: 500,
    slideTransition: 'linear',
    responsive: {
      1439: {
        items: 7
      },
      1024: {
        items: 6
      },
      767: {
        items: 3
      }
    }
  })

  // anchor to backed block
})
$(document).ready(function () {
  var search = window.location.search.substring(1)
  var params = parseQueryString(search)
  if (params.izzzio_ref) {
    window.localStorage.setItem('izzzio_ref', params.izzzio_ref)
  }
  $('a.live-sale__btn').click(function (e) {
    var ref = window.localStorage.getItem('izzzio_ref')
    if (ref) {
      var anchor = $(this)
      anchor.attr('href', 'https://sale.membrana.io/cabinet/ref/' + ref)
      window.localStorage.removeItem('izzzio_ref')
    }
  })
})
function parseQueryString (query) {
  var vars = query.split('&')
  var queryString = {}
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    var key = decodeURIComponent(pair[0])
    var value = decodeURIComponent(pair[1])
    if (typeof queryString[key] === 'undefined') {
      queryString[key] = decodeURIComponent(value)
    } else if (typeof queryString[key] === 'string') {
      var arr = [queryString[key], decodeURIComponent(value)]
      queryString[key] = arr
    } else {
      queryString[key].push(decodeURIComponent(value))
    }
  }
  return queryString
}
$(document).ready(function () {
  var root = 'https://beta.membrana.io/api/v2/price'
  $.get(root, (res) => {
    if (res && res.price) {
      const title = $('head title')
      const text = title.text()
      if (text.match('\\(MBN\\)')) {
        const newTitle = text.replace('(MBN)', '(MBN, $' + res.price + ')')
        title.text(newTitle)
      }
    }
  })
})

$(document).ready(function () {
  var root = 'https://beta.membrana.io'
  var elem = $('.stat-wrapper.js-section')[0]
  if (!elem) {
    return
  }
  $.get(root + '/api/v2/stat', (res) => {
    var elements = $('.stat-table .text-stat')
    elements.each((index, e) => {
      switch (index) {
        case 0:
          e.innerText = parseInt(res.volume) + ' USDT'
          break
        case 1:
          e.innerText = res.contracts
          break
        case 2:
          e.innerText = res.amount + ' USDT'
          break
        case 3:
          e.innerText = res.traders
          break
        case 4:
          e.innerText = parseInt(res.payments, 0) + ' USDT'
          break
      }
    })
  })
  $.get(root + '/api/v2/stat/top', (res) => {
    $('.best-traders tbody tr').each((index, e) => {
      var data = res[index]
      e.children[0].innerText = data.name
      e.children[1].innerText = data.last
      e.children[2].innerText = data.average
      var row = $(e)
      var button = row.find('a')
      button.attr('href', root + '/' + data.name)
    })
  })
})
