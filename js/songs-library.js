document.addEventListener('DOMContentLoaded', () => {
    const songsGrid = document.getElementById('songsGrid');
    const songSearch = document.getElementById('songSearch');
    const emptyState = document.getElementById('emptyState');

    let allSongs = [];

    // Fetch songs from index
    fetch('json/songs_index.json')
        .then(response => response.json())
        .then(data => {
            allSongs = data;
            renderSongs(allSongs);
        })
        .catch(error => {
            console.error('Error loading songs:', error);
            songsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Failed to load song library. Please try again later.</p>';
        });

    function renderSongs(songs) {
        if (songs.length === 0) {
            songsGrid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        songsGrid.style.display = 'grid';

        songsGrid.innerHTML = songs.map(song => {
            const diffClass = `diff-${song.difficulty.toLowerCase()}`;
            // Create an SEO friendly URL
            const songUrl = `song.html?id=${song.songId}`;

            return `
                <a href="${songUrl}" class="song-item-card reveal">
                    <div class="song-meta">
                        <span class="difficulty-badge ${diffClass}">${song.difficulty}</span>
                        <span style="font-size: 1.2rem;">🎵</span>
                    </div>
                    <h3>${song.title}</h3>
                    <p>${song.description}</p>
                    <div class="view-notes-btn">
                        View Notes <span>→</span>
                    </div>
                </a>
            `;
        }).join('');

        // Use the common observer for reveal animations
        if (typeof observeNewElements === 'function') {
            observeNewElements(songsGrid);
        } else {
            // Fallback if common.js is not loaded
            const els = songsGrid.querySelectorAll('.reveal');
            els.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 50);
            });
        }
    }

    // Search logic
    songSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allSongs.filter(song =>
            song.title.toLowerCase().includes(query) ||
            song.description.toLowerCase().includes(query) ||
            song.difficulty.toLowerCase().includes(query) ||
            song.songId.toLowerCase().includes(query)
        );
        renderSongs(filtered);
    });
});
