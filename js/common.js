/* ─── Common UI functionality for PianoScales ─── */

document.addEventListener('DOMContentLoaded', () => {
    initPianoDivider();
    initScrollReveal();
});

/**
 * Generates the signature piano key SVG divider at the foot of hero sections
 */
function initPianoDivider() {
    const host = document.getElementById('pianoKeys');
    if (!host) return;

    const W      = Math.max(window.innerWidth, 320);
    const WH     = 64;   // white key height
    const WW     = 32;   // white key width
    const BH     = 40;   // black key height
    const BW     = 20;   // black key width
    const count  = Math.ceil(W / WW) + 4;
    // Black key positions within each 7-key octave
    const bPos   = [0, 1, 3, 4, 5];

    let svg = `<svg viewBox="0 0 ${count * WW} ${WH}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">`;

    // White keys
    for (let i = 0; i < count; i++) {
        svg += `<rect x="${i * WW + 1}" y="0" width="${WW - 2}" height="${WH}"
            rx="3" fill="rgba(240,236,255,0.045)" stroke="rgba(139,92,246,0.2)" stroke-width="1"/>`;
    }
    // Black keys
    const octaves = Math.ceil(count / 7) + 1;
    for (let o = 0; o < octaves; o++) {
        for (const b of bPos) {
            const wi = o * 7 + b;
            if (wi >= count - 1) continue;
            const bx = (wi + 1) * WW - BW / 2;
            svg += `<rect x="${bx}" y="0" width="${BW}" height="${BH}"
                rx="2" fill="rgba(100,60,220,0.32)" stroke="rgba(139,92,246,0.4)" stroke-width="1"/>`;
        }
    }
    svg += '</svg>';
    host.innerHTML = svg;
}

let revealObserver;

/**
 * Handles the reveal-on-scroll animation
 */
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');

    revealObserver = new IntersectionObserver(
        entries => entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revealObserver.unobserve(e.target);
            }
        }),
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    els.forEach(el => revealObserver.observe(el));
}

/**
 * Manually observe new elements added to the DOM
 */
function observeNewElements(container) {
    if (!revealObserver) return;
    const els = container.querySelectorAll('.reveal:not(.visible)');
    els.forEach(el => revealObserver.observe(el));
}
