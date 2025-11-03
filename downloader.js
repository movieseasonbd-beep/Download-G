document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    // Populate movie info
    const movieTitle = params.get('title');
    
    // === পরিবর্তন: পুরনো 'poster' এবং নতুন 'media' দুটোকেই সাপোর্ট করার জন্য ===
    // যদি 'media' থাকে সেটা নিবে, না থাকলে 'poster' আছে কিনা দেখবে।
    const finalMediaLink = params.get('media') || params.get('poster'); 
    
    const languages = params.get('langs');
    const pageTitle = document.querySelector('title');

    if (movieTitle) {
        document.getElementById('movie-title').textContent = movieTitle;
        pageTitle.textContent = `${movieTitle} - Download Links`;
    }

    const mediaContainer = document.getElementById('media-display-container');
    const qualitySelectorContainer = document.getElementById('quality-selector-container');
    const streamingOptions = [];
    let i = 0;
    while(params.has(`slb${i}`)) {
        streamingOptions.push({
            label: params.get(`slb${i}`),
            url: params.get(`sul${i}`)
        });
        i++;
    }

    // স্ট্রিমিং অপশন বা মিডিয়া লিঙ্ক দেখানোর যুক্তি
    if (streamingOptions.length > 0) {
        // ড্রপডাউন তৈরি করুন
        const select = document.createElement('select');
        select.id = 'quality-selector';
        streamingOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.url;
            opt.textContent = option.label;
            select.appendChild(opt);
        });
        qualitySelectorContainer.appendChild(select);

        // iframe প্লেয়ার তৈরি করুন
        const iframe = document.createElement('iframe');
        iframe.className = 'movie-poster';
        iframe.src = streamingOptions[0].url; // প্রথম লিঙ্কটি ডিফল্ট হিসেবে দেখাবে
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        mediaContainer.appendChild(iframe);

        // ড্রপডাউন পরিবর্তনের ইভেন্ট লিসেনার
        select.addEventListener('change', (e) => {
            iframe.src = e.target.value;
        });

    } else if (finalMediaLink) { // === পরিবর্তন: এখানে finalMediaLink ব্যবহার করা হয়েছে ===
        // যদি শুধু একটি মিডিয়া লিঙ্ক থাকে (পোস্টার বা ভিডিও)
        // লিঙ্কটি প্লেয়ারের কিনা তা जांच করা হচ্ছে
        if (finalMediaLink.includes('vercel.app') || finalMediaLink.includes('youtube.com/embed')) {
            const iframe = document.createElement('iframe');
            iframe.className = 'movie-poster';
            iframe.src = finalMediaLink;
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            mediaContainer.appendChild(iframe);
        } else {
            // লিঙ্কটি একটি ছবি হলে
            const img = document.createElement('img');
            img.className = 'movie-poster';
            img.src = finalMediaLink;
            img.alt = 'Movie Poster';
            mediaContainer.appendChild(img);
        }
    }

    const languageTagsContainer = document.getElementById('language-tags');
    if (languages) {
        languageTagsContainer.style.marginTop = '8px'; // ভাষা ট্যাগ থাকলে ড্রপডাউন থেকে একটু নিচে দেখাবে
        languages.split(',').forEach(lang => {
            const tag = document.createElement('span');
            tag.className = 'lang-tag';
            tag.textContent = lang.trim();
            languageTagsContainer.appendChild(tag);
        });
    }

    // ডাউনলোড লিঙ্ক পপুলেট করার কোড
    const linksContainer = document.getElementById('download-links-container');
    const loadingMessage = document.getElementById('loading-message');
    let linksHTML = '';
    let j = 0;

    while (params.has(`lb${j}`)) {
        const label = params.get(`lb${j}`);
        const desc = params.get(`ds${j}`);
        const url = params.get(`ul${j}`);
        
        let badgeText = 'SD'; 
        if (label.includes('720')) badgeText = 'HD';
        if (label.includes('1080')) badgeText = 'FHD';
        if (label.toLowerCase().includes('4k')) badgeText = '4K';

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
        j++;
    }

    if (linksHTML) {
        loadingMessage.style.display = 'none';
        linksContainer.innerHTML = linksHTML;
    } else {
        loadingMessage.textContent = 'কোনো ডাউনলোড লিঙ্ক পাওয়া যায়নি।';
    }
});
