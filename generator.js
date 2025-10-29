document.addEventListener('DOMContentLoaded', () => {
    const linksContainer = document.getElementById('links-container');
    const addLinkBtn = document.getElementById('add-link-btn');
    const generateBtn = document.getElementById('generate-btn');
    const outputContainer = document.getElementById('output-container');
    const outputLinkInput = document.getElementById('output-link');
    const copyBtn = document.getElementById('copy-btn');

    function addLinkField() {
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

    addLinkBtn.addEventListener('click', addLinkField);
    addLinkField(); // Start with one field

    generateBtn.addEventListener('click', () => {
        const params = new URLSearchParams();
        
        const movieName = document.getElementById('movie-name').value.trim();
        const posterLink = document.getElementById('poster-link').value.trim();
        const languages = document.getElementById('languages').value.trim();

        if (!movieName || !posterLink || !languages) {
            alert('অনুগ্রহ করে মুভির নাম, পোস্টার এবং ভাষা পূরণ করুন।');
            return;
        }

        params.append('title', movieName);
        params.append('poster', posterLink);
        params.append('langs', languages);

        const linkGroups = document.querySelectorAll('.link-group');
        let linkDataFound = false;
        let validLinkCounter = 0; // একটি নতুন কাউন্টার যোগ করুন

        linkGroups.forEach(group => { // এখান থেকে index বাদ দিন
            const label = group.querySelector('.link-label').value.trim();
            const desc = group.querySelector('.link-desc').value.trim();
            const url = group.querySelector('.link-url').value.trim();
            
            if (label && desc && url) {
                params.append(`lb${validLinkCounter}`, label);
                params.append(`ds${validLinkCounter}`, desc);
                params.append(`ul${validLinkCounter}`, url);
                
                validLinkCounter++; // শুধুমাত্র সফলভাবে লিঙ্ক যোগ হলেই কাউন্টার বাড়ান
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
