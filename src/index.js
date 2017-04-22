import './styles/main.scss';

// Add your code here
import $ from 'jquery';
import {TweenLite, Power1} from 'gsap';

const projects = [{
  title: 'EdQu',
  description: 'I was responsible for the front-end but also shipping new features with the backend. My greatest achievment was redesigning and rewriting the interface leading to a much more consistent and maintainable codebase.',
  stack: [
    'Angular 1',
    'Django',
    'Postgres'
  ],
  url: 'https://edqu.se',
  imageUrl: '/images/projects/edqu.jpg'
}, {
  title: 'Vilth',
  description: 'At Vilth I developed new features from A-Z. The biggest achievment here was dealing with complex data structures in the database to handle the distribution of "fair game".',
  stack: [
    'Angular 1',
    'ExpressJS',
    'MongoDB'
  ],
  url: 'https://vilth.se',
  imageUrl: '/images/projects/vilth.jpg'
}, {
  title: 'TaleGraph',
  description: 'I\'m the founder of TaleGraph, a service that makes it easy to create and share interactive data visualization stories. As a founder I led the ideation, design and development processes together with my team.',
  stack: [
    'React',
    'ExpressJS',
    'MongoDB'
  ],
  url: 'http://talegraph.io',
  imageUrl: '/images/projects/talegraph.svg'
}, {
  title: 'HackerKids',
  description: 'I love to teach so I held an eight-week programming course for children aged 9-12. We tinkered with scratch and did a lot of fun unplugged exercises, discovering the basics of programming together.',
  stack: [
    'Scratch',
    'Playing Cards',
    'Pen & Paper'
  ],
  imageUrl: '/images/projects/hackerkids.jpg'
}];


const state = {
  currentIndex: 0,
  view: 'landing',
  isTransitioning: false
};
const views = {
  landing: {
    next: () => {
      hideView('landing', -window.innerHeight);
    }
  },
  project: {
    prev: () => {
      if (state.currentIndex === 0) {
        showView('landing');
      } else {
        goToProject(state.currentIndex - 1);
      }
    },
    next: () => {
      if (state.currentIndex === projects.length - 1) {
        showView('contact');
      } else {
        goToProject(state.currentIndex + 1);
      }
    }
  },
  contact: {
    prev: () => {
      hideView('contact', window.innerHeight);
    }
  }
};

displayProject(0);

$('body').on('mousewheel', event => {
  event.preventDefault();
  const delta = event.originalEvent.wheelDelta;
  const view = views[state.view];
  if (!state.isTransitioning) {
    if (delta > 50 && view.prev) {
      view.prev();
    }
    if (delta < -50 && view.next) {
      view.next();
    }
  }
});

let yStart, yDiff;
document.addEventListener('touchstart', event => {
  yStart = event.touches[0].clientY;
});
document.addEventListener('touchmove', event => {
  event.preventDefault();
  yDiff = event.touches[0].clientY - yStart;
}, {passive: false });
document.addEventListener('touchend', event => {
  if (!state.isTransitioning) {
    const view = views[state.view];
    if (yDiff < -100 && view.next) {
      view.next();
    }
    if (yDiff > 100 && view.prev) {
      view.prev();
    }
  }
}, {passive: false });

document.addEventListener('keydown', event => {
  if (!state.isTransitioning) {
    const view = views[state.view];
    if (event.keyCode === 40 && view.next) {
      view.next();
    }
    if (event.keyCode === 38 && view.prev) {
      view.prev();
    }
  }
});

$('#contactLink').click(() => {
  showView('contact');
});
$('#contactClose').click(() => {
  hideView('contact', window.innerHeight);
});


function hideView(viewName, yOffset) {
  state.isTransitioning = true;
  TweenLite.to($(`.${viewName}`), 0.7, {
    y: yOffset,
    onComplete: () => {
      state.isTransitioning = false;
      state.view = 'project';
    }
  })
}

