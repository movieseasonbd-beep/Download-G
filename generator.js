document.addEventListener('DOMContentLoaded', () => {
    const linksContainer = document.getElementById('links-container');
    const addLinkBtn = document.getElementById('add-link-btn');
    const generateBtn = document.getElementById('generate-btn');
    const outputContainer = document.getElementById('output-container');
    const outputLinkInput = document.getElementById('output-link');
    const copyBtn = document.getElementById('copy-btn');
    let linkCount = 0;

    function addLinkField() {
        linkCount++;
        const div = document.createElement('div');
        div.classList.add('link-group');
        div.innerHTML = `
            <input type="text" placeholder="বাটনের নাম (e.g., 720p Download)" class="link-title">
            <input type="url" placeholder="ডাউনলোড লিঙ্ক" class="link-url">
            <button class="remove-btn">মুছে ফেলুন</button>
        `;
        linksContainer.appendChild(div);
        
        div.querySelector('.remove-btn').addEventListener('click', () => {
            div.remove();
        });
    }

    addLinkBtn.addEventListener('click', addLinkField);
    
    // শুরুতে দুটি ফিল্ড যোগ করা
    addLinkField();
    addLinkField();

    generateBtn.addEventListener('click', () => {
        const linkGroups = document.querySelectorAll('.link-group');
        const params = new URLSearchParams();

        linkGroups.forEach((group, index) => {
            const title = group.querySelector('.link-title').value.trim();
            const url = group.querySelector('.link-url').value.trim();
            if (title && url) {
                params.append(`title${index + 1}`, title);
                params.append(`link${index + 1}`, url);
            }
        });

        if (params.toString() === "") {
            alert('অনুগ্রহ করে অন্তত একটি লিঙ্ক এবং শিরোনাম পূরণ করুন।');
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
            setTimeout(() => { copyBtn.textContent = 'কপি করুন'; }, 2000);
        });
    });
});
