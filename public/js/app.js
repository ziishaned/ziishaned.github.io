class App {
    constructor() {
    	this.posts = [];
    	this.fetchPosts();
    	this.bindui();
    }

    bindui() {
    	let that = this;
    	let searchInput = document.getElementById('search-input');
		
		if(searchInput) {
	    	searchInput.addEventListener('focusin', () => {
		        document.getElementsByClassName('show-results-count')[0].classList.add('active');
	    	});
	    	searchInput.addEventListener('focusout', () => {
		        document.getElementsByClassName('show-results-count')[0].classList.remove('active');
	    	});

	    	searchInput.addEventListener('keyup', (e) => {
				if(e.target.value != '') {
					let html 		 = '';
					let totalMatches = 0;
					let searchText 	 = e.target.value;
					document.getElementById('results-container').innerHTML = '';
					Array.prototype.forEach.call(that.posts, (el, i) => {
					    if(that.matchString(el.title, searchText)) {
							totalMatches++;
							html += `<li><a href="${window.location.href + el.url}">${el.title}</a></li>`;
					    }
					});
					document.getElementById('results-container').innerHTML = html;
					document.getElementsByClassName('show-results-count')[0].querySelectorAll('#counter')[0].innerText = totalMatches;
				} else {
					document.getElementById('results-container').innerHTML = '';
					document.getElementsByClassName('show-results-count')[0].querySelectorAll('#counter')[0].innerText = 0;
				}
	    	});
		}
    }

    matchString(str1, str2) {
	    return str1.toLowerCase().indexOf(str2.toLowerCase()) != -1;
	}

    fetchPosts() {
    	let that = this;
		fetch("/search.json").then(response => response.json()).then(json => that.posts = json);
    }
}

(() => {
	const app = new App;
})();