document.addEventListener('DOMContentLoaded', () => {
    const buttonsContainer = document.getElementById('buttons-container');
    const loadingMessage = document.getElementById('loading-message');
    
    const params = new URLSearchParams(window.location.search);
    let linkFound = false;
    let i = 1;

    while (true) {
        const title = params.get(`title${i}`);
        const link = params.get(`link${i}`);

        if (!title || !link) {
            break;
        }
        
        linkFound = true;
        const button = document.createElement('a');
        button.href = link;
        button.textContent = title;
        button.classList.add('download-button');
        button.setAttribute('download', ''); // This attribute suggests the browser to download the file

        buttonsContainer.appendChild(button);
        i++;
    }

    if(linkFound) {
        loadingMessage.style.display = 'none';
    } else {
        loadingMessage.textContent = 'কোনো ডাউনলোড লিঙ্ক পাওয়া যায়নি।';
    }
});
