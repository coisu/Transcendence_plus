// Router.js
import Home from '@views/Home.js';
import Tournament from '@views/Tournament.js';
import Options from '@views/Options.js';
import Game from '@views/Game.js';
import Login from '@views/Login.js';
import NotFound from '@views/NotFound.js';


export const routes = {
	'/': {
		path: '/',
		view: Home,
		title: 'Pongiverse',
		buttonText: 'Home'
	},
	'/play': {
		path: '/play',
		view: Game,
		title: 'Game',
		buttonText: 'Play'
	},
	'/game': {
		path: '/game',
		view: Game,
		title: 'Game',
		buttonText: 'Play'
	},
	'/tournament': {
		path: '/tournament',
		view: Tournament,
		title: 'Tournament',
		buttonText: 'Tournament'
	},
	'/options': {
		path: '/options',
		view: Options,
		title: 'Options',
		buttonText: 'Options'
	},
	'/login': {
		path: '/login',
		view: Login,
		title: 'Login',
		buttonText: 'Login'
	},
	'/404': {
		path: '/404',
		view: NotFound,
		title: '404 Not Found',
		buttonText: 'Not Found Page'
	}
};

let currentView = null;

export const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const path = window.location.pathname;
  const View = routes[path] || routes['/404'];

  if (currentView && currentView.destroy && currentView !== View) {
    currentView.destroy();
  }

  currentView = new View.view();

  document.querySelector('#view').innerHTML = await currentView.getHtml();
  document.title = View.title;
  if (currentView.init) {
    currentView.init();
  }
};

window.addEventListener("popstate", router);

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', event => {
    if (event.target.matches('[nav-link]')) {
      event.preventDefault();
      if (event.target.href !== document.URL)
        navigateTo(event.target.href);
    }
  });
  router();
});

export default router;