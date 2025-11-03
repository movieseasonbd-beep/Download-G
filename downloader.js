document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    // Populate movie info
    const movieTitle = params.get('title');
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
    while (params.has(`slb${i}`)) {
        streamingOptions.push({
            label: params.get(`slb${i}`),
            url: params.get(`sul${i}`)
        });
        i++;
    }

    if (streamingOptions.length > 0) {
        // === নতুন কাস্টম ড্রপডাউন লজিক শুরু ===

        // ১. একটি আসল কিন্তু লুকানো <select> ট্যাগ তৈরি করুন যা মান ধরে রাখবে
        const originalSelect = document.createElement('select');
        originalSelect.style.display = 'none'; // এটিকে অদৃশ্য রাখুন
        streamingOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.url;
            opt.textContent = option.label;
            originalSelect.appendChild(opt);
        });
        qualitySelectorContainer.appendChild(originalSelect);

        // ২. কাস্টম ড্রপডাউন এর জন্য HTML এলিমেন্ট তৈরি করুন
        const customSelectContainer = document.createElement('div');
        customSelectContainer.classList.add('custom-select');

        const selectedItem = document.createElement('div');
        selectedItem.classList.add('select-selected');
        selectedItem.innerHTML = originalSelect.options[originalSelect.selectedIndex].innerHTML;
        customSelectContainer.appendChild(selectedItem);

        const optionsList = document.createElement('div');
        optionsList.classList.add('select-items', 'select-hide');

        Array.from(originalSelect.options).forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.innerHTML = option.innerHTML;
            
            if (index === originalSelect.selectedIndex) {
                optionDiv.classList.add('same-as-selected');
            }

            optionDiv.addEventListener('click', function() {
                originalSelect.selectedIndex = index;
                selectedItem.innerHTML = this.innerHTML;
                Array.from(optionsList.children).forEach(child => child.classList.remove('same-as-selected'));
                this.classList.add('same-as-selected');
                
                // আসল select-এ change ইভেন্ট ট্রিগার করুন
                originalSelect.dispatchEvent(new Event('change'));
                selectedItem.click(); // অপশন লিস্ট বন্ধ করুন
            });
            optionsList.appendChild(optionDiv);
        });

        customSelectContainer.appendChild(optionsList);
        qualitySelectorContainer.appendChild(customSelectContainer);
        
        // ৩. ক্লিক ইভেন্ট যোগ করুন
        selectedItem.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAllSelect(this);
            optionsList.classList.toggle('select-hide');
        });

        // ৪. iframe প্লেয়ার তৈরি করুন
        const iframe = document.createElement('iframe');
        iframe.className = 'movie-poster';
        iframe.src = streamingOptions[0].url;
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        mediaContainer.appendChild(iframe);

        // আসল select পরিবর্তনের ইভেন্ট লিসেনার
        originalSelect.addEventListener('change', () => {
            iframe.src = originalSelect.value;
        });

        // === নতুন কাস্টম ড্রপডাউন লজিক শেষ ===

    } else if (finalMediaLink) {
        // ... (বাকি কোড অপরিবর্তিত) ...
        if (finalMediaLink.includes('vercel.app') || finalMediaLink.includes('youtube.com/embed')) {
            const iframe = document.createElement('iframe');
            iframe.className = 'movie-poster';
            iframe.src = finalMediaLink;
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            mediaContainer.appendChild(iframe);
        } else {
            const img = document.createElement('img');
            img.className = 'movie-poster';
            img.src = finalMediaLink;
            img.alt = 'Movie Poster';
            mediaContainer.appendChild(img);
        }
    }

    const languageTagsContainer = document.getElementById('language-tags');
    if (languages) {
        languages.split(',').forEach(lang => {
            const tag = document.createElement('span');
            tag.className = 'lang-tag';
            tag.textContent = lang.trim();
            languageTagsContainer.appendChild(tag);
        });
    }

    // ... (ডাউনলোড লিঙ্ক পপুলেট করার কোড অপরিবর্তিত) ...
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
        linksHTML += `<div class="download-item"><div class="quality-badge">${badgeText}</div><div class="download-info"><h3>${label}</h3><p>${desc}</p></div><a href="${url}" class="download-button" download><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg><span>Download</span></a></div>`;
        j++;
    }

    if (linksHTML) {
        loadingMessage.style.display = 'none';
        linksContainer.innerHTML = linksHTML;
    } else {
        loadingMessage.textContent = 'কোনো ডাউনলোড লিঙ্ক পাওয়া যায়নি।';
    }

    function closeAllSelect(elmnt) {
        const x = document.getElementsByClassName("select-items");
        const y = document.getElementsByClassName("select-selected");
        for (let i = 0; i < y.length; i++) {
            if (elmnt == y[i]) {
                // continue;
            } else {
                x[i].classList.add("select-hide");
            }
        }
    }
    document.addEventListener("click", closeAllSelect);
});
