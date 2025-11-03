document.addEventListener('DOMContentLoaded', () => {
    // === পরিবর্তন শুরু: নতুন এলিমেন্ট যুক্ত করা ===
    const streamLinksContainer = document.getElementById('stream-links-container');
    const addStreamBtn = document.getElementById('add-stream-btn');
    const linksContainer = document.getElementById('links-container');
    const addLinkBtn = document.getElementById('add-link-btn');
    const generateBtn = document.getElementById('generate-btn');
    const outputContainer = document.getElementById('output-container');
    const outputLinkInput = document.getElementById('output-link');
    const copyBtn = document.getElementById('copy-btn');
    // === পরিবর্তন শেষ ===

    // === নতুন ফাংশন: স্ট্রিমিং লিঙ্ক ফিল্ড যোগ করার জন্য ===
    function addStreamField() {
        const div = document.createElement('div');
        div.classList.add('link-group', 'stream-group'); // নতুন ক্লাস 'stream-group'
        div.innerHTML = `
            <input type="text" placeholder="Quality Label (e.g., 1080p)" class="stream-label" required>
            <input type="url" placeholder="Player URL" class="stream-url" required>
            <button class="remove-btn">মুছুন</button>
        `;
        streamLinksContainer.appendChild(div);
        div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
    }

    function addDownloadField() {
        const div = document.createElement('div');
        div.classList.add('link-group');
        div.innerHTML = `
            <input type="text" placeholder="Quality Label (e.g., 1080p)" class="link-label" required>
            <input type="text" placeholder="Definition (e.g., High Definition)" class="link-desc" required>
            <input type="url" placeholder="Download URL" class="link-url" required>
            <button class="remove-btn">মুছুন</button>
        `;
        linksContainer.appendChild(div);
        div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
    }

    addStreamBtn.addEventListener('click', addStreamField);
    addLinkBtn.addEventListener('click', addDownloadField);
    addDownloadField(); // ডাউনলোড লিঙ্কের জন্য একটি ফিল্ড ডিফল্টভাবে থাকবে

    generateBtn.addEventListener('click', () => {
        const params = new URLSearchParams();
        
        const movieName = document.getElementById('movie-name').value.trim();
        const mediaLink = document.getElementById('media-link').value.trim(); // পরিবর্তিত
        const languages = document.getElementById('languages').value.trim();

        if (!movieName || !languages) {
            alert('অনুগ্রহ করে মুভির নাম এবং ভাষা পূরণ করুন।');
            return;
        }

        params.append('title', movieName);
        if (mediaLink) { // mediaLink ঐচ্ছিক
            params.append('media', mediaLink);
        }
        params.append('langs', languages);

        // === নতুন কোড: স্ট্রিমিং লিঙ্ক প্রসেস করার জন্য ===
        const streamGroups = document.querySelectorAll('.stream-group');
        let streamCounter = 0;
        streamGroups.forEach(group => {
            const label = group.querySelector('.stream-label').value.trim();
            const url = group.querySelector('.stream-url').value.trim();
            if (label && url) {
                params.append(`slb${streamCounter}`, label);
                params.append(`sul${streamCounter}`, url);
                streamCounter++;
            }
        });

        const linkGroups = document.querySelectorAll('.link-group:not(.stream-group)'); // শুধু ডাউনলোড লিঙ্ক
        let linkDataFound = false;
        let validLinkCounter = 0;

        linkGroups.forEach(group => {
            const label = group.querySelector('.link-label').value.trim();
            const desc = group.querySelector('.link-desc').value.trim();
            const url = group.querySelector('.link-url').value.trim();
            
            if (label && url) {
                params.append(`lb${validLinkCounter}`, label);
                params.append(`ds${validLinkCounter}`, desc || ''); 
                params.append(`ul${validLinkCounter}`, url);
                
                validLinkCounter++;
                linkDataFound = true;
            }
        });

        if (!linkDataFound) {
            alert('অনুগ্রহ করে অন্তত একটি ডাউনলোড অপশন যোগ করুন।');
            return;
        }

        const baseURL = window.location.href.replace('index.html', '').replace(/\/$/, '') + '/download.html';
        const finalLink = `${baseURL}?${params.toString()}`;

        outputLinkInput.value = finalLink;
        outputContainer.classList.remove('hidden');
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputLinkInput.value).then(() => {
            copyBtn.textContent = 'কপি হয়েছে!';
            setTimeout(() => { copyBtn.textContent = 'কপি'; }, 2000);
        });
    });
});
