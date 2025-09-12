// Core interactions: smooth anchors, mobile nav, populate projects, horizontal keyboard support
document.addEventListener('DOMContentLoaded', () => {
  // Smooth internal anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        const t = document.querySelector(href);
        if (t) t.scrollIntoView({behavior: 'smooth', block: 'start'});
        // close mobile nav if open
        closeMobileNav();
      }
    });
  });

  // Mobile nav toggles
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const hamburgerClose = document.getElementById('hamburgerClose');

  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('active');
    mobileNav.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('active');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (hamburger) hamburger.addEventListener('click', openMobileNav);
  if (hamburgerClose) hamburgerClose.addEventListener('click', closeMobileNav);
  // close if clicking outside mobile-inner
  if (mobileNav) mobileNav.addEventListener('click', (ev) => {
    if (ev.target === mobileNav) closeMobileNav();
  });

  // Keyboard ESC closes mobile nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  // Keyboard navigation for horizontal tracks: edu, projects and about areas
  ['edu-track','projects-scroll','about-areas'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute('tabindex','0');
      el.addEventListener('keydown', (ev) => {
        const step = 340;
        if (ev.key === 'ArrowRight') el.scrollBy({left: step, behavior: 'smooth'});
        if (ev.key === 'ArrowLeft') el.scrollBy({left: -step, behavior: 'smooth'});
      });
    }
  });

  // Populate projects from the original portfolio list (images expected in media/)
  const projects = [
    {"img":"media/ucb-fl.jpg","title":"UCB-FL","desc":"Learning-based client selection strategy for federated learning using UCB. Winner — SysML challenge.","tech":"Python, PyTorch, Pandas, Matplotlib"},
    {"img":"media/Minor Project-1_page-0001.jpg","title":"RL for Manipulation Skills","desc":"Deep RL policies for dexterous manipulation including in-hand rotation and torque control tasks.","tech":"MuJoCo, PyTorch, Stable Baselines 3"},
    {"img":"media/Summer Internship Poster Format 2024.pptx(1).png","title":"RL for Traffic Optimization","desc":"Applied RL to traffic-signal control and evaluated throughput improvements in simulation.","tech":"Gym, SUMO, PyTorch"},
    {"img":"media/radionet.jpeg","title":"Radionet — RF Human Detection","desc":"RF-based presence detection using conv-nets for classification on edge devices.","tech":"EdgeML, PyTorch"},
    {"img":"media/Poster format for Symposium.pptx.png","title":"RadarNet — Range-Azimuth Detection","desc":"Radar processing pipeline for 2D localization and object detection.","tech":"Signal Processing, PyTorch"},
    {"img":"media/Copy of Copy of Final Autonomous Driving using CV.png","title":"3D Bounding Boxes on Dashboard Feed","desc":"Depth estimation fused with YOLO to compute 3D bounding boxes (KITTI).","tech":"YOLO, Depth Nets"},
    {"img":"media/Copy of Poster - PTM.png","title":"IoT Based Intelligent Posture Monitor","desc":"IoT-based solution for real-time posture monitoring using computer vision and machine learning.","tech":"MediaPipe, OpenCV, Scikit-Learn, ZigBee"},
    {"img":"media/swam.png","title":"Swarm Drone Formation","desc":"Swarming-inspired control algorithms for making geometrical formations by 3-5 drones.","tech":"ROS, Gazebo, C++, Python"},
    {"img":"media/technoxian.png","title":"Micromouse robot","desc":"A compact, wheeled-robot to explore a given maze and learn to solve it. It uses ultrasonic sensors to perceive its environment and identify open paths and walls.","tech":"C++, Arduino Nano"},
  ];

  const projectsContainer = document.getElementById('projects-scroll');
  if (projectsContainer) {
    projects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';

      const media = document.createElement('div');
      media.className = 'project-image';
      const img = document.createElement('img');
      img.src = p.img;
      img.alt = p.title;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.onerror = function(){ media.textContent = '📁'; if (img.parentNode) img.parentNode.removeChild(img); };
      media.appendChild(img);

      const body = document.createElement('div');
      body.className = 'project-content';
      const title = document.createElement('div');
      title.className = 'project-title';
      title.textContent = p.title;
      const desc = document.createElement('p');
      desc.textContent = p.desc;
      const techDiv = document.createElement('div');
      techDiv.className = 'project-tech';
      p.tech.split(',').forEach(t => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = t.trim();
        techDiv.appendChild(span);
      });

      body.appendChild(title);
      body.appendChild(desc);
      body.appendChild(techDiv);

      card.appendChild(media);
      card.appendChild(body);
      projectsContainer.appendChild(card);
    });
  }

  // Convert vertical wheel to horizontal scroll for tracks (improves touchpad UX)
  function enableWheelScroll(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.addEventListener('wheel', (evt) => {
      if (evt.deltaY === 0) return;
      evt.preventDefault();
      el.scrollBy({ left: evt.deltaY * 1.5, behavior: 'smooth' });
    }, { passive: false });
  }
  enableWheelScroll('#edu-track');
  enableWheelScroll('#projects-scroll');
  enableWheelScroll('#about-areas');

  // ----------------- Typing animation -----------------
  // Texts to type
  const line1 = "Hello, World! I am Kunal 👨‍💻";
  const line2 = "AI Researcher & Ph.D. Student";

  // sleep helper
  const wait = ms => new Promise(res => setTimeout(res, ms));

  async function typeToElement(text, el, speed = 70, startDelay = 0) {
    if (!el) return;
    await wait(startDelay);
    el.textContent = ""; // ensure empty
    for (let i = 0; i < text.length; i++) {
      el.textContent += text[i];
      const jitter = Math.floor(Math.random() * 20) - 10; // -10..+9
      await wait(Math.max(18, speed + jitter));
    }
  }

  async function startTypingSequence() {
    const el1 = document.getElementById('typed1');
    const el2 = document.getElementById('typed2');
    const cur1 = document.getElementById('cursor1');
    const cur2 = document.getElementById('cursor2');
    if (!el1 || !el2 || !cur1 || !cur2) return;

    cur1.style.opacity = '1';
    cur2.style.opacity = '0';

    // type first line
    await typeToElement(line1, el1, 65, 150);
    await wait(320);
    cur1.style.opacity = '0';
    cur2.style.opacity = '1';

    // type second line
    await typeToElement(line2, el2, 55, 100);
    cur1.style.opacity = '0';
    cur2.style.opacity = '1';

    const parent = el1.closest('.typing-area');
    if (parent) parent.classList.add('typing-complete');
  }

  // Start typing (we are already in DOMContentLoaded)
  startTypingSequence();

  // No CV button handling (removed)
});
