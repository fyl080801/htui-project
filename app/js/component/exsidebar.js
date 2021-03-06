/**
 * Created by fyl08 on 2016/11/3.
 */
define([
    'require'
], function (require) {
    'use strict';

    $.fn.myAccordion = function () {
        var Accordion = function (el, multiple) {
            this.el = el || {};
            this.multiple = multiple || false;

            // Variables privadas
            var links = this.el.find('.link');
            // Evento
            links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
        };

        Accordion.prototype.dropdown = function (e) {
            var $el = e.data.el;
            var $this = $(this),
                $next = $this.next();

            $next.slideToggle();
            $this.parent().toggleClass('open');

            if (!e.data.multiple) {
                $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
            }
        };
        return new Accordion($(this), false);
    };
});