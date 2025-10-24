document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    // Populate movie info
    const movieTitle = params.get('title');
    const posterLink = params.get('poster');
    const languages = params.get('langs');

    if (movieTitle) document.getElementById('movie-title').textContent = movieTitle;
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
        
        // Generate badge text from label (e.g., 1080p -> HD, 720p -> FHD, 4k -> 4K)
        let badgeText = 'SD';
        if (label.includes('1080')) badgeText = 'HD';
        if (label.includes('720')) badgeText = 'FHD';
        if (label.toLowerCase().includes('4k')) badgeText = '4K';

        linksHTML += `
            <div class="download-item">
                <div class="quality-badge">${badgeText}</div>
                <div class="download-info">
                    <h3>${label}</h3>
                    <p>${desc}</p>
                </div>
                <a href="${url}" class="download-button" download>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414L12 15.586zM12 4a1 1 0 00-1 1v8a1 1 0 002 0V5a1 1 0 00-1-1z"/></svg>
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
