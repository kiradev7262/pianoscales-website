document.addEventListener('DOMContentLoaded', () => {
    const songHeader = document.getElementById('songHeader');
    const notesContainer = document.getElementById('notesContainer');

    // Get song ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const songId = urlParams.get('id');

    if (!songId) {
        window.location.href = 'songs.html';
        return;
    }

    // Fetch song data
    fetch(`json/songs/${songId}.json`)
        .then(response => {
            if (!response.ok) throw new Error('Song not found');
            return response.json();
        })
        .then(song => {
            document.title = `${song.title} — PianoScales`;
            renderSongHeader(song);
            renderNotes(song.lines);
        })
        .catch(error => {
            console.error('Error loading song:', error);
            songHeader.innerHTML = `
                <h1 style="color: #ef4444;">Song Not Found</h1>
                <p>Sorry, we couldn't find the song you're looking for.</p>
                <a href="songs.html" class="btn-secondary">Return to Library</a>
            `;
        });

    function renderSongHeader(song) {
        const diffClass = `diff-${song.difficulty.toLowerCase()}`;
        songHeader.innerHTML = `
            <div class="difficulty-tag ${diffClass}">${song.difficulty}</div>
            <h1>${song.title}</h1>
            <p>${song.description}</p>
        `;
    }

    function renderNotes(lines) {
        if (!lines || lines.length === 0) {
            notesContainer.innerHTML = '<p style="text-align: center; color: var(--text-3);">No notes available for this song.</p>';
            return;
        }

        notesContainer.innerHTML = lines.map((line, index) => {
            const notesHtml = line.map(note => {
                // Split note and octave (e.g., "C#5" -> "C#", "5")
                const match = note.match(/^([A-G]#?)(\d)$/);
                const noteName = match ? match[1] : note;
                const octave = match ? match[2] : '';

                return `
                    <div class="note-chip">
                        <span class="note-name">${noteName}</span>
                        ${octave ? `<span class="note-octave">${octave}</span>` : ''}
                    </div>
                `;
            }).join('');

            return `
                <div class="note-line reveal" style="transition-delay: ${index * 100}ms">
                    ${notesHtml}
                </div>
            `;
        }).join('');

        // Use the common observer for reveal animations
        if (typeof observeNewElements === 'function') {
            observeNewElements(notesContainer);
        } else {
            // Fallback
            setTimeout(() => {
                const els = notesContainer.querySelectorAll('.reveal');
                els.forEach(el => el.classList.add('visible'));
            }, 100);
        }
    }
});
