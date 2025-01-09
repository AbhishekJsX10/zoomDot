const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
    trigger: ".pinned",
    start: "top top",
    endTrigger: ".whitespace",
    end: "bottom top",
    pin: true,
    pinSpacing: false,
});

ScrollTrigger.create({
    trigger: ".header-info",
    start: "top top",
    endTrigger: ".whitespace",
    end: "bottom top",
    pin: true,
    pinSpacing: false,
});

ScrollTrigger.create({
    trigger: ".pinned",
    start: "top top",
    endTrigger: ".header-info",
    end: "bottom bottom",
    onUpdate: (self) => {
      const rotation = self.progress * 360;
      gsap.to(".revealer", { rotation });
    }
});

ScrollTrigger.create({
    trigger: ".pinned",
    start: "top top",
    endTrigger: ".header-info",
    end: "bottom bottom",
    onUpdate: (self) => {
      const progress = self.progress;
      const clipPath = `polygon(
        ${45 - 45 * progress}% ${0 + 0 * progress}%,
        ${55 + 45 * progress}% ${0 + 0 * progress}%,
        ${55 + 45 * progress}% ${100 - 0 * progress}%,
        ${45 - 45 * progress}% ${100 - 0 * progress}%
      )`;
  
      gsap.to(".revealer-1, .revealer-2", {
        clipPath: clipPath,
        ease: "none",
        duration: 0
      });
    }
});

ScrollTrigger.create({
    trigger: ".header-info",
    start: "top top",
    end: "bottom 50%",
    scrub: 1,
    onUpdate: (self) => { 
        const progress = self.progress;
        const left = 35 + 15 * progress;
        
        gsap.to(".revealer", {
          left: `${left}%`,
          ease: "none",
          duration: 0
        });
    }
});

ScrollTrigger.create({
    trigger: ".whitespace",
    start: "top 50%",
    end: "bottom bottom",
    scrub: 8, 
    onUpdate: (self) => {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      const maxScale = Math.max((vw / 120) * 3, (vh / 120) * 3);
      
      let progress = self.progress;
      const easedProgress = progress < 0.3
        ? 3 * progress * progress 
        : progress < 0.7
        ? 0.9 + (progress - 0.3) * 0.5 
        : Math.min(1, (progress - 0.7) * 3.33); 
      
      const scale = 1 + (maxScale - 1) * easedProgress;
      
      gsap.to(".revealer", {
        scale: scale,
        ease: "power1.inOut", 
        duration: 0.5 
      });

      if (self.progress < 0.99) {
        gsap.killTweensOf(".website-content");
        gsap.set(".website-content", {
          opacity: 0,
          y: 200,
          visibility: "hidden",
          overwrite: true
        });
      } else {
        const contentEl = document.querySelector(".website-content");
        if (contentEl && contentEl.style.visibility !== "visible") {
          gsap.fromTo(".website-content", 
            {
              opacity: 0,
              y: 200,
              visibility: "hidden"
            },
            {
              opacity: 1,
              y: 0,
              visibility: "visible",
              duration: 1,
              delay: 0.5,
              ease: "power3.out",
              overwrite: true,
              onStart: () => {
                contentEl.style.pointerEvents = "auto";
              }
            }
          );
        }
      }
    },
    onLeave: () => {
      gsap.set(".website-content", {
        opacity: 0,
        y: 200,
        visibility: "hidden",
        pointerEvents: "none"
      });
    },
    onEnterBack: () => {
      gsap.set(".website-content", {
        opacity: 0,
        y: 200,
        visibility: "hidden",
        pointerEvents: "none"
      });
    }
});