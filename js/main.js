document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.portfolioData === 'undefined') {
        console.error('portfolioData is missing.');
        return;
    }
    const data = window.portfolioData;

    // ── SVG icons keyed by area of interest ─────────────────────────────
    const ICONS = {
                'Physical AI': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="5.5" width="14" height="12.5" rx="3.5"/>
            <line x1="5" y1="11.5" x2="3.5" y2="11.5"/>
            <line x1="19" y1="11.5" x2="20.5" y2="11.5"/>
            <circle cx="9.3" cy="11" r="1.3" fill="currentColor" stroke="none"/>
            <circle cx="14.7" cy="11" r="1.3" fill="currentColor" stroke="none"/>
            <line x1="9.5" y1="15" x2="14.5" y2="15"/>
            <line x1="12" y1="3" x2="12" y2="5.5"/>
            <circle cx="12" cy="2.6" r="1.1" fill="currentColor" stroke="none"/>
        </svg>`,

        'Spatio-Temporal Reasoning': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="8"/>
            <line x1="12" y1="4" x2="12" y2="12"/>
            <line x1="12" y1="12" x2="16" y2="14"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
        </svg>`,

        'Robot Planning': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9.5 5 C7.8 5.2 8.4 8.2 6.6 10 C5.9 10.7 5.9 13.3 6.6 14 C8.4 15.8 7.8 18.8 9.5 19"/>
            <path d="M14.5 5 C16.2 5.2 15.6 8.2 17.4 10 C18.1 10.7 18.1 13.3 17.4 14 C15.6 15.8 16.2 18.8 14.5 19"/>
            <path d="M12 9.2 C12.2 11 12.9 11.6 14.6 12 C12.9 12.4 12.2 13 12 14.8 C11.8 13 11.1 12.4 9.4 12 C11.1 11.6 11.8 11 12 9.2 Z" fill="currentColor" stroke="none"/>
        </svg>`,

        'World Models': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="8"/>
            <path d="M4.8 9h14.4"/>
            <path d="M4.8 15h14.4"/>
            <path d="M12 4c2.1 2.2 3.2 5 3.2 8s-1.1 5.8-3.2 8"/>
            <path d="M12 4c-2.1 2.2-3.2 5-3.2 8s1.1 5.8 3.2 8"/>
        </svg>`,

        'Reinforcement Learning': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="5" cy="12" r="3"/>
            <rect x="15.5" y="8.7" width="6.5" height="6.6" rx="1.6"/>
            <path d="M8.2 9.0 Q12 4.3 15.0 8.3"/>
            <path d="M13.3 7.6 L15.0 8.3 L14.7 6.6"/>
            <path d="M15.0 15.7 Q12 19.7 8.2 15.0"/>
            <path d="M9.8 15.5 L8.2 15.0 L8.4 16.7"/>
        </svg>`,

        'Generative Modeling': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="19" x2="21" y2="19"/>
            <line x1="4" y1="19" x2="4" y2="4"/>
            <path d="M5 18.5 C7 18.3 7.2 16.5 8.2 13.5 C9.2 10.5 10.4 7 12.3 7 C14.1 7 15.2 10.2 16.1 13.2 C17 16.1 18.2 18.2 20 18.5"/>
            <path d="M5 18.5 C7.5 18.4 9 17.2 10.2 15.2 C11.4 13.2 12.8 10.2 14.2 9.2 C15.7 8.2 17.3 9.3 18.3 11.5 C19.2 13.5 19.5 16.2 20 18.5" stroke-dasharray="2.2 2"/>
            <circle cx="12.3" cy="7" r="0.9" fill="currentColor" stroke="none"/>
        </svg>`,
    };
    const DEFAULT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="7"/>
        <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/>
    </svg>`;

    // ── Render interests on every page ───────────────────────────────────
    const interestsCt = document.getElementById('hero-interests');
    if (interestsCt) {
        data.profile.areas_of_interest.forEach(area => {
            const thread = document.createElement('div');
            thread.className = 'thread';
            thread.innerHTML = `<span class="tile">${ICONS[area] || DEFAULT_ICON}</span><span class="lbl">${area}</span>`;
            interestsCt.appendChild(thread);
        });
    }

    // ── Per-page rendering ───────────────────────────────────────────────
    if (document.getElementById('hero-name')) renderHero(data.profile);
    if (document.getElementById('home-news')) renderNews(data.news);
    if (document.getElementById('education-list')) renderEducation(data.education);
    if (document.getElementById('experience-research')) renderExperienceSection('research', data.experience.research, false);
    if (document.getElementById('experience-industry')) renderExperienceSection('industry', data.experience.industry, false);
    if (document.getElementById('experience-voluntary')) renderExperienceSection('voluntary', data.experience.voluntary, false);
    if (document.getElementById('home-meta')) renderSkills(data.skills);
    if (document.getElementById('publications-list')) renderPublications(data.publications);
    if (document.getElementById('projects-grid')) renderProjects(data.projects);
    if (document.getElementById('talks-grid')) renderTalks(data.talks);
    if (document.getElementById('social-links')) renderFooter(data.contact);

    // ────────────────────────────────────────────────────────────────────
    function renderHero(profile) {
        const heroName = document.getElementById('hero-name');
        if (heroName) heroName.textContent = profile.name;

        const heroBio = document.getElementById('hero-bio');
        if (heroBio) heroBio.innerHTML = renderRichText(profile.about_home);

        const bioFull = document.getElementById('bio-full');
        if (bioFull) bioFull.innerHTML = renderRichText(profile.bio);

        document.querySelectorAll('#profile-image').forEach(img => { img.src = profile.image; });
    }

    // Renders a mix of paragraph strings and inline media items ({ image, alt }).
    function renderRichText(items) {
        if (!items) return '';
        return items.map(item => {
            if (item && typeof item === 'object' && item.image) {
                return `<img src="${item.image}" alt="${item.alt || ''}" class="bio-media" loading="lazy">`;
            }
            return `<p>${item}</p>`;
        }).join('');
    }

    function renderNews(news) {
        const ct = document.getElementById('home-news');
        if (!ct || !news) return;
        const ul = document.createElement('ul');
        ul.className = 'news-list';
        news.slice(0, 5).forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="ndate">${item.date}</span><span class="ncontent">${item.content}</span>`;
            ul.appendChild(li);
        });
        ct.appendChild(ul);
    }

    function renderEducation(eduList) {
        const ct = document.getElementById('education-list');
        if (!ct) return;
        eduList.forEach(edu => {
            const item = document.createElement('div');
            item.className = 'edu-item';
            item.setAttribute('tabindex', '0');

            // Build coursework HTML
            let cwHTML = '';
            if (edu.coursework) {
                if (typeof edu.coursework === 'object' && !Array.isArray(edu.coursework)) {
                    cwHTML = Object.entries(edu.coursework)
                        .map(([cat, courses]) => `<dt>${cat}</dt><dd>${courses}</dd>`)
                        .join('');
                } else {
                    cwHTML = `<dd>${edu.coursework}</dd>`;
                }
            }

            item.innerHTML = `
                <span class="when">${edu.period}</span>
                <strong>${edu.degree}</strong>
                <em>${edu.institution}</em>
                ${edu.grade ? `<span class="grade">${edu.grade}</span>` : ''}
                ${cwHTML ? `<dl class="edu-courses"><dt style="color:var(--muted);font-size:12px;margin-bottom:4px;">Key Coursework</dt>${cwHTML}</dl>` : ''}
            `;
            ct.appendChild(item);
        });
    }

    function renderExperienceSection(type, list, _unused) {
        const ct = document.getElementById(`experience-${type}`);
        if (!ct || !list) return;
        list.forEach(exp => {
            const item = document.createElement('div');
            item.className = 'item';

            const meta = [];
            if (exp.advisors) meta.push('Advisor(s): ' + exp.advisors.map(a => `<a href="${a.link}" target="_blank">${a.name}</a>`).join(', '));
            if (exp.team) meta.push(exp.team);

            let desc = '';
            if (exp.work && Array.isArray(exp.work)) {
                desc = `<ul>${exp.work.map(w => `<li>${w}</li>`).join('')}</ul>`;
            } else if (exp.description) {
                desc = `<p style="margin:6px 0 0;">${exp.description}</p>`;
            }

            let roles = '';
            if (exp.roles && Array.isArray(exp.roles)) {
                roles = `<div style="margin:10px 0 0 18px;">${exp.roles.map(r => `
                    <div style="margin-bottom:10px;">
                        <span class="when">${r.period}</span>
                        <strong style="font-size:14.5px;">${r.title}</strong>
                        ${r.team ? `<br><em style="font-size:13.5px;">${r.team}</em>` : ''}
                        ${r.description ? `<p style="margin:4px 0 0;font-size:14px;">${r.description}</p>` : ''}
                    </div>
                `).join('')}</div>`;
            }

            item.innerHTML = `
                <span class="when">${exp.period}</span>
                <strong>${exp.title}</strong>
                ${meta.length ? `<br><em style="font-size:14px;">${meta.join(' · ')}</em>` : ''}
                ${desc}
                ${roles}
            `;
            ct.appendChild(item);
        });
    }

    function renderSkills(skills) {
        const ct = document.getElementById('home-meta');
        if (!ct) return;
        const block = document.createElement('div');
        block.className = 'skills-block';
        for (const [cat, items] of Object.entries(skills)) {
            const catName = cat.replace(/_/g, ' ');
            const names = items.map(s => s.name).join(', ');
            const row = document.createElement('div');
            row.className = 'skill-cat';
            row.innerHTML = `<strong>${catName}:</strong> <span>${names}</span>`;
            block.appendChild(row);
        }
        ct.appendChild(block);
    }

    function renderPublications(pubs) {
        const ct = document.getElementById('publications-list');
        if (!ct) return;
        const ol = document.createElement('ol');
        ol.className = 'pub-list';
        pubs.forEach(pub => {
            const li = document.createElement('li');
            li.className = 'pub-item';
            // Bold the author "Kunal Kumar Sahoo"
            const authors = pub.authors.replace(/Kunal Kumar Sahoo/g, '<strong>Kunal Kumar Sahoo</strong>');
            const titleTag = pub.link
                ? `<a href="${pub.link}" target="_blank">${pub.title}</a>`
                : `<span>${pub.title}</span>`;
            li.innerHTML = `<div class="pub-body">
                ${titleTag}. ${authors}.
                ${pub.venue ? `<span class="pub-venue"><em>${pub.venue}</em>.</span>` : ''}
            </div>`;
            ol.appendChild(li);
        });
        ct.appendChild(ol);
    }

    function renderProjects(projects) {
        const ct = document.getElementById('projects-grid');
        if (!ct) return;
        projects.forEach(proj => {
            const row = document.createElement('div');
            row.className = 'media-row';
            row.innerHTML = `
                <div class="thumb">
                    <img src="${proj.img}" alt="${proj.title}" loading="lazy"
                         onerror="this.parentElement.style.display='none'">
                </div>
                <div class="body">
                    <h3>${proj.title}</h3>
                    <p>${proj.desc}</p>
                    <span class="tech">${proj.tech || ''}</span>
                </div>`;
            ct.appendChild(row);
        });
    }

    function renderTalks(talks) {
        const ct = document.getElementById('talks-grid');
        if (!ct) return;
        talks.forEach(talk => {
            const row = document.createElement('div');
            row.className = 'media-row';
            row.innerHTML = `
                <div class="thumb">
                    <img src="${talk.img}" alt="${talk.title}" loading="lazy"
                         onerror="this.parentElement.style.display='none'">
                </div>
                <div class="body">
                    <span class="when">${talk.date}</span>
                    <h3>${talk.title.replace(/\\n/g, ' ')}</h3>
                    <p>${talk.desc}</p>
                </div>`;
            ct.appendChild(row);
        });
    }

    function renderFooter(contact) {
        const emailEl = document.getElementById('contact-email');
        if (emailEl) {
            emailEl.textContent = contact.email;
            emailEl.href = `mailto:${contact.email}`;
        }
        const socCt = document.getElementById('social-links');
        if (socCt) {
            contact.socials.forEach(soc => {
                const a = document.createElement('a');
                a.href = soc.link;
                a.target = '_blank';
                a.textContent = soc.name;
                socCt.appendChild(a);
            });
        }
    }
});
