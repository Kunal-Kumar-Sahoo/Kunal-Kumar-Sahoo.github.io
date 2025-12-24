document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Handling
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.toggle('light-mode', currentTheme === 'light');
    } else if (!prefersDarkScheme.matches) {
        document.body.classList.add('light-mode');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
    });

    // 2. Mobile Navigation
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    navMenu.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    })

    // 3. Data Loading (Global Variable)
    if (typeof portfolioData !== 'undefined') {
        const data = portfolioData;
        renderHero(data.profile);
        renderEducation(data.education);
        renderExperience(data.experience);
        renderSkills(data.skills);
        renderPublications(data.publications);
        renderProjects(data.projects);
        renderTalks(data.talks);
        renderFooter(data.contact);
    } else {
        console.error('portfolioData is missing. Ensure content.js is loaded.');
    }

    // 4. Render Functions

    function renderHero(profile) {
        document.title = `${profile.name} | AI & Robotics`;
        document.getElementById('hero-name').textContent = profile.name;
        document.getElementById('hero-bio').textContent = profile.about;
        document.getElementById('profile-image').src = profile.image;

        const typingText = document.getElementById('typing-text');
        const subtitles = profile.subtitles;
        let lineIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentLine = subtitles[lineIndex];
            if (isDeleting) {
                typingText.textContent = currentLine.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingText.textContent = currentLine.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentLine.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                lineIndex = (lineIndex + 1) % subtitles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();

        const interestsContainer = document.getElementById('hero-interests');
        profile.areas_of_interest.forEach(area => {
            const chip = document.createElement('span');
            chip.className = 'tech-chip';
            chip.textContent = area;
            interestsContainer.appendChild(chip);
        });
    }

    function renderEducation(eduList) {
        const container = document.getElementById('education-list');
        const modal = document.getElementById('edu-modal');
        const modalBody = document.getElementById('modal-body');
        const closeModal = document.querySelector('.close-modal');

        closeModal.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target == modal) modal.style.display = 'none';
        }

        eduList.forEach(edu => {
            const card = document.createElement('div');
            card.className = 'edu-card-small';
            card.innerHTML = `
                <div>
                   <h3 style="font-size:1.1rem; color:var(--text-primary); margin-bottom:5px;">${edu.degree}</h3>
                   <div style="font-family:var(--font-mono); font-size:0.85rem; color:var(--accent); margin-bottom:10px;">${edu.institution}</div>
                   <div class="card-subtitle">${edu.period}</div>
                </div>
                <div class="edu-click-hint">Click for details...</div>
            `;

            card.addEventListener('click', () => {
                modalBody.innerHTML = `
                    <h2 class="section-title" style="margin-bottom:20px; font-size:1.5rem;">${edu.degree}</h2>
                    <h3 class="highlight">${edu.institution}</h3>
                    <p style="margin-top:5px; font-family:var(--font-mono);">${edu.period} • ${edu.grade || edu.status}</p>
                    <hr style="border:0; border-top:1px dashed var(--text-secondary); margin:20px 0; opacity:0.3;">
                    <h4 style="margin-bottom:10px;">Coursework</h4>
                    ${typeof edu.coursework === 'object' && edu.coursework !== null && !Array.isArray(edu.coursework)
                        ? Object.entries(edu.coursework).map(([category, courses]) => `
                            <div style="margin-bottom: 12px;">
                                <h5 style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 4px; font-weight: 600;">${category}</h5>
                                <p style="color:var(--text-secondary); line-height:1.6; font-size: 0.9rem; margin: 0;">${courses}</p>
                            </div>
                        `).join('')
                        : `<p style="color:var(--text-secondary); line-height:1.8;">${edu.coursework}</p>`
                    }
                `;
                modal.style.display = 'flex';
            });

            container.appendChild(card);
        });
    }

    function renderExperience(experience) {
        const container = document.getElementById('experience-content');
        const tabs = document.querySelectorAll('.tab-btn[data-tab]');

        renderExpList('research');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderExpList(tab.dataset.tab);
            });
        });

        function renderExpList(type) {
            container.innerHTML = '';
            const list = experience[type];
            if (!list) return;

            list.forEach(exp => {
                const item = document.createElement('div');
                item.className = 'card exp-item';
                item.style.marginBottom = '20px';

                let advisorsHTML = '';
                if (exp.advisors) {
                    advisorsHTML = '<div class="card-subtitle">Advisor(s): ' +
                        exp.advisors.map(adv => `<a href="${adv.link}" target="_blank" class="highlight">${adv.name}</a>`).join(', ') +
                        '</div>';
                }

                let descHTML = '';
                if (exp.work) {
                    descHTML = `<ul style="margin-left:20px; list-style-type:disc; color:var(--text-secondary);">${exp.work.map(w => `<li style="margin-bottom:5px;">${w}</li>`).join('')}</ul>`;
                } else if (exp.description) {
                    descHTML = `<p>${exp.description}</p>`;
                }

                item.innerHTML = `
                    <div class="card-header">
                        <h3 class="card-title">${exp.title}</h3>
                        <span class="card-subtitle">${exp.period}</span>
                    </div>
                    ${advisorsHTML}
                    ${exp.team ? `<div class="card-subtitle">${exp.team}</div>` : ''}
                    <br>
                    ${descHTML}
                `;
                container.appendChild(item);
            });
        }
    }

    function renderSkills(skills) {
        const container = document.getElementById('skills-grid');
        for (const [category, items] of Object.entries(skills)) {
            const catDiv = document.createElement('div');
            catDiv.className = 'skill-category';
            const catName = category.replace(/_/g, ' ');

            const chipsHTML = items.map(skill => `
                <span class="skill-chip-small">${skill.name}</span>
            `).join('');

            catDiv.innerHTML = `
                <h3 style="text-transform:capitalize;">${catName}</h3>
                <div class="skill-box">
                    ${chipsHTML}
                </div>
            `;
            container.appendChild(catDiv);
        }
    }

    function renderPublications(pubs) {
        const container = document.getElementById('publications-list');
        const pubTabs = document.querySelectorAll('.tab-btn[data-pub-tab]');

        const categories = { 'Journal': [], 'Conference': [], 'Preprint': [], 'Patent': [] };
        pubs.forEach(p => {
            let cat = 'Other';
            if (p.type && p.type.includes('PATENT')) cat = 'Patent';
            else if (p.type && p.type.includes('JOURNAL')) cat = 'Journal';
            else if (p.type && p.type.includes('CONFERENCE')) cat = 'Conference';
            else if (p.type && p.type.includes('PREPRINT')) cat = 'Preprint';

            if (categories[cat]) categories[cat].push(p);
        });

        pubTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                pubTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderPubList(tab.dataset.pubTab);
            });
        });

        function renderPubList(category) {
            container.innerHTML = '';
            const items = categories[category];
            if (!items || items.length === 0) {
                container.innerHTML = '<p class="text-center" style="opacity:0.6;">No items found.</p>';
                return;
            }

            items.forEach(pub => {
                const item = document.createElement('div');
                item.className = 'pub-item';
                item.innerHTML = `
                    <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                        <a href="${pub.link || '#'}" target="_blank" style="font-size:1.1rem; font-weight:700;">${pub.title}</a>
                        <span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent);">${pub.type}</span>
                    </div>
                    <p style="margin-top:5px; font-size:0.95rem;">${pub.authors}</p>
                    ${pub.venue ? `<p style="font-size:0.85rem; color: var(--text-secondary);">${pub.venue}</p>` : ''}
                    ${pub.id ? `<p style="font-size:0.85rem; color: var(--text-secondary);">${pub.id}</p>` : ''}
                `;
                container.appendChild(item);
            });
        }

        renderPubList('Journal');
    }

    function renderProjects(projects) {
        const container = document.getElementById('projects-grid');
        projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card';
            const techs = proj.tech ? proj.tech.split(',').map(t => t.trim()) : [];
            card.innerHTML = `
                <div class="project-img-wrapper">
                    <img src="${proj.img}" alt="${proj.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200?text=Project'">
                </div>
                <div class="project-content">
                    <h3 class="card-title">${proj.title}</h3>
                    <p style="font-size:0.95rem; margin-bottom:15px;">${proj.desc}</p>
                    <div class="project-tech-stack">
                        ${techs.map(t => `<span>${t}</span>`).join(' • ')}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function renderTalks(talks) {
        const container = document.getElementById('talks-grid');
        talks.forEach(talk => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="project-img-wrapper">
                    <img src="${talk.img}" alt="${talk.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200?text=Talk'">
                </div>
                <div class="project-content">
                    <h3 class="card-title" style="font-size:1.1rem;">${talk.title}</h3>
                    <p style="font-size:0.95rem;">${talk.desc}</p>
                    <div style="margin-top:auto; font-weight:700; color:var(--accent);">${talk.date}</div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function renderFooter(contact) {
        document.getElementById('contact-email').textContent = contact.email;
        document.getElementById('contact-email').href = `mailto:${contact.email}`;

        const socialContainer = document.getElementById('social-links');
        contact.socials.forEach(soc => {
            const link = document.createElement('a');
            link.className = 'social-icon';
            link.href = soc.link;
            link.target = '_blank';

            if (soc.name === 'X') {
                link.innerHTML = '<i class="devicon-twitter-original"></i>';
            } else if (soc.name === 'Blog') {
                if (soc.icon) link.innerHTML = `<i class="${soc.icon}"></i>`;
                else link.innerHTML = '<span>Blog</span>';
            } else if (soc.icon) {
                link.innerHTML = `<i class="${soc.icon}"></i>`;
            } else {
                link.textContent = soc.name;
            }

            link.setAttribute('aria-label', soc.name);
            socialContainer.appendChild(link);
        });
    }
});
