const NEXT = 1;
const PREV = -1;

/**
 * @export
 */
export class Slideshow {
  /**
   * @type {Object}
   */
  DOM = {
    el: null,
    slides: null,
    slidesInner: null,
  };
  /**
   * @type {number}
   */
  current = 0;
  /**
   * @type {number}
   */
  slidesTotal = 0;

  /**
   * @type {boolean}
   */
  isAnimating = false;

  /**
   * @param {HTMLElement} DOM_el - The main element holding all the slides.
   */
  constructor(DOM_el) {
    this.DOM.el = DOM_el;
    this.DOM.slides = [...this.DOM.el.querySelectorAll(".slide")];
    this.DOM.slidesInner = this.DOM.slides.map((item) =>
      item.querySelector(".slide__img"),
    );

    this.DOM.slides[this.current].classList.add("slide--current");

    this.slidesTotal = this.DOM.slides.length;
  }

  /**
   * @returns {void}
   */
  next() {
    this.navigate(NEXT);
  }

  /**
   * @returns {void}
   */
  prev() {
    this.navigate(PREV);
  }

  /**
   * @param {number} direction
   * @returns {boolean}
   */
  navigate(direction) {
    if (this.isAnimating) return false;
    this.isAnimating = true;

    const previous = this.current;
    this.current =
      direction === 1
        ? this.current < this.slidesTotal - 1
          ? ++this.current
          : 0
        : this.current > 0
        ? --this.current
        : this.slidesTotal - 1;

    const currentSlide = this.DOM.slides[previous];
    const currentInner = this.DOM.slidesInner[previous];
    const upcomingSlide = this.DOM.slides[this.current];
    const upcomingInner = this.DOM.slidesInner[this.current];

    gsap
      .timeline({
        defaults: {
          duration: 1.25,
          ease: "power4.inOut",
        },
        onStart: () => {
          this.DOM.slides[this.current].classList.add("slide--current");
          gsap.set(upcomingSlide, { zIndex: 99 });
        },
        onComplete: () => {
          this.DOM.slides[previous].classList.remove("slide--current");
          gsap.set(upcomingSlide, { zIndex: 1 });

          this.isAnimating = false;
        },
      })
      .addLabel("start", 0)
      .to(
        currentSlide,
        {
          duration: 0.4,
          ease: "sine",
          scale: 0.9,
          autoAlpha: 0.2,
        },
        "start",
      )
      .to(
        currentSlide,
        {
          yPercent: -direction * 20,
          autoAlpha: 0,
        },
        "start+=0.1",
      )
      .fromTo(
        upcomingSlide,
        {
          autoAlpha: 1,
          scale: 1,
          yPercent: direction * 100,
        },
        {
          yPercent: 0,
        },
        "start+=0.1",
      )
      .fromTo(
        upcomingInner,
        {
          yPercent: -direction * 50,
        },
        {
          yPercent: 0,
        },
        "start+=0.1",
      );
  }
}