function showView(viewName) {
  state.isTransitioning = true;
  TweenLite.to($(`.${viewName}`), 0.7, {
    y: 0,
    onComplete: () => {
      state.isTransitioning = false;
      state.view = viewName;
    }
  });
}

function getProjectElements() {
  const el = $('.project');
  const pagination = el.find('.project__pagination span');
  const indicatorItems = el.find('.indicators__item');
  const title = el.find('.project__title span');
  const divider = el.find('.project__content .divider');
  const description = el.find('.project__description div');
  const stack = el.find('.project__stack ul');
  const image = el.find('.project__image');
  const link = el.find('.project__link');

  return {
    pagination,
    indicatorItems,
    title,
    divider,
    description,
    stack,
    image,
    link
  };
}

function displayProject(projectIndex) {
  const project = projects[projectIndex];
  const {
    pagination,
    indicatorItems,
    title,
    description,
    image,
    link
  } = getProjectElements();


// Pagination
  pagination.text(projectIndex + 1);
  indicatorItems.on('click', function () {
    goToProject($(this).index());
  });
  indicatorItems.eq(projectIndex).addClass('is-active');

  title.text(project.title);
  description.text(project.description);
  image.attr('src', project.imageUrl);
  link.attr('href', project.url);
}

function goToProject(projectIndex) {
  const project = projects[projectIndex];

  if (!project) {
    return;
  }

  state.isTransitioning = true;

  const {
    pagination,
    indicatorItems,
    title,
    divider,
    description,
    stack,
    image,
    link
  } = getProjectElements();

  link.attr('href', project.url);
  if (!project.url) {
    TweenLite.to(link, 0.5, {opacity: 0});
  } else {
    TweenLite.to(link, 0.5, {opacity: 1});
  }

  TweenLite.to(pagination, 0.5, {
    y: pagination.height(),
    ease: Power1.easeIn,
    onComplete: () => {
     pagination.text(projectIndex + 1);
     TweenLite.to(pagination, 0.5, {
       y: 0
     });
    }
  });

  indicatorItems.removeClass('is-active')
    .eq(projectIndex)
    .addClass('is-active');

  TweenLite.to(title, 0.5, {
    y: title.height(),
    ease: Power1.easeIn,
    onComplete: () => {
      title.text(project.title);
      TweenLite.to(title, 0.5, {y: 0, ease: Power1.easeOut});
    }
  });

  TweenLite.to(divider, 0.5, {
    width: 0,
    ease: Power1.easeIn,
    onComplete: () => {
      TweenLite.to(divider, 0.5, {width: 60, ease: Power1.easeOut});
    }
  });

  TweenLite.to(description, 0.5, {
    y: description.height(),
    ease: Power1.easeIn,
    onComplete: () => {
      description.text(project.description);
      TweenLite.to(description, 0.5, {y: 0, ease: Power1.easeOut});
    }
  });

  TweenLite.to(stack, 0.5, {
    opacity: 0,
    ease: Power1.easeIn,
    onComplete: () => {
      const li = project.stack.map(stack => `<li>${stack}</li>`);
      stack.html(li);
      TweenLite.to(stack, 0.5, {
        opacity: 1
      });
    }
  });

  let middle = -image.height() / 2;
  const offset = 200;
  TweenLite.to(image, 0.5, {
    y: projectIndex > state.currentIndex ? middle - offset : middle + offset,
    opacity: 0,
    ease: Power1.easeIn,
    onComplete: () => {
      image.attr('src', project.imageUrl);
      image.on('load', () => {
        let middle = -image.height() / 2;
        TweenLite.set(image, {y: projectIndex > state.currentIndex ? middle + offset : middle - offset});
        TweenLite.to(image, 0.5, {
          y: middle,
          opacity: 1,
          ease: Power1.easeOut,
          onComplete: () => {
            state.isTransitioning = false;
            state.currentIndex = projectIndex;
          }
        });
      });
    }
  });
}