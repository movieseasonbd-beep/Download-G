document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    // Populate movie info
    const movieTitle = params.get('title');
    const posterLink = params.get('poster');
    const languages = params.get('langs');
    const pageTitle = document.querySelector('title');

    if (movieTitle) {
        document.getElementById('movie-title').textContent = movieTitle;
        pageTitle.textContent = `${movieTitle} - Download Links`; // Set page title
    }
    if (posterLink) document.getElementById('poster-img').src = posterLink;
    
    const languageTagsContainer = document.getElementById('language-tags');
    if (languages) {
        languages.split(',').forEach(lang => {
            const tag = document.createElement('span');
            tag.className = 'lang-tag';
            tag.textContent = lang.trim();
            languageTagsContainer.appendChild(tag);
        });
    }

    // Populate download links
    const linksContainer = document.getElementById('download-links-container');
    const loadingMessage = document.getElementById('loading-message');
    let linksHTML = '';
    let i = 0;

    while (params.has(`lb${i}`)) {
        const label = params.get(`lb${i}`);
        const desc = params.get(`ds${i}`);
        const url = params.get(`ul${i}`);
        
       let badgeText = 'SD'; // ডিফল্ট হিসেবে SD থাকবে
if (label.includes('720')) badgeText = 'HD'; // 720p হলে HD
if (label.includes('1080')) badgeText = 'FHD'; // 1080p হলে FHD
if (label.toLowerCase().includes('4k')) badgeText = '4K'; // 4K হলে 4K

        linksHTML += `
            <div class="download-item">
                <div class="quality-badge">${badgeText}</div>
                <div class="download-info">
                    <h3>${label}</h3>
                    <p>${desc}</p>
                </div>
                <a href="${url}" class="download-button" download>
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>Download</span>
                </a>
            </div>
        `;
        i++;
    }

    if (linksHTML) {
        loadingMessage.style.display = 'none';
        linksContainer.innerHTML = linksHTML;
    } else {
        loadingMessage.textContent = 'কোনো ডাউনলোড লিঙ্ক পাওয়া যায়নি।';
    }
});
